export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Realiza un GET y devuelve el JSON ya tipado, traduciendo fallos a `ApiError`. */
export async function fetchJson<T>(input: string | URL): Promise<T> {
  let response: Response;
  try {
    response = await fetch(input);
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    throw new ApiError(`No se pudo conectar con el servicio: ${detail}`);
  }

  if (!response.ok) {
    throw new ApiError(
      `El servicio respondió ${response.status} ${response.statusText}`,
      response.status
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError("El servicio devolvió una respuesta inválida");
  }
}
