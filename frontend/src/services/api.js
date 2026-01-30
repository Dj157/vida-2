// src/services/api.js
export async function getMonitoramento() {
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
  const res = await fetch(API_BASE_URL + "/monitoramento?t=" + Date.now());
  if (!res.ok) throw new Error("Falha ao buscar monitoramento");
  return res.json();
}

