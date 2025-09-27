import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { robloxUsername } = await request.json();

    if (!robloxUsername) {
      return NextResponse.json(
        { error: "robloxUsername is required" },
        { status: 400 },
      );
    }

    // Update the user's robloxUsername
    await prisma.user.update({
      where: { id: session.user.id },
      data: { robloxUsername },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
