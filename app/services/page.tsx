import { getHomeContent } from "@/lib/data/home"
import ServicesClient from "../_components/ServicesClient"

export const revalidate = 3600 // 1 hour; adjust as needed

export default async function ServicesPage() {
  const content = await getHomeContent()
  return <ServicesClient content={content} />
}
