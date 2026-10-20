import { colors, colorsEnabled } from "../utils/colors";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const INTERVAL_MS = 80;

/**
 * Ejecuta una tarea asíncrona mostrando un indicador de carga mientras corre.
 * Si la salida no es una terminal (o no hay colores), no dibuja nada.
 */
export async function withLoading<T>(message: string, task: () => Promise<T>): Promise<T> {
  if (!colorsEnabled) {
    return task();
  }

  let frame = 0;
  const render = () => {
    const glyph = FRAMES[frame % FRAMES.length] ?? "";
    process.stdout.write(`\r${colors.cyan(glyph)} ${colors.dim(message)}`);
    frame += 1;
  };

  render();
  const timer = setInterval(render, INTERVAL_MS);

  try {
    return await task();
  } finally {
    clearInterval(timer);
    process.stdout.write("\r\u001b[K");
  }
}
