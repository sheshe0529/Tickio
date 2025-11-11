import sys, json
from sentence_transformers import SentenceTransformer


model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

query = " ".join(sys.argv[1:]).strip()
if not query:
    print(json.dumps([]))
    sys.exit(0)

# genera el embedding normalizado
vec = model.encode(query, normalize_embeddings=True).tolist()
print(json.dumps(vec))
