import { NextRequest, NextResponse } from "next/server";
import { saveInterviewData } from "@/lib/actions/auth.action";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, type, level, amount, userId, techstack } = body;

    // Validate required fields
    if (!role || !type || !level || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: role, type, level, userId" },
        { status: 400 }
      );
    }

    // Save interview data to Supabase
    const result = await saveInterviewData({
      role,
      type,
      level,
      amount,
      userId,
      techstack,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: "Interview data saved successfully",
    });
  } catch (error) {
    console.error("Error in save-interview API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
