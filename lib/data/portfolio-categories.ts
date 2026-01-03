// Portfolio categories data layer - Supabase integration

import {
  createSupabaseAdminClient,
  createSupabaseClient,
} from "@/lib/supabase/client";

export interface PortfolioCategory {
  name: string;
  image: string | null;
}

// Database row type
interface PortfolioCategoryRow {
  name: string;
  image: string | null;
}

export async function getPortfolioCategories(): Promise<PortfolioCategory[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("portfolio_categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching portfolio categories:", error);
    throw error;
  }

  return (data || []).map((row: PortfolioCategoryRow) => ({
    name: row.name,
    image: row.image,
  }));
}

export async function updatePortfolioCategory(
  name: string,
  image: string | null
): Promise<PortfolioCategory> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("portfolio_categories")
    .upsert({ name, image }, { onConflict: "name" })
    .select()
    .single();

  if (error) {
    console.error("Error updating portfolio category:", error);
    throw error;
  }

  return {
    name: data.name,
    image: data.image,
  };
}

export async function getPortfolioCategoryImage(
  name: string
): Promise<string | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("portfolio_categories")
    .select("image")
    .eq("name", name)
    .single();

  if (error) {
    // Category not found, return null
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching portfolio category image:", error);
    throw error;
  }

  return data?.image || null;
}
