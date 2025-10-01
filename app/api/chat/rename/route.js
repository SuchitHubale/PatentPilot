import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized"
      }, { status: 401 });
    }

    const { chatId, name } = await req.json();

    if (!chatId || !name) {
      return NextResponse.json({
        success: false,
        message: "Chat ID and name are required"
      }, { status: 400 });
    }

    // rename the chat in Firebase
    await Chat.renameChat(chatId, userId, name);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}