type Nivel = "info" | "warn" | "error";

function log(nivel: Nivel, mensaje: string, datos?: Record<string, unknown>) {
  if (process.env.LOG_LEVEL === "silent") return;
  const linea = JSON.stringify({ nivel, mensaje, ...datos, fecha: new Date().toISOString() });
  if (nivel === "error") console.error(linea);
  else console.log(linea);
}

export const logger = {
  info: (mensaje: string, datos?: Record<string, unknown>) => log("info", mensaje, datos),
  warn: (mensaje: string, datos?: Record<string, unknown>) => log("warn", mensaje, datos),
  error: (mensaje: string, datos?: Record<string, unknown>) => log("error", mensaje, datos),
};
