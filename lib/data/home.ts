// Home page content data layer - ready for Supabase integration

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

// Mock data - in production, this will come from Supabase
let mockHomeContent: HomeContent = {
  id: "home",
  hero: {
    title: "Роси Ро ЕООД",
    subtitle: "Консултант по строителен надзор",
    description:
      "Професионални услуги за одит и издаване на разрешителни за строителни обекти. С дългогодишен опит и експертност в областта на строителството.",
    buttonText: "Вижте портфолио",
  },
  services: {
    title: "Услуги",
    items: [
      {
        id: "service-1",
        title: "Строителен надзор",
        description:
          "Професионален надзор на строителни проекти за осигуряване на качество и спазване на нормативите.",
      },
      {
        id: "service-2",
        title: "Одити и проверки",
        description:
          "Задълбочени одити на строителни обекти и техническа документация.",
      },
      {
        id: "service-3",
        title: "Разрешителни",
        description:
          "Съдействие при издаване на строителни разрешителни и необходима документация.",
      },
    ],
  },
  about: {
    title: "За нас",
    paragraphs: [
      "Роси Ро ЕООД е водеща консултантска фирма в областта на строителния надзор с дългогодишен опит в сферата на строителството. Специализирани сме в осъществяването на професионален строителен надзор, технически одити и съдействие при издаване на строителни разрешителни.",
      "Нашият опит включва разнообразни проекти - от жилищни сгради и търговски обекти до индустриални съоръжения и инфраструктурни проекти. Гарантираме качество, прецизност и спазване на всички нормативни изисквания.",
      "Работим с отдаденост за осигуряване на най-високи стандарти в строителната индустрия.",
    ],
  },
  contact: {
    title: "Контакти",
    address: "гр. Хасково, к-кс. XXI век, ет. 2, оф. 6",
    phone: "+359 898 262 834",
    email: "rosenaminkova@gmail.com",
  },
  footer: {
    copyright: "© 2025 Роси Ро ЕООД. Всички права запазени.",
    tagline: "Консултант по строителен надзор",
  },
};

// API functions - these will be replaced with Supabase calls
export async function getHomeContent(): Promise<HomeContent> {
  // TODO: Replace with Supabase query
  // const { data, error } = await supabase.from('home_content').select('*').eq('id', 'home').single()
  // if (error) throw error
  // return data

  return { ...mockHomeContent };
}

export async function updateHomeContent(
  content: Partial<HomeContent>
): Promise<HomeContent> {
  // TODO: Replace with Supabase update
  // const { data, error } = await supabase.from('home_content').update(content).eq('id', 'home').select().single()
  // if (error) throw error
  // return data

  mockHomeContent = { ...mockHomeContent, ...content };
  return { ...mockHomeContent };
}
