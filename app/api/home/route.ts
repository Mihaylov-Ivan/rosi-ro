import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getHomeContent, updateHomeContent } from "@/lib/data/home";

// GET - Fetch home page content
export async function GET() {
  try {
    const content = await getHomeContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching home content:", error);
    return NextResponse.json(
      { error: "Failed to fetch home content" },
      { status: 500 }
    );
  }
}

// PUT - Update home page content (admin only)
export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const content = await request.json();
    const updatedContent = await updateHomeContent(content);
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error("Error updating home content:", error);
    return NextResponse.json(
      { error: "Failed to update home content" },
      { status: 500 }
    );
  }
}
