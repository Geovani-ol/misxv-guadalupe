// src/components/AdminPanel.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import VerificarCodigo from "./VerificarCodigo";
import AnimatedNumber from "./AnimatedNumber";

export default function AdminPanel() {
  const [personas, setPersonas] = useState([]);
  const [familias, setFamilias] = useState([]);

  // Cargar datos + escuchar realtime
  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("realtime-admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "personas" },
        () => fetchData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "familias" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchData() {
    const { data: personasData } = await supabase.from("personas").select("*");
    const { data: familiasData } = await supabase.from("familias").select("*");

    setPersonas(personasData ?? []);
    setFamilias(familiasData ?? []);
  }

  // Separar por tipo
  const personasSolas = personas.filter((p) => !p.acompanado);
  const personasAcompanadas = personas.filter((p) => p.acompanado);

  // Calcular totales
  const totalPersonasSolas = personasSolas.length;
  const totalAcompanadas = personasAcompanadas.reduce(
    (acc, p) => acc + 1 + (p.num_acompanantes || 0),
    0
  );
  const totalFamilias = familias.reduce(
    (acc, f) => acc + (f.num_integrantes || 0),
    0
  );
  const totalAsistentes =
    totalPersonasSolas + totalAcompanadas + totalFamilias;

  return (
    <main className="max-w-6xl mx-auto space-y-12 p-2 md:p-6 bg-gradient-to-l from-[#E2C290] via-[#F7E7CE] to-[#E2C290]">
      <h1 className="text-5xl md:text-6xl font-[Dancing_Script] text-center mt-5 md:my-10 text-shadow-lg text-shadow-[#E2C290]">
        Panel de Confirmaciones
      </h1>

      {/* Buscador */}
      <VerificarCodigo
        personasSolas={personasSolas}
        personasAcompanadas={personasAcompanadas}
        familias={familias}
      />

      {/* TOTAL ASISTENTES */}
      <div className="bg-white shadow-lg rounded-2xl p-6 text-center mx-auto">
        <h2 className="text-2xl md:text-3xl font-serif text-gray-700">
          Total de Asistentes Confirmados
        </h2>
        <p className="text-4xl md:text-5xl font-bold text-gray-800 text-shadow-md text-shadow-[#E2C290] mt-3">
          <AnimatedNumber value={totalAsistentes} />
        </p>
        <p className="text-sm text-gray-500 mt-2">
          (Personas, acompañantes y familias)
        </p>
      </div>

      {/* PERSONAS SOLAS */}
      <section className="bg-white shadow-xl rounded-xl md:rounded-2xl mt-12 px-2 py-6 md:p-6 overflow-x-auto">
        <h2 className="text-2xl md:text-3xl font-serif mb-6 text-center text-gray-800">
          Personas Solas
        </h2>
        <table className="min-w-[700px] md:min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-800 text-[#E2C290] uppercase text-sm md:text-base">
            <tr>
              <th className="px-4 py-3 border-b">Nombre</th>
              <th className="px-4 py-3 border-b">Correo</th>
              <th className="px-4 py-3 border-b text-center">Mensaje</th>
              <th className="px-4 py-3 border-b text-center">Código</th>
            </tr>
          </thead>
          <tbody>
            {personasSolas.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-shadow shadow-sm">
                <td className="px-4 py-2 border-b">{p.nombre}</td>
                <td className="px-4 py-2 border-b">{p.correo}</td>
                <td className="px-4 py-2 border-b text-center min-w-[250px] break-words whitespace-normal">
                  {p.mensaje}
                </td>
                <td className="px-4 py-2 border-b text-center font-mono">
                  {p.codigo_acceso}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* PERSONAS ACOMPAÑADAS */}
      <section className="bg-white shadow-xl rounded-2xl md:rounded-2xl px-2 py-6 md:p-6 overflow-x-auto">
        <h2 className="text-2xl md:text-3xl font-serif mb-6 text-center text-gray-800">
          Personas Acompañadas
        </h2>
        <table className="min-w-[850px] md:min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-800 text-[#E2C290] uppercase text-sm md:text-base">
            <tr>
              <th className="px-4 py-3 border-b">Nombre</th>
              <th className="px-4 py-3 border-b">Correo</th>
              <th className="px-4 py-3 border-b text-center">Acompañantes</th>
              <th className="px-4 py-3 border-b text-center">Mensaje</th>
              <th className="px-4 py-3 border-b text-center">Código</th>
            </tr>
          </thead>
          <tbody>
            {personasAcompanadas.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-shadow shadow-sm">
                <td className="px-4 py-2 border-b">{p.nombre}</td>
                <td className="px-4 py-2 border-b">{p.correo}</td>
                <td className="px-4 py-2 border-b text-center">{p.num_acompanantes}</td>
                <td className="px-4 py-2 border-b text-center min-w-[250px] break-words whitespace-normal">
                  {p.mensaje}
                </td>
                <td className="px-4 py-2 border-b text-center font-mono">
                  {p.codigo_acceso}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* FAMILIAS */}
      <section className="bg-white shadow-xl rounded-xl md:rounded-2xl px-2 py-6 md:p-6 mb-10 overflow-x-auto">
        <h2 className="text-2xl md:text-3xl font-serif mb-6 text-center text-gray-800">
          Familias
        </h2>
        <table className="min-w-[900px] md:min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-800 text-[#E2C290] uppercase text-sm md:text-base">
            <tr>
              <th className="px-4 py-3 border-b">Familia</th>
              <th className="px-4 py-3 border-b">Correo</th>
              <th className="px-4 py-3 border-b text-center">Integrantes</th>
              <th className="px-4 py-3 border-b text-center">Mensaje</th>
              <th className="px-4 py-3 border-b text-center">Código</th>
            </tr>
          </thead>
          <tbody>
            {familias.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50 transition-shadow shadow-sm">
                <td className="px-4 py-2 border-b">{f.nombre_familia}</td>
                <td className="px-4 py-2 border-b">{f.correo}</td>
                <td className="px-4 py-2 border-b text-center">{f.num_integrantes}</td>
                <td className="px-4 py-2 border-b text-center min-w-[250px] break-words whitespace-normal">
                  {f.mensaje}
                </td>
                <td className="px-4 py-2 border-b text-center font-mono">
                  {f.codigo_acceso}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
