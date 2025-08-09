import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [texto, setTexto] = useState("");
  const [prompt, setPrompt] = useState(
    "Resume el siguiente texto en 5 puntos clave y un párrafo final claro:"
  );
  const [resumen, setResumen] = useState("");
  const [resumenId, setResumenId] = useState(null);
  const [cargando, setCargando] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

  const generarResumen = async () => {
    if (!texto.trim() || !prompt.trim()) {
      alert("Por favor completa el prompt y el texto.");
      return;
    }
    setCargando(true);
    setResumen("");
    try {
      const resp = await axios.post(`${API_BASE}/resumir`, { texto, prompt });
      setResumen(resp.data.resumen);
      setResumenId(resp.data.id);
    } catch (err) {
      console.error("Error al generar:", err);
      alert(err.response?.data?.detail || err.message || "Error al conectar");
    } finally {
      setCargando(false);
    }
  };

  const descargarPDF = () => {
    if (!resumenId) {
      alert("Primero genera un resumen para descargar el PDF.");
      return;
    }
    window.open(`${API_BASE}/exportar/${resumenId}`, "_blank");
  };

  return (
    <div className="p-6 max-w-xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">📝 Resumen IA (Gemini)</h1>

      {/* Prompt editable */}
      <label className="block mb-2 font-semibold">Prompt (editable)</label>
      <textarea
        rows={3}
        className="w-full p-2 border rounded mb-4"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Texto a resumir */}
      <label className="block mb-2 font-semibold">Texto</label>
      <textarea
        rows={8}
        className="w-full p-2 border rounded mb-4"
        placeholder="Pega aquí tu texto..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      {/* Botones */}
      <div className="flex gap-2">
        <button
          onClick={generarResumen}
          disabled={cargando}
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:opacity-50"
        >
          {cargando ? "Generando..." : "Generar Resumen"}
        </button>
      </div>

      {/* Resultado */}
      {resumen && (
        <>
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h2 className="font-bold mb-2">Resultado</h2>
            <pre className="whitespace-pre-wrap">{resumen}</pre>
          </div>

          <button
            onClick={descargarPDF}
            className="mt-6 mb-20 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Descargar PDF
          </button>
        </>
      )}
    </div>
  );
}

export default App;
