import * as readline from "readline";
import { AFFIRMATIVE } from "../utils/constants";
import { printNumberedList, printSection, printSectionEnd, savedCityLabel } from "./output";
import type { AppState, City } from "../types";

/**
 * Entrada del usuario: la única interfaz de `readline` de la aplicación y los
 * selectores numerados.
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

interface SelectListOptions<T> {
  /** Título de la sección que encabeza el listado. */
  title: string;
  /** Pregunta que se hace después de mostrar la lista. */
  question: string;
  /** Cómo se muestra cada elemento. */
  toLabel: (item: T) => string;
}

/**
 * Muestra `items` numerados y devuelve el elegido.
 * Devuelve `null` cuando el usuario cancela (0, entrada inválida o lista vacía).
 */
export async function selectFromList<T>(
  prompt: Prompt,
  items: readonly T[],
  { title, question, toLabel }: SelectListOptions<T>
): Promise<T | null> {
  if (items.length === 0) {
    return null;
  }

  printSection(title);
  printNumberedList(items.map(toLabel));
  printSectionEnd();

  const answer = await prompt.ask(question);
  const index = Number.parseInt(answer, 10);
  if (!Number.isInteger(index) || index <= 0 || index > items.length) {
    return null;
  }
  return items[index - 1] ?? null;
}

/**
 * Muestra las ciudades guardadas numeradas (marca la default en verde) y
 * devuelve la elegida. `null` si cancela o la lista está vacía.
 */
export async function selectSavedCity(
  prompt: Prompt,
  state: AppState,
  question: string
): Promise<City | null> {
  return selectFromList(prompt, state.cities, {
    title: "Ciudades guardadas",
    question,
    toLabel: (city) => savedCityLabel(city, state.defaultCity),
  });
}
