import { colors } from "./colors";

export function success(message: string): void {
  console.log(`\n${colors.green(message)}\n`);
}

export function info(message: string): void {
  console.log(`\n${colors.cyan(message)}\n`);
}

export function warn(message: string): void {
  console.log(`\n${colors.yellow(message)}\n`);
}

export function error(message: string): void {
  console.error(`\n${colors.red(message)}\n`);
}

export function printError(cause: unknown): void {
  const detail = cause instanceof Error ? cause.message : String(cause);
  error(`Error: ${detail}`);
}
