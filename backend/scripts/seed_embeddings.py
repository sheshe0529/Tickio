# scripts/seed_embeddings.py
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import psycopg2
from tqdm import tqdm

load_dotenv()  # Carga el archivo .env

MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"
DIM = 384

# 🔐 Ahora usa la variable de entorno DATABASE_URL
CONN_STR = os.getenv("DATABASE_URL")

if not CONN_STR:
    raise EnvironmentError("❌ DATABASE_URL no está definido en el .env")

def main():
    print("🔌 Conectando a la base de datos...")
    conn = psycopg2.connect(CONN_STR)
    conn.autocommit = False
    cur = conn.cursor()

    print("🤖 Cargando modelo de embeddings...")
    model = SentenceTransformer(MODEL_NAME)

    print("📥 Obteniendo eventos de la base de datos...")
    cur.execute("""
        SELECT id, nombre, descripcion, "tipoEvento", subtipo
        FROM "Evento"
    """)
    rows = cur.fetchall()

    print(f"🧠 Generando embeddings para {len(rows)} eventos...\n")

    for (eid, nombre, desc, tipoEvento, subtipo) in tqdm(rows, desc="Embeddings"):
        parts = [
            str(nombre or ""),
            str(desc or ""),
            f"Tipo de evento: {tipoEvento or ''}",
            f"Subtipo: {subtipo or ''}",
        ]
        text = ". ".join([p for p in parts if p.strip()])

        vec = model.encode(text, normalize_embeddings=True).tolist()

        if len(vec) != DIM:
            raise ValueError(f"Dimensión inesperada {len(vec)} != {DIM}")

        cur.execute('UPDATE "Evento" SET embedding = %s WHERE id = %s', (vec, eid))

    conn.commit()
    cur.close()
    conn.close()

    print("\n✅ Embeddings generados y guardados correctamente!")

if __name__ == "__main__":
    main()
