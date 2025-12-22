// Portfolio header content data layer - ready for Supabase integration

export interface PortfolioHeader {
  id: string;
  title: string;
  description: string;
}

// Mock data - in production, this will come from Supabase
let mockPortfolioHeader: PortfolioHeader = {
  id: "portfolio-header",
  title: "Нашето портфолио",
  description:
    "Разгледайте реализираните от нас проекти в различни области на строителството - жилищни, търговски и индустриални обекти.",
};

// API functions - these will be replaced with Supabase calls
export async function getPortfolioHeader(): Promise<PortfolioHeader> {
  // TODO: Replace with Supabase query
  // const { data, error } = await supabase.from('portfolio_header').select('*').eq('id', 'portfolio-header').single()
  // if (error) throw error
  // return data

  return { ...mockPortfolioHeader };
}

export async function updatePortfolioHeader(
  header: Partial<PortfolioHeader>
): Promise<PortfolioHeader> {
  // TODO: Replace with Supabase update
  // const { data, error } = await supabase.from('portfolio_header').update(header).eq('id', 'portfolio-header').select().single()
  // if (error) throw error
  // return data

  mockPortfolioHeader = { ...mockPortfolioHeader, ...header };
  return { ...mockPortfolioHeader };
}
