import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabaseClient";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const correo = url.searchParams.get("correo");

    if (!correo) {
      return new Response(JSON.stringify({ error: "Correo requerido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Buscar en "personas"
    const { data: personas, error: errorPersonas } = await supabase
      .from("personas")
      .select("*")
      .eq("correo", correo)
      .limit(1);

    if (errorPersonas) throw errorPersonas;

    if (personas && personas.length > 0) {
      return new Response(JSON.stringify(personas[0]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Buscar en "familias"
    const { data: familias, error: errorFamilias } = await supabase
      .from("familias")
      .select("*")
      .eq("correo", correo)
      .limit(1);

    if (errorFamilias) throw errorFamilias;

    if (familias && familias.length > 0) {
      return new Response(JSON.stringify(familias[0]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Si no se encontró
    return new Response(JSON.stringify({ error: "Correo no registrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
