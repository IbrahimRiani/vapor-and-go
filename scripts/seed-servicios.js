const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Faltan variables: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seed() {
  // 1. Buscar o crear partner por defecto
  const { data: existing } = await supabase
    .from("perfiles")
    .select("id")
    .eq("rol", "partner")
    .limit(1)
    .maybeSingle();

  let partnerId;
  if (existing) {
    partnerId = existing.id;
    console.log("✅ Partner existente:", partnerId);
  } else {
    const { data: newPartner, error } = await supabase
      .from("perfiles")
      .insert({ rol: "partner", nombre_comercial: "Vapor&Go Demo" })
      .select("id")
      .single();
    if (error) throw new Error("Crear partner: " + error.message);
    partnerId = newPartner.id;
    console.log("✅ Partner creado:", partnerId);
  }

  // 2. Eliminar servicios previos (opcional)
  // await supabase.from("equipos").delete().eq("partner_id", partnerId);

  // 3. Insertar los 4 servicios
  const servicios = [
    {
      partner_id: partnerId,
      nombre: "Servicio de Desengrasado y Alta Presión HDS",
      descripcion: "Limpieza industrial con agua caliente a alta presión. Incluye operario especializado y maquinaria HDS. Ideal para suelos, maquinaria y superficies con grasa incrustada.",
      precio: 25000,
      categoria: "Limpieza Técnica",
      estado: "disponible",
    },
    {
      partner_id: partnerId,
      nombre: "Tratamiento de Desinfección Térmica por Vapor V4",
      descripcion: "Eliminación de patógenos mediante vapor seco a alta temperatura. Sin químicos. Certificado para industrias alimentaria, sanitaria y farmacéutica.",
      precio: 38000,
      categoria: "Sanitaria e Alimentaria",
      estado: "disponible",
    },
    {
      partner_id: partnerId,
      nombre: "Limpieza de Fachadas y Estructuras HD",
      descripcion: "Eliminación de residuos difíciles en fachadas, muros y estructuras industriales con agua fría presurizada. Incluye alpine y personal en altura.",
      precio: 19000,
      categoria: "Mantenimiento Industrial",
      estado: "stock_bajo",
    },
    {
      partner_id: partnerId,
      nombre: "Aspirado y Saneamiento de Suelos Continuos",
      descripcion: "Servicio de aspiración pesada, fregado y abrillantado de pavimentos continuos. Maquinaria industrial de arrastre para naves y almacenes.",
      precio: 22000,
      categoria: "Logística y Almacenes",
      estado: "disponible",
    },
  ];

  for (const s of servicios) {
    const { data, error } = await supabase.from("equipos").insert(s).select("id").single();
    if (error) {
      console.error(`❌ Error insertando "${s.nombre}":`, error.message);
    } else {
      console.log(`✅ Insertado: ${s.nombre} (${data.id})`);
    }
  }

  console.log("\n🎉 Seed completado.");
}

seed().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
