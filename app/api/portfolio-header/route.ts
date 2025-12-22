import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  getPortfolioHeader,
  updatePortfolioHeader,
} from "@/lib/data/portfolio-header";

// GET - Fetch portfolio header content
export async function GET() {
  try {
    const header = await getPortfolioHeader();
    return NextResponse.json(header);
  } catch (error) {
    console.error("Error fetching portfolio header:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio header" },
      { status: 500 }
    );
  }
}

// PUT - Update portfolio header content (admin only)
export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const header = await request.json();
    const updatedHeader = await updatePortfolioHeader(header);
    return NextResponse.json(updatedHeader);
  } catch (error) {
    console.error("Error updating portfolio header:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio header" },
      { status: 500 }
    );
  }
}
