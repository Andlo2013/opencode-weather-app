import * as readline from "readline";

/**
 * Envuelve una única interfaz de `readline` para toda la aplicación.
 *
 * Importante:
 *  - Crear interfaces adicionales sobre el mismo `process.stdin` rompe el bucle
 *    del menú (la interfaz interna "roba" el input y la app termina al cerrarse).
 *  - Leemos con el evento `line` y encolamos, en vez de `rl.question`, porque
 *    `question` puede perder líneas ya bufferizadas al alternar preguntas.
 */
export interface Prompt {
  ask(question: string): Promise<string>;
  confirm(question: string): Promise<boolean>;
  pause(message?: string): Promise<void>;
  close(): void;
}

const AFFIRMATIVE = new Set(["s", "si", "sí", "y", "yes"]);

/** Se lanza cuando `stdin` se cierra (p. ej. entrada por pipe): la app debe salir. */
export class PromptClosedError extends Error {
  constructor() {
    super("La entrada estándar se cerró.");
    this.name = "PromptClosedError";
  }
}

interface PendingRequest {
  resolve: (value: string) => void;
  reject: (error: Error) => void;
}

export function createPrompt(): Prompt {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const pending: PendingRequest[] = [];
  const buffered: string[] = [];
  let closed = false;

  rl.on("line", (line) => {
    const value = line.trim();
    const request = pending.shift();
    if (request) {
      request.resolve(value);
    } else {
      buffered.push(value);
    }
  });

  rl.on("close", () => {
    closed = true;
    for (const request of pending.splice(0)) {
      request.reject(new PromptClosedError());
    }
  });

  function ask(question: string): Promise<string> {
    process.stdout.write(question);

    const queued = buffered.shift();
    if (queued !== undefined) {
      return Promise.resolve(queued);
    }
    if (closed) {
      return Promise.reject(new PromptClosedError());
    }
    return new Promise((resolve, reject) => {
      pending.push({ resolve, reject });
    });
  }

  return {
    ask,
    async confirm(question: string): Promise<boolean> {
      const answer = (await ask(question)).toLowerCase();
      return AFFIRMATIVE.has(answer);
    },
    async pause(message = "Presiona Enter para continuar..."): Promise<void> {
      await ask(message);
    },
    close(): void {
      rl.close();
    },
  };
}
