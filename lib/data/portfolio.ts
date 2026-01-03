// Portfolio data layer - Supabase integration

import {
  createSupabaseAdminClient,
  createSupabaseClient,
} from "@/lib/supabase/client";

export interface PortfolioProject {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  details: {
    location: string;
    year: string;
    scope: string;
  };
}

// Database row type (matches Supabase schema)
interface PortfolioRow {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  location: string | null;
  year: string | null;
  scope: string | null;
}

// Transform database row to PortfolioProject
function transformRow(row: PortfolioRow): PortfolioProject {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    image: row.image,
    description: row.description,
    details: {
      location: row.location || "",
      year: row.year || "",
      scope: row.scope || "",
    },
  };
}

// Transform PortfolioProject to database row
function transformToRow(
  project: Omit<PortfolioProject, "id"> | Partial<PortfolioProject>
): Partial<PortfolioRow> {
  const row: Partial<PortfolioRow> = {};

  if ("title" in project) row.title = project.title;
  if ("category" in project) row.category = project.category;
  if ("image" in project) row.image = project.image;
  if ("description" in project) row.description = project.description;
  if ("details" in project && project.details) {
    row.location = project.details.location;
    row.year = project.details.year;
    row.scope = project.details.scope;
  }

  return row;
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("portfolio").select("*");

  if (error) {
    console.error("Error fetching portfolio projects:", error);
    throw error;
  }

  // Helper function to extract year from various formats (single year, range, etc.)
  const extractYear = (yearStr: string | null): number | null => {
    if (!yearStr || !yearStr.trim()) return null;

    const trimmed = yearStr.trim();

    // Check for year range (e.g., "2025-2026", "2020-2021")
    const rangeMatch = trimmed.match(/(\d{4})\s*-\s*(\d{4})/);
    if (rangeMatch) {
      // Use the end year (second year) for sorting
      return parseInt(rangeMatch[2], 10);
    }

    // Check for single year
    const singleYearMatch = trimmed.match(/(\d{4})/);
    if (singleYearMatch) {
      return parseInt(singleYearMatch[1], 10);
    }

    // If no valid year found, return null
    return null;
  };

  // Sort: projects with year first (descending by year), then projects without year
  const sortedData = (data || []).sort((a, b) => {
    const aYear = extractYear(a.year);
    const bYear = extractYear(b.year);

    // Both have years - sort descending
    if (aYear !== null && bYear !== null) {
      return bYear - aYear;
    }
    // Only a has year - a comes first
    if (aYear !== null && bYear === null) {
      return -1;
    }
    // Only b has year - b comes first
    if (aYear === null && bYear !== null) {
      return 1;
    }
    // Neither has year - maintain original order (by id descending as fallback)
    return (b.id || 0) - (a.id || 0);
  });

  return sortedData.map(transformRow);
}

export async function createPortfolioProject(
  project: Omit<PortfolioProject, "id">
): Promise<PortfolioProject> {
  const supabase = createSupabaseAdminClient();

  const row = transformToRow(project);

  const { data, error } = await supabase
    .from("portfolio")
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error("Error creating portfolio project:", error);
    throw error;
  }

  return transformRow(data);
}

export async function updatePortfolioProject(
  id: number,
  project: Partial<PortfolioProject>
): Promise<PortfolioProject> {
  const supabase = createSupabaseAdminClient();

  const row = transformToRow(project);

  const { data, error } = await supabase
    .from("portfolio")
    .update(row)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating portfolio project:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Project not found");
  }

  return transformRow(data);
}

export async function deletePortfolioProject(id: number): Promise<void> {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("portfolio").delete().eq("id", id);

  if (error) {
    console.error("Error deleting portfolio project:", error);
    throw error;
  }
}
