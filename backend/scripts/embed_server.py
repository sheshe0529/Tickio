# scripts/embed_server.py
import sys, json, traceback
# bajar logs extra de transformers
import logging
logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("sentence_transformers").setLevel(logging.ERROR)

from sentence_transformers import SentenceTransformer

MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"

try:
    model = SentenceTransformer(MODEL_NAME)
except Exception as e:
    # escribe error a stderr y sale con código 1
    sys.stderr.write("MODEL_LOAD_ERROR: " + str(e) + "\n")
    sys.stderr.flush()
    sys.exit(1)

# protocolo: leer JSON-line con {"text": "..."}
# responder exactamente una línea JSON: {"embedding": [...]} en stdout
for line in sys.stdin:
    if not line:
        continue
    try:
        obj = json.loads(line.strip())
        text = obj.get("text") or obj.get("q") or ""
        vec = model.encode(text, normalize_embeddings=True).tolist()
        # respuesta compacta y segura
        out = {"embedding": vec}
        sys.stdout.write(json.dumps(out) + "\n")
        sys.stdout.flush()
    except Exception as e:
        # usa stderr para todo logging/errores
        sys.stderr.write("ERROR: " + str(e) + "\n")
        sys.stderr.write(traceback.format_exc() + "\n")
        sys.stderr.flush()
        # responde algo para el cliente si quieres; aquí respondemos con error json en stdout
        sys.stdout.write(json.dumps({"error": str(e)}) + "\n")
        sys.stdout.flush()
