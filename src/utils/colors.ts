/**
 * Helpers ANSI sin dependencias. Respeta `NO_COLOR` y, salvo que se fuerce con
 * `FORCE_COLOR`, solo colorea cuando la salida es una terminal.
 */
const enabled =
  !process.env.NO_COLOR &&
  (process.env.FORCE_COLOR !== undefined && process.env.FORCE_COLOR !== "0"
    ? true
    : Boolean(process.stdout.isTTY));

function paint(open: number, close: number): (text: string) => string {
  return (text: string) => (enabled ? `\u001b[${open}m${text}\u001b[${close}m` : text);
}

export const colors = {
  cyan: paint(36, 39),
  yellow: paint(33, 39),
  green: paint(32, 39),
  red: paint(31, 39),
  dim: paint(2, 22),
  bold: paint(1, 22),
};

export const colorsEnabled = enabled;
