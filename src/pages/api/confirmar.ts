// src/pages/api/confirmar.ts
import type { APIRoute } from "astro";

export const prerender = false;
import { supabase } from "../../lib/supabaseClient";
import { generarCodigo } from "../../lib/utils";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { tipo, ...data } = body;

    console.log("Datos recibidos en /api/confirmar:", body);

    // 👇 Aquí siempre generamos el código
    const codigo = generarCodigo();

    if (tipo === "persona") {
      const { error } = await supabase.from("personas").insert([
        {
          nombre: data.nombre,
          correo: data.correo,
          acompanado: data.acompanado === "si",
          num_acompanantes: data.numAcompanantes || 0,
          mensaje: data.mensaje,
          codigo_acceso: codigo,
        },
      ]);
      if (error) throw error;
    }

    if (tipo === "familia") {
      const { error } = await supabase.from("familias").insert([
        {
          nombre_familia: data.nombreFamilia,
          correo: data.correo,
          num_integrantes: data.integrantes,
          mensaje: data.mensaje,
          codigo_acceso: codigo,
        },
      ]);
      if (error) throw error;
    }

    return new Response(JSON.stringify({ success: true, codigo }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("❌ Error en /api/confirmar:", err?.message || err, err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message || String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};