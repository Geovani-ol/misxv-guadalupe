import React, { useState } from "react";

const INITIAL_FORM = {
  nombrePersona: "",
  correoPersona: "",
  acompanado: "no",
  numAcompanantes: "",
  mensajePersona: "",
  nombreFamilia: "",
  correoFamilia: "",
  integrantes: "",
  mensajeFamilia: "",
};

export default function ConfirmarAsistencia() {
  const [tipo, setTipo] = useState("persona");
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successCode, setSuccessCode] = useState(null);
  const [correoRegistrado, setCorreoRegistrado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessCode(null);
    setLoading(true);

    try {
      let payload;
      if (tipo === "persona") {
        if (!form.nombrePersona.trim() || !form.correoPersona.trim()) {
          setError("Nombre y correo son requeridos.");
          setLoading(false);
          return;
        }
        payload = {
          tipo: "persona",
          nombre: form.nombrePersona.trim(),
          correo: form.correoPersona.trim(),
          acompanado: form.acompanado,
          numAcompanantes: form.acompanado === "si" && form.numAcompanantes ? Number(form.numAcompanantes) : 0,
          mensaje: form.mensajePersona?.trim() || null,
        };
      } else {
        if (!form.nombreFamilia.trim() || !form.correoFamilia.trim() || !form.integrantes) {
          setError("Nombre de familia, correo y número de integrantes son requeridos.");
          setLoading(false);
          return;
        }
        payload = {
          tipo: "familia",
          nombreFamilia: form.nombreFamilia.trim(),
          correo: form.correoFamilia.trim(),
          integrantes: Number(form.integrantes),
          mensaje: form.mensajeFamilia?.trim() || null,
        };
      }

      const res = await fetch("/api/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.error?.includes("ya registrado")) {
          setError(result.error);
          console.warn("Correo ya registrado:", payload.correo);
          return;
        }
        throw new Error(result.error || "Error al guardar confirmación");
      }

      setSuccessCode(result.codigo ?? "(sin código)");
      console.log("✅ Confirmación guardada. Código:", result.codigo ?? "(sin código)");
      setForm({ ...INITIAL_FORM });
    } catch (err) {
      console.error("❌ Error:", err?.message || String(err));
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }



  return (
    <section className="relative flex flex-col items-center justify-center py-12 px-4">
      <h2 className="text-4xl md:text-5xl font-[Dancing_Script] text-shadow-lg text-shadow-[#E2C290] text-center mb-4">
        Confirmar Asistencia
      </h2>

      <p className="text-center text-gray-700 mb-6 max-w-lg font-serif">
        Elige <span className="font-semibold">Persona</span> si asistirás solo o acompañado.
        Elige <span className="font-semibold">Familia</span> si asistirán varios miembros de tu familia.
      </p>

      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setTipo("persona")}
          className={`px-4 py-2 rounded-md font-serif ${tipo === "persona" ? "bg-[#E2C290]" : "bg-gray-200"} shadow-2xs shadow-gray-700 md:hover:scale-105 transition`}
        >
          Persona
        </button>
        <button
          type="button"
          onClick={() => setTipo("familia")}
          className={`px-4 py-2 rounded-md font-serif ${tipo === "familia" ? "bg-[#E2C290]" : "bg-gray-200"} shadow-2xs shadow-gray-700 md:hover:scale-105 transition`}
        >
          Familia
        </button>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md space-y-4">
        {tipo === "persona" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input name="nombrePersona" value={form.nombrePersona} onChange={handleChange} required className="mt-1 block p-2 w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <input name="correoPersona" type="email" value={form.correoPersona} onChange={handleChange} required className="mt-1 block p-2 w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">¿Asistirá acompañado?</label>
              <select name="acompanado" value={form.acompanado} onChange={handleChange} className="mt-1 block w-full p-2 rounded-md border-gray-300">
                <option value="no">No, iré solo</option>
                <option value="si">Sí, acompañado</option>
              </select>
            </div>
            {form.acompanado === "si" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Número de acompañantes</label>
                <input name="numAcompanantes" type="number" min={1} value={form.numAcompanantes} onChange={handleChange} className="mt-1 block p-2 w-full rounded-md border-gray-300" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Mensaje (opcional)</label>
              <textarea name="mensajePersona" value={form.mensajePersona} onChange={handleChange} rows={3} className="mt-1 block w-full p-2 rounded-md border-gray-300" />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre de la familia</label>
              <input name="nombreFamilia" value={form.nombreFamilia} onChange={handleChange} required className="mt-1 block p-2 w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <input name="correoFamilia" type="email" value={form.correoFamilia} onChange={handleChange} required className="mt-1 block p-2 w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Número de integrantes</label>
              <input name="integrantes" type="number" min={1} value={form.integrantes} onChange={handleChange} required className="mt-1 block p-2 w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mensaje (opcional)</label>
              <textarea name="mensajeFamilia" value={form.mensajeFamilia} onChange={handleChange} rows={3} className="mt-1 block w-full p-2 rounded-md border-gray-300" />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading || correoRegistrado}
          className="w-full bg-[#E2C290] py-2 rounded-md font-serif shadow-2xs shadow-gray-700 md:hover:scale-105 transition"
        >
          {loading ? "Enviando..." : correoRegistrado ? "Correo ya registrado" : "Confirmar"}
        </button>

      </form>

      {successCode && (
        <div className="mt-4 p-4 rounded-md bg-green-100 border border-green-400 text-green-800 font-semibold text-center animate-fade-in">
          🎉 Confirmación guardada. Tu código es: <span className="font-mono">{successCode}</span>
        </div>
      )}

    </section>
  );
}
