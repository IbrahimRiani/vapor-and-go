"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/src/context/AuthProvider";
import { marketplaceConfig } from "@/src/config/marketplace.config";

const cfg = marketplaceConfig;
const itemsTable = cfg.database.itemsTable;
const ordersTable = cfg.database.ordersTable;

export type Item = {
  id: string;
  ref: string;
  name: string;
  category: string;
  status: "Disponible" | "Stock bajo" | "Agotado";
  price: number;
  year: number;
  power: string;
  weight: string;
  image?: string;
  provider_id?: string;
  created_at?: string;
};

export type Order = {
  id: string;
  item_id: string;
  buyer_id: string;
  provider_id: string;
  status: "Completado" | "En proceso" | "Cancelado";
  amount: number;
  created_at: string;
  items?: Pick<Item, "id" | "name" | "ref" | "category">;
};

export type ItemFilters = {
  category?: string;
  status?: string[];
  search?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: "price-asc" | "price-desc" | "name";
};

export function useItems(filters: ItemFilters) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    let query = supabase.from(itemsTable).select("*");

    if (filters.category && filters.category !== "Todas") {
      query = query.eq("category", filters.category);
    }

    if (filters.status && filters.status.length > 0) {
      query = query.in("status", filters.status);
    }

    if (filters.priceMin !== undefined) {
      query = query.gte("price", filters.priceMin);
    }

    if (filters.priceMax !== undefined) {
      query = query.lte("price", filters.priceMax);
    }

    if (filters.search?.trim()) {
      const q = filters.search.trim();
      query = query.or(`name.ilike.%${q}%,ref.ilike.%${q}%,category.ilike.%${q}%`);
    }

    if (filters.sortBy === "price-asc") {
      query = query.order("price", { ascending: true });
    } else if (filters.sortBy === "price-desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("name", { ascending: true });
    }

    const { data, error: err } = await query;

    if (err) {
      setError(err);
    } else {
      setItems(data as Item[]);
    }

    setLoading(false);
  }, [
    filters.category,
    filters.status?.join(","),
    filters.search,
    filters.priceMin,
    filters.priceMax,
    filters.sortBy,
  ]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refetch: fetchItems };
}

export function useOrders() {
  const { user, viewMode } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const column = viewMode === "provider" ? "provider_id" : "buyer_id";

    const { data, error: err } = await supabase
      .from(ordersTable)
      .select("*, items:item_id(id, name, ref, category)")
      .eq(column, user.id)
      .order("created_at", { ascending: false });

    if (err) {
      setError(err);
    } else {
      setOrders(data as unknown as Order[]);
    }

    setLoading(false);
  }, [user?.id, viewMode]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}
