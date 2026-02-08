import type { MetadataRoute } from "next"
import { getHomeContent } from "@/lib/data/home"
import { getPortfolioProjects } from "@/lib/data/portfolio"

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://rosi-ro.vercel.app")

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [content, projects] = await Promise.all([
    getHomeContent(),
    getPortfolioProjects(),
  ])

  const lastModified = new Date()

  const serviceUrls: MetadataRoute.Sitemap = content.services.items.map((s) => ({
    url: `${baseUrl}/services/${s.id}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }))

  const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.id}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...serviceUrls,
    {
      url: `${baseUrl}/contacts`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projectUrls,
  ]
}
