import { Router } from "express";
import prisma from "../config/prisma";
import { embedQueryPersistent } from "../../lib/embedClient"; // ajusta la ruta si tu lib está en otro lugar

const router = Router();

/* =========================
   LRU cache simple para qVec
   ========================= */
type CacheEntry = { vec: number[]; expiresAt: number };
const LRU_MAX = 500;                 // capacidad máx. (ajusta a gusto)
const LRU_TTL_MS = 6 * 60 * 60 * 1000; // TTL 6 horas (ajusta a gusto)
const lru = new Map<string, CacheEntry>();

function lruKey(q: string) {
  return q.toLowerCase().trim();
}
function getCached(q: string): number[] | null {
  const k = lruKey(q);
  const e = lru.get(k);
  if (!e) return null;
  if (Date.now() > e.expiresAt) { // expiró
    lru.delete(k);
    return null;
  }
  // refrescar LRU: mover al final
  lru.delete(k);
  lru.set(k, e);
  return e.vec;
}
function setCached(q: string, vec: number[]) {
  const k = lruKey(q);
  if (lru.has(k)) lru.delete(k);
  lru.set(k, { vec, expiresAt: Date.now() + LRU_TTL_MS });
  // recortar si excede
  if (lru.size > LRU_MAX) {
    const firstKey = lru.keys().next().value;
    if (firstKey) lru.delete(firstKey);
  }
}

/* =========================
   Nota: ya no usamos spawn por petición; usamos embedQueryPersistent
   que reutiliza un proceso Python persistente en lib/embedClient.ts
   ========================= */

router.get("/", async (req, res) => {
  const tTotalStart = Date.now();
  console.time("search_total");

  const q        = ((req.query.q as string) || "").trim();

  const distrito = req.query.distrito as string | undefined;     // enum "Distrito"
  const desde    = req.query.desde as string | undefined;        // YYYY-MM-DD
  const hasta    = req.query.hasta as string | undefined;        // YYYY-MM-DD
  const tipo     = req.query.tipo as string | undefined;         // enum "TipoEvento"
  const limit    = Number(req.query.limit || 10);
  const offset   = Number(req.query.offset || 0);

  // timing holders (ms)
  let embedMs: number | null = null;
  let dbMs: number | null = null;

  try {
    const hasQ = q.length > 0;

    // 1) Embedding (solo si hay q) con cache LRU
    let qVec: number[] | null = null;
    if (hasQ) {
      // intenta cache
      qVec = getCached(q);
      if (!qVec) {
        try {
          const tEmbedStart = Date.now();
          console.time("embed");

          // <-- Aquí usamos el cliente persistente (no spawn por petición)
          const v = await embedQueryPersistent(q);

          console.timeEnd("embed");
          embedMs = Date.now() - tEmbedStart;

          if (Array.isArray(v) && v.length === 384) {
            qVec = v;
            setCached(q, v);
          } else {
            qVec = null;
          }
        } catch (e) {
          // si falla, seguimos con FTS
          qVec = null;
          console.warn("embedQueryPersistent failed:", (e as Error).message || e);
        }
      }
    }

    // 2) SQL dinámico
    const where: string[] = ["1=1"];
    const params: any[] = [];
    let p = 1;

    // WITH q: con o sin vector
    const withQ = hasQ
      ? (qVec
          ? `WITH q AS (SELECT $${p++}::vector AS qvec, $${p++}::text AS qtext)`
          : `WITH q AS (SELECT NULL::vector AS qvec, $${p++}::text AS qtext)`)
      : "";

    // Distancia (pgvector cosine). OJO: esto es distancia; similitud = 1 - distancia
    const rawDistanceExpr = hasQ && qVec
      ? `(e.embedding <=> (SELECT qvec FROM q))`
      : `NULL::float`;

    // Filtros fuertes
    if (distrito) {
      where.push(`e."distrito" = $${p}::"Distrito"`);
      params.push(distrito); p++;
    }
    if (tipo) {
      where.push(`e."tipoEvento" = $${p}::"TipoEvento"`);
      params.push(tipo); p++;
    }
    if (desde) {
      where.push(`e.fecha_inicio >= $${p}::timestamp`);
      params.push(desde); p++;
    }
    if (hasta) {
      where.push(`e.fecha_fin <= $${p}::timestamp`);
      params.push(hasta); p++;
    }

    // Recorte de candidatos cuando hay q:
    if (hasQ) {
      // Umbral más laxo si no estás 100% seguro de normalización (1.10)
      // y/o deja que FTS pase.
      where.push(`
        (
          ${qVec ? `${rawDistanceExpr} < 0.5` : `FALSE`}
          OR
          to_tsvector('spanish', coalesce(e.nombre,'') || ' ' || coalesce(e.descripcion,'')) @@
            websearch_to_tsquery('spanish', (SELECT qtext FROM q))
        )
      `);
    }

    const limitIndex  = p++;
    const offsetIndex = p++;
    params.push(limit, offset);

    // 3) SQL final con CTE "base" para calcular score
    const sql = hasQ ? `
      ${withQ}
      , base AS (
        SELECT
          e.id, e.nombre, e.descripcion, e.direccion, e."distrito",
          e.fecha_inicio, e.fecha_fin, e.hora_inicio, e.duracion, e.aforo,
          e.estado, e."tipoEvento", e.subtipo,
          ${rawDistanceExpr} AS distance,
          to_tsvector('spanish', coalesce(e.nombre,'') || ' ' || coalesce(e.descripcion,'')) @@
            websearch_to_tsquery('spanish', (SELECT qtext FROM q)) AS text_match,
          -- Normaliza rank con flag 32 -> escala a [0..1] aprox.
          ts_rank_cd(
            to_tsvector('spanish', coalesce(e.nombre,'') || ' ' || coalesce(e.descripcion,'')),
            websearch_to_tsquery('spanish', (SELECT qtext FROM q)),
            32
          ) AS text_rank
        FROM "Evento" e
        WHERE ${where.join(" AND ")}
      )
      SELECT
        id, nombre, descripcion, direccion, "distrito",
        fecha_inicio, fecha_fin, hora_inicio, duracion, aforo,
        estado, "tipoEvento", subtipo,
        distance, text_match, text_rank,
        -- Similaridad coseno clamp a [-1,1], luego a [0,1]
        (
          COALESCE( ((GREATEST(-1, LEAST(1, 1 - distance)) + 1) / 2), 0) * 0.6
          + COALESCE(text_rank, 0) * 0.4
        ) AS score
      FROM base
      ORDER BY score DESC, fecha_inicio ASC
      LIMIT $${limitIndex} OFFSET $${offsetIndex}
    ` : `
      SELECT
        e.id, e.nombre, e.descripcion, e.direccion, e."distrito",
        e.fecha_inicio, e.fecha_fin, e.hora_inicio, e.duracion, e.aforo,
        e.estado, e."tipoEvento", e.subtipo,
        NULL::float AS distance,
        NULL::boolean AS text_match,
        NULL::float AS text_rank,
        NULL::float AS score
      FROM "Evento" e
      WHERE ${where.join(" AND ")}
      ORDER BY e.fecha_inicio ASC
      LIMIT $${limitIndex} OFFSET $${offsetIndex}
    `;

    // 4) Parámetros en orden correcto
    if (hasQ) {
      if (qVec) {
        // $1 vector, $2 text
        params.unshift(q);                    // pasa a ser $2
        params.unshift(JSON.stringify(qVec)); // pasa a ser $1 (formato "[...]" aceptado por pgvector)
      } else {
        // $1 text
        params.unshift(q);
      }
    }

    // -------------- Medición de la consulta a la BD --------------
    const tDbStart = Date.now();
    console.time("db");
    const rows = await prisma.$queryRawUnsafe(sql, ...params);
    console.timeEnd("db");
    dbMs = Date.now() - tDbStart;
    // ------------------------------------------------------------

 let items = rows as any[];

// NUEVA REGLA ROBUSTA:
// Si *ninguna* fila tiene distance válida (semantic) ni text_match true (FTS) => devolver vacío.
// Esto cubre: hasQ=false, hasQ=true con qVec=null, y casos en que la consulta devolvió filas
// pero todas con distance/text_match nulos (p.ej. por usar la rama sin q).
const anySemantic = items.some(r => r.distance !== null && r.distance !== undefined);
const anyFTS = items.some(r => r.text_match === true);

// Si no hay ni semántica ni FTS — devolvemos vacío
if (hasQ &&!anySemantic && !anyFTS) {
  console.log("No semantic nor FTS matches -> returning empty results to avoid returning whole table.");
  return res.json({ ok: true, count: 0, items: [] });
}

    // 5) Filtro opcional por score (relajado)
    const MIN_SCORE = 0.10; // bajar a 0.10 mientras calibras
    if (hasQ) {
      items = items.filter(r => r.score === null || r.score >= MIN_SCORE);
    }

    // 6) Fallback suave: si no hay nada y sí había vector, quita el recorte semántico/FTS
    if (hasQ && items.length === 0 && qVec) {
      // reconstruir WHERE sin el bloque de recorte (quitamos el paréntesis grande)
      const whereRelax = where.filter(w => !w.includes("to_tsvector(") && !w.includes(rawDistanceExpr));
      const relaxSql = `
        SELECT
          e.id, e.nombre, e.descripcion, e.direccion, e."distrito",
          e.fecha_inicio, e.fecha_fin, e.hora_inicio, e.duracion, e.aforo,
          e.estado, e."tipoEvento", e.subtipo,
          NULL::float AS distance,
          NULL::boolean AS text_match,
          NULL::float AS text_rank,
          NULL::float AS score
        FROM "Evento" e
        WHERE ${whereRelax.length ? whereRelax.join(" AND ") : "1=1"}
        ORDER BY e.fecha_inicio ASC
        LIMIT $1 OFFSET $2
      `;

      const tRelaxDbStart = Date.now();
      console.time("db_relax");
      items = await prisma.$queryRawUnsafe(relaxSql, limit, offset) as any[];
      console.timeEnd("db_relax");
      const relaxDbMs = Date.now() - tRelaxDbStart;
      // if we want, we can add relaxDbMs to dbMs or log it
      console.log(`DB relax query time: ${relaxDbMs} ms`);
    }

    const totalMs = Date.now() - tTotalStart;
    console.timeEnd("search_total");

    console.log(`Timings (ms): embed=${embedMs ?? "n/a"}, db=${dbMs ?? "n/a"}, total=${totalMs}`);

    res.json({ ok: true, count: items.length, items, timings: { embedMs, dbMs, totalMs } });
  } catch (err: any) {
    console.error("SEARCH_ERROR:", err?.message || err);
    console.timeEnd("search_total");
    const totalMs = Date.now() - tTotalStart;
    res.status(500).json({ ok: false, error: err?.message || "Error en búsqueda", timings: { embedMs, dbMs, totalMs } });
  }
});

export default router;
