# scripts/seed_embeddings.py
from sentence_transformers import SentenceTransformer
import psycopg2
from tqdm import tqdm

MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"
DIM = 384

# Ajusta credenciales si hiciera falta (coinciden con tu .env/Docker)
CONN_STR = "dbname=postgres user=postgres password=postgres host=tickio-bd.cvizgbdlqbzk.us-east-1.rds.amazonaws.com port=5432 sslmode=require"


def main():
    model = SentenceTransformer(MODEL_NAME)

    conn = psycopg2.connect(CONN_STR)
    conn.autocommit = False
    cur = conn.cursor()

    # Trae solo los campos más relevantes
    cur.execute("""
        SELECT id, nombre, descripcion, "tipoEvento", subtipo
        FROM "Evento"
    """)
    rows = cur.fetchall()

    for (eid, nombre, desc, tipoEvento, subtipo) in tqdm(rows, desc="Embeddings"):
        # Texto enriquecido con señales semánticas
        parts = [
            str(nombre or ""),
            str(desc or ""),
            f"Tipo de evento: {tipoEvento or ''}",
            f"Subtipo: {subtipo or ''}",
        ]
        text = ". ".join([p for p in parts if p.strip()])

        # Genera el embedding normalizado
        vec = model.encode(text, normalize_embeddings=True).tolist()

        # Verificación defensiva de dimensión
        if len(vec) != DIM:
            raise ValueError(f"Dimensión inesperada {len(vec)} != {DIM}")

        # Actualiza el vector en la base de datos
        cur.execute('UPDATE "Evento" SET embedding = %s WHERE id = %s', (vec, eid))

    conn.commit()
    cur.close(); conn.close()
    print("✅ Embeddings generados y actualizados sin distrito")

if __name__ == "__main__":
    main()
