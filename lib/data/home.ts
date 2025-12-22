// Home page content data layer - Supabase integration

import {
  createSupabaseAdminClient,
  createSupabaseClient,
} from "@/lib/supabase/client";

export interface HomeContent {
  id: string;
  hero: {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
  };
  services: {
    title: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
  about: {
    title: string;
    paragraphs: string[];
  };
  contact: {
    title: string;
    address: string;
    phone: string;
    email: string;
  };
  footer: {
    copyright: string;
    tagline: string;
  };
}

interface ServiceRow {
  id: string;
  title: string;
  description: string;
  display_order: number;
}

interface AboutParagraphRow {
  id: number;
  content: string;
  display_order: number;
  is_bold: boolean;
}

export async function getHomeContent(): Promise<HomeContent> {
  const supabase = createSupabaseClient();

  // Fetch home content
  const { data: homeData, error: homeError } = await supabase
    .from("home_content")
    .select("*")
    .eq("id", "home")
    .single();

  if (homeError) {
    console.error("Error fetching home content:", homeError);
    throw homeError;
  }

  if (!homeData) {
    throw new Error("Home content not found");
  }

  // Fetch services
  const { data: servicesData, error: servicesError } = await supabase
    .from("services")
    .select("*")
    .eq("home_content_id", "home")
    .order("display_order", { ascending: true });

  if (servicesError) {
    console.error("Error fetching services:", servicesError);
    throw servicesError;
  }

  // Fetch about paragraphs
  const { data: paragraphsData, error: paragraphsError } = await supabase
    .from("about_paragraphs")
    .select("*")
    .eq("home_content_id", "home")
    .order("display_order", { ascending: true });

  if (paragraphsError) {
    console.error("Error fetching about paragraphs:", paragraphsError);
    throw paragraphsError;
  }

  // Transform data
  const hero = homeData.hero as HomeContent["hero"];
  const contact = homeData.contact as HomeContent["contact"];
  const footer = homeData.footer as HomeContent["footer"];

  return {
    id: homeData.id,
    hero,
    services: {
      title: homeData.services_title,
      items: (servicesData || []).map((s: ServiceRow) => ({
        id: s.id,
        title: s.title,
        description: s.description,
      })),
    },
    about: {
      title: homeData.about_title,
      paragraphs: (paragraphsData || []).map(
        (p: AboutParagraphRow) => p.content
      ),
    },
    contact,
    footer,
  };
}

export async function updateHomeContent(
  content: Partial<HomeContent>
): Promise<HomeContent> {
  const supabase = createSupabaseAdminClient();

  // Update home_content table
  const homeUpdate: any = {};

  if (content.hero) {
    homeUpdate.hero = content.hero;
  }
  if (content.services?.title) {
    homeUpdate.services_title = content.services.title;
  }
  if (content.about?.title) {
    homeUpdate.about_title = content.about.title;
  }
  if (content.contact) {
    homeUpdate.contact = content.contact;
  }
  if (content.footer) {
    homeUpdate.footer = content.footer;
  }

  if (Object.keys(homeUpdate).length > 0) {
    const { error: homeError } = await supabase
      .from("home_content")
      .update(homeUpdate)
      .eq("id", "home");

    if (homeError) {
      console.error("Error updating home content:", homeError);
      throw homeError;
    }
  }

  // Update services if provided
  if (content.services?.items) {
    // Delete existing services
    await supabase.from("services").delete().eq("home_content_id", "home");

    // Insert new services
    const servicesToInsert = content.services.items.map((item, index) => ({
      id: item.id,
      home_content_id: "home",
      title: item.title,
      description: item.description,
      display_order: index + 1,
    }));

    const { error: servicesError } = await supabase
      .from("services")
      .insert(servicesToInsert);

    if (servicesError) {
      console.error("Error updating services:", servicesError);
      throw servicesError;
    }
  }

  // Update about paragraphs if provided
  if (content.about?.paragraphs) {
    // Delete existing paragraphs
    await supabase
      .from("about_paragraphs")
      .delete()
      .eq("home_content_id", "home");

    // Insert new paragraphs
    const paragraphsToInsert = content.about.paragraphs.map(
      (paragraph, index) => ({
        home_content_id: "home",
        content: paragraph,
        display_order: index + 1,
        is_bold: false, // You can enhance this to detect bold paragraphs
      })
    );

    const { error: paragraphsError } = await supabase
      .from("about_paragraphs")
      .insert(paragraphsToInsert);

    if (paragraphsError) {
      console.error("Error updating about paragraphs:", paragraphsError);
      throw paragraphsError;
    }
  }

  // Return updated content
  return getHomeContent();
}
