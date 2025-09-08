import React, { useState } from "react";
import ConfirmarAsistencia from "./ConfirmarAsistencia";

export default function AsistenciaWrapper() {
  const [vista, setVista] = useState("confirmar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [correo, setCorreo] = useState("");
  const [pase, setPase] = useState(null);

  async function handleConsulta(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/consultar?correo=${encodeURIComponent(correo)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Correo no registrado");
        return;
      }

      setPase(data);
      setVista("pase");
    } catch (err) {
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-12 px-4 max-w-3xl mx-auto space-y-2">
      
      {vista === "confirmar" && (
        <div className="">
          <ConfirmarAsistencia />
          <div className="text-center">
            <button
              onClick={() => setVista("consulta")}
              className="px-6 py-3 bg-[#deb574] font-serif rounded-lg shadow-2xs shadow-gray-700 md:hover:scale-105 transition"
            >
              Consultar mi Pase
            </button>
          </div>
        </div>
      )}

      {vista === "consulta" && (
        <form
          onSubmit={handleConsulta}
          className="bg-white p-8 rounded-xl shadow-lg max-w-xl mx-auto space-y-6"
        >
          <h2 className="text-2xl font-serif font-semibold text-center text-gray-700">
            Consulta tu Pase
          </h2>
          <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E2C290]"
            required
          />
          {error && <p className="text-red-600 text-center">{error}</p>}
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#deb574] font-serif rounded-lg shadow-2xs shadow-gray-700 md:hover:scale-105 transition"
            >
              {loading ? "Consultando..." : "Consultar"}
            </button>
            <button
              type="button"
              onClick={() => setVista("confirmar")}
              className="px-6 py-3 bg-gray-400 font-serif rounded-lg shadow-2xs shadow-gray-700 md:hover:scale-105 transition"
            >
              Confirmar Asistencia
            </button>
          </div>
        </form>
      )}

      {vista === "pase" && pase && (
        <div className="bg-gray-700 p-8 rounded-2xl shadow-xl max-w-xl mx-auto text-gray-700 space-y-4">
          <h2 className="text-4xl md:text-5xl text-center font-[Dancing_Script] text-[#E2C290] mb-8">
            Pase
          </h2>

          <div className="bg-white p-6 rounded-xl shadow-md space-y-2">
            {pase.nombre && (
              <>
                <p><strong>Nombre:</strong> {pase.nombre}</p>
                {pase.num_acompanantes !== undefined && (
                  <p><strong>Acompañantes:</strong> {pase.num_acompanantes}</p>
                )}
              </>
            )}
            {pase.nombre_familia && (
              <>
                <p><strong>Familia:</strong> {pase.nombre_familia}</p>
                <p><strong>Integrantes:</strong> {pase.num_integrantes}</p>
              </>
            )}
            <p><strong>Correo:</strong> {pase.correo}</p>
            {pase.mensaje && <p className="italic">“{pase.mensaje}”</p>}
            <p className="mt-2 font-serif text-center bg-gray-100 p-2 rounded-lg shadow-inner">
              Código de Acceso: <span className="font-bold">{pase.codigo_acceso}</span>
            </p>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => setVista("consulta")}
              className="px-6 py-3 text-black bg-[#deb574] font-serif rounded-lg shadow-2xs shadow-gray-200 md:hover:scale-105 transition"
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
