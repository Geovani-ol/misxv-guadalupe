import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabaseClient";
import { generarCodigo } from "../../lib/utils";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { tipo, ...data } = body;

    const codigo = generarCodigo();

    if (tipo === "persona") {
      // Verificar si el correo ya existe en personas o familias
      const { data: existingPerson } = await supabase
        .from("personas")
        .select("id")
        .eq("correo", data.correo)
        .limit(1);

      const { data: existingFamily } = await supabase
        .from("familias")
        .select("id")
        .eq("correo", data.correo)
        .limit(1);

      if ((existingPerson && existingPerson.length > 0) || (existingFamily && existingFamily.length > 0)) {
        return new Response(JSON.stringify({ error: "Este correo ya está registrado" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

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
      // Verificar si el correo ya existe en personas o familias
      const { data: existingPerson } = await supabase
        .from("personas")
        .select("id")
        .eq("correo", data.correo)
        .limit(1);

      const { data: existingFamily } = await supabase
        .from("familias")
        .select("id")
        .eq("correo", data.correo)
        .limit(1);

      if ((existingPerson && existingPerson.length > 0) || (existingFamily && existingFamily.length > 0)) {
        return new Response(JSON.stringify({ error: "Este correo ya está registrado" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

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
