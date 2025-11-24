// src/services/api.js
export async function getMonitoramento() {
  // Usa URL relativa para funcionar em qualquer ambiente
  const res = await fetch("/api/monitoramento?t=" + Date.now());
  if (!res.ok) throw new Error("Falha ao buscar monitoramento");
  return res.json();
}

