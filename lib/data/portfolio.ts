// Portfolio data layer - ready for Supabase integration
// This is a mock implementation that can be easily replaced with Supabase

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

// Mock data - in production, this will come from Supabase
let mockProjects: PortfolioProject[] = [
  {
    id: 1,
    title: "Жилищен комплекс",
    category: "Жилищно строителство",
    image: "/modern-apartment-building.png",
    description:
      "Надзор на многофамилна жилищна сграда с 60 апартамента. Проектът включва пълен строителен надзор от започване до завършване, включително координация с всички специалисти и контрол на качеството.",
    details: {
      location: "гр. Хасково",
      year: "2023",
      scope: "Строителен надзор, технически одит",
    },
  },
  {
    id: 2,
    title: "Търговски център",
    category: "Търговско строителство",
    image: "/commercial-building-modern.jpg",
    description:
      "Пълен строителен надзор на търговски обект с площ 3000 кв.м. Включва координация на всички етапи от изкопни работи до финално завършване.",
    details: {
      location: "гр. Пловдив",
      year: "2022",
      scope: "Строителен надзор, управление на проекта",
    },
  },
  {
    id: 3,
    title: "Индустриален обект",
    category: "Индустриално строителство",
    image: "/industrial-building-warehouse.jpg",
    description:
      "Строителен надзор на производствен цех с офис площи. Специализиран надзор за индустриални съоръжения и технологични инсталации.",
    details: {
      location: "гр. Стара Загора",
      year: "2023",
      scope: "Строителен надзор, технически контрол",
    },
  },
  {
    id: 4,
    title: "Соларна инсталация",
    category: "Енергийни проекти",
    image: "/solar-panels-installation.jpg",
    description:
      "Технически надзор на фотоволтаична централа. Контрол на монтажа и съответствието със стандартите за електрически инсталации.",
    details: {
      location: "гр. Димитровград",
      year: "2024",
      scope: "Технически надзор, енергиен одит",
    },
  },
  {
    id: 5,
    title: "Жилищна сграда",
    category: "Жилищно строителство",
    image: "/residential-building-yellow.jpg",
    description:
      "Строителен надзор на жилищна сграда с 32 апартамента. Пълен контрол на изпълнението и качеството на строителните работи.",
    details: {
      location: "гр. Хасково",
      year: "2023",
      scope: "Строителен надзор, качествен контрол",
    },
  },
  {
    id: 6,
    title: "Реконструкция на сграда",
    category: "Реконструкция",
    image: "/building-renovation-construction.jpg",
    description:
      "Надзор при цялостна реконструкция на съществуваща сграда. Включва укрепване на конструкции и модернизация на инсталациите.",
    details: {
      location: "гр. Хасково",
      year: "2022",
      scope: "Строителен надзор, консултации",
    },
  },
];

// API functions - these will be replaced with Supabase calls
export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  // TODO: Replace with Supabase query
  // const { data, error } = await supabase.from('portfolio').select('*').order('id', { ascending: false })
  // if (error) throw error
  // return data

  return [...mockProjects];
}

export async function createPortfolioProject(
  project: Omit<PortfolioProject, "id">
): Promise<PortfolioProject> {
  // TODO: Replace with Supabase insert
  // const { data, error } = await supabase.from('portfolio').insert(project).select().single()
  // if (error) throw error
  // return data

  const newProject: PortfolioProject = {
    ...project,
    id: Math.max(...mockProjects.map((p) => p.id)) + 1,
  };
  mockProjects.push(newProject);
  return newProject;
}

export async function updatePortfolioProject(
  id: number,
  project: Partial<PortfolioProject>
): Promise<PortfolioProject> {
  // TODO: Replace with Supabase update
  // const { data, error } = await supabase.from('portfolio').update(project).eq('id', id).select().single()
  // if (error) throw error
  // return data

  const index = mockProjects.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Project not found");

  mockProjects[index] = { ...mockProjects[index], ...project };
  return mockProjects[index];
}

export async function deletePortfolioProject(id: number): Promise<void> {
  // TODO: Replace with Supabase delete
  // const { error } = await supabase.from('portfolio').delete().eq('id', id)
  // if (error) throw error

  mockProjects = mockProjects.filter((p) => p.id !== id);
}
