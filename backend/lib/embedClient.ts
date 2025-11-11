// lib/embedClient.ts
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import path from "path";

let pythonServer: ChildProcessWithoutNullStreams | null = null;
const pending: { resolve: (v: number[]) => void; reject: (e: any) => void; ts: number }[] = [];

function startServerIfNeeded() {
  if (pythonServer) return;
  const script = path.join(process.cwd(), "scripts", "embed_server.py");
  // usar python3 o python según tu sistema
  pythonServer = spawn("python", [script], { stdio: ["pipe", "pipe", "pipe"] }) as ChildProcessWithoutNullStreams;
  pythonServer.stdout.setEncoding("utf8");
  let buffer = "";

  pythonServer.stdout.on("data", (chunk: string) => {
    buffer += chunk;
    let idx;
    while ((idx = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (!line) continue;
      // intentar parsear, si no es JSON lo ignoramos (por seguridad)
      try {
        const obj = JSON.parse(line);
        const p = pending.shift();
        if (!p) continue;
        // aceptar varias formas de respuesta
        if (Array.isArray(obj.embedding)) p.resolve(obj.embedding);
        else if (Array.isArray(obj.vec)) p.resolve(obj.vec);
        else if (obj.ok && Array.isArray(obj.vec)) p.resolve(obj.vec);
        else if (obj.embedding && Array.isArray(obj.embedding)) p.resolve(obj.embedding);
        else p.reject(new Error("invalid embed response shape"));
      } catch (e) {
        // no-JSON en stdout -> ignorar (pero si quieres log, hacerlo en stderr en Python)
        // console.warn("non-json stdout from embed server:", line);
        continue;
      }
    }
  });

  pythonServer.stderr.on("data", (d: string | Buffer) => {
    console.error("[PY-EMBED-ERR]:", d.toString());
  });

  const failAll = (err: any) => {
    while (pending.length) {
      const p = pending.shift()!;
      p.reject(err);
    }
  };

  pythonServer.on("exit", (code, sig) => {
    failAll(new Error(`embed server exited (${code ?? sig})`));
    pythonServer = null;
  });

  pythonServer.on("error", (err) => {
    failAll(err);
    pythonServer = null;
  });
}

export function embedQueryPersistent(text: string, timeoutMs = 5000): Promise<number[]> {
  startServerIfNeeded();

  return new Promise((resolve, reject) => {
    if (!pythonServer || !pythonServer.stdin) return reject(new Error("embed server not running"));

    pending.push({ resolve, reject, ts: Date.now() });
    try {
      pythonServer.stdin.write(JSON.stringify({ text }) + "\n");
    } catch (err) {
      const p = pending.pop();
      if (p) p.reject(err);
      return reject(err);
    }

    // timeout guard
    setTimeout(() => {
      const idx = pending.findIndex(x => x.ts + timeoutMs < Date.now());
      if (idx >= 0) {
        const [p] = pending.splice(idx, 1);
        p.reject(new Error("embed timeout"));
      }
    }, timeoutMs + 10);
  });
}
