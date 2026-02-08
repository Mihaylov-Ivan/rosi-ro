import { getHomeContent } from "@/lib/data/home"
import { getPortfolioProjects } from "@/lib/data/portfolio"
import { getPortfolioCategories } from "@/lib/data/portfolio-categories"
import HomeClient from "./_components/HomeClient"

export const revalidate = 3600 // 1 hour; adjust as needed

export default async function Page() {
  const [content, projects, categories] = await Promise.all([
    getHomeContent(),
    getPortfolioProjects(),
    getPortfolioCategories(),
  ])

  return <HomeClient content={content} projects={projects} categories={categories} />
}
