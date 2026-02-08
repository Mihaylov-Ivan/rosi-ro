import { getHomeContent } from "@/lib/data/home"
import ContactsClient from "../_components/ContactsClient"

export const revalidate = 3600 // 1 hour; adjust as needed

export default async function ContactsPage() {
  const content = await getHomeContent()
  return <ContactsClient content={content} />
}
