export const marketplaceConfig = {
  name: "Vapor&Go",
  currency: {
    code: "EUR",
    symbol: "\u20AC",
    format: "suffix",
  },
  features: {
    billingCycle: "por_jornada",
    hasLocation: false,
  },
  localization: {
    clientMode: {
      navLink: "Mi Cuenta",
      searchPlaceholder: "Buscar maquinaria profesional o servicios de limpieza industrial...",
    },
    itemLabels: {
      singular: "servicio",
      plural: "servicios",
      capitalizedSingular: "Servicio",
      capitalizedPlural: "Servicios",
    },
  },
  database: {
    itemsTable: "equipos",
    ordersTable: "ordenes",
    profilesTable: "perfiles",
  },
};

export type MarketplaceConfig = typeof marketplaceConfig;
