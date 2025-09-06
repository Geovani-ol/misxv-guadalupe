import { useState } from "react";

export default function VerificarCodigo({ personasSolas, personasAcompanadas, familias }) {
    const [codigo, setCodigo] = useState("");
    const [resultado, setResultado] = useState("");
    const [color, setColor] = useState("text-gray-700");
    const [info, setInfo] = useState(null); // Para guardar los datos completos

    const handleVerificar = () => {
        const codigoTrim = codigo.trim().toUpperCase();

        if (!codigoTrim) {
            setResultado("Por favor, ingrese un código.");
            setColor("text-red-600");
            setInfo(null);
            return;
        }

        const personaSola = personasSolas.find(
            (p) => String(p.codigo_acceso).trim().toUpperCase() === codigoTrim
        );
        const personaAcompanada = personasAcompanadas.find(
            (p) => String(p.codigo_acceso).trim().toUpperCase() === codigoTrim
        );
        const familia = familias.find(
            (f) => String(f.codigo_acceso).trim().toUpperCase() === codigoTrim
        );

        if (personaSola) {
            setResultado(`Código válido: ${personaSola.nombre} (Persona sola)`);
            setColor("text-green-600");
            setInfo(personaSola);
        } else if (personaAcompanada) {
            setResultado(`Código válido: ${personaAcompanada.nombre} (Persona acompañada)`);
            setColor("text-green-600");
            setInfo(personaAcompanada);
        } else if (familia) {
            setResultado(`Código válido: Familia ${familia.nombre_familia}`);
            setColor("text-green-600");
            setInfo(familia);
        } else {
            setResultado("Código inválido.");
            setColor("text-red-600");
            setInfo(null);
        }
    };

    const handleEnter = (e) => {
        if (e.key === "Enter") handleVerificar();
    };

    return (
        <section className="bg-white shadow-lg rounded-xl md:rounded-2xl p-6 text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif mb-4 text-gray-700">Verificar Código</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <input
                    type="text"
                    placeholder="Ingrese el código"
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#E2C290]"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    onKeyDown={handleEnter}
                />
                <button
                    onClick={handleVerificar}
                    className="px-6 py-2 bg-[#E2C290] font-serif rounded-lg shadow-md hover:bg-[#deb574] transition"
                >
                    Verificar
                </button>
            </div>

            <p className={`mt-4 text-lg font-semibold ${color}`}>{resultado}</p>

            {/* Mostrar info detallada */}
            {info && (
                <div className="mt-4 bg-gray-50 border border-gray-300 rounded-lg p-4 text-left max-w-md mx-auto shadow-sm">
                    {"nombre" in info && (
                        <>
                            <p><strong>Nombre:</strong> {info.nombre}</p>
                            <p><strong>Correo:</strong> {info.correo}</p>
                            {info.num_acompanantes !== undefined && (
                                <p><strong>Acompañantes:</strong> {info.num_acompanantes}</p>
                            )}
                            <p><strong>Mensaje:</strong> {info.mensaje}</p>
                            <p><strong>Código:</strong> {info.codigo_acceso}</p>
                        </>
                    )}
                    {"nombre_familia" in info && (
                        <>
                            <p><strong>Familia:</strong> {info.nombre_familia}</p>
                            <p><strong>Correo:</strong> {info.correo}</p>
                            <p><strong># Integrantes:</strong> {info.num_integrantes}</p>
                            <p><strong>Mensaje:</strong> {info.mensaje}</p>
                            <p><strong>Código:</strong> {info.codigo_acceso}</p>
                        </>
                    )}
                </div>
            )}
        </section>
    );
}
