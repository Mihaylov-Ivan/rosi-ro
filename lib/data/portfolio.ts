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
  location: string;
  year: string;
  scope: string;
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
      location: row.location,
      year: row.year,
      scope: row.scope,
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

  const { data, error } = await supabase
    .from("portfolio")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching portfolio projects:", error);
    throw error;
  }

  return data.map(transformRow);
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
