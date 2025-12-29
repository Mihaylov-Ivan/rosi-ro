import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPassword,
  createAdminSession,
  setAdminSessionCookie,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Паролата е задължителна" },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminPassword(password);

    if (!isValid) {
      return NextResponse.json({ error: "Невалидна парола" }, { status: 401 });
    }

    const sessionToken = await createAdminSession();
    await setAdminSessionCookie(sessionToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Грешка при вход:", error);
    return NextResponse.json(
      { error: "Вътрешна сървърна грешка" },
      { status: 500 }
    );
  }
}
