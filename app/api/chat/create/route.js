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

    // prepare chat data to be saved in Firebase
    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // create a new chat in Firebase
    try {
      const newChat = await Chat.create(chatData);
      return NextResponse.json({
        success: true,
        data: newChat
      });
    } catch (error) {
      console.error('Chat creation error:', error);
      return NextResponse.json({
        success: false,
        message: "Failed to create chat: " + error.message
      }, { status: 500 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}