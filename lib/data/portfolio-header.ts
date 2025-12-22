// Portfolio header content data layer - Supabase integration

import { createSupabaseClient, createSupabaseAdminClient } from "@/lib/supabase/client";

export interface PortfolioHeader {
  id: string;
  title: string;
  description: string;
}

export async function getPortfolioHeader(): Promise<PortfolioHeader> {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from("portfolio_header")
    .select("*")
    .eq("id", "portfolio-header")
    .single();

  if (error) {
    console.error("Error fetching portfolio header:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Portfolio header not found");
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
  };
}

export async function updatePortfolioHeader(
  header: Partial<PortfolioHeader>
): Promise<PortfolioHeader> {
  const supabase = createSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from("portfolio_header")
    .update(header)
    .eq("id", "portfolio-header")
    .select()
    .single();

  if (error) {
    console.error("Error updating portfolio header:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Portfolio header not found");
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
  };
}
