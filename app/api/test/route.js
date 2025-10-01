import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "API is working"
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      data: body
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 400 });
  }
} 