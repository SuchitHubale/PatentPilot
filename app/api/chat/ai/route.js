export const maxDuration = 60;
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Chat from "@/models/Chat";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    console.log('User ID:', userId);

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized"
      }, { status: 401 });
    }

    const { chatId, prompt } = await req.json();

    console.log('Received data:', { chatId, prompt });

    if (!chatId || !prompt) {
      console.log('Missing fields:', { chatId: !!chatId, prompt: !!prompt });
      return NextResponse.json({
        success: false,
        message: "Missing required fields"
      }, { status: 400 });
    }

    let data;
    try {
      data = await Chat.findOne({ userId, _id: chatId });

      if (!data) {
        return NextResponse.json({
          success: false,
          message: "Chat not found"
        }, { status: 404 });
      }
    } catch (error) {
      console.error('Chat.findOne error:', error);
      return NextResponse.json({
        success: false,
        message: "Database error: " + error.message
      }, { status: 500 });
    }

    const userPrompt = {
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    };

    data.messages.push(userPrompt);

    // Call backend for BERT search
    let similarPatents = [];
    let responseText = '';

    try {
      const bertRes = await fetch('http://127.0.0.1:8080/api/bert_search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: prompt })
      });

      if (bertRes.ok) {
        const bertData = await bertRes.json();
        similarPatents = bertData.similar_patents || [];
      } else {
        console.log('BERT search failed:', bertRes.status);
      }
    } catch (error) {
      console.log('BERT search error:', error.message);
    }

    // Call backend for Gemini suggestion
    try {
      const geminiRes = await fetch('http://127.0.0.1:8080/api/gemini_suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: prompt, similar_patents: similarPatents })
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        responseText = geminiData.suggestion || '';
      } else {
        console.log('Gemini suggestion failed:', geminiRes.status);
        // Still show patents even if Gemini fails
        if (similarPatents.length > 0) {
          responseText = `I found ${similarPatents.length} similar patents related to your idea. Please review them above for insights on prior art and potential areas of novelty.`;
        } else {
          responseText = 'I apologize, but the AI analysis service is currently unavailable. Please try again later.';
        }
      }
    } catch (error) {
      console.log('Gemini suggestion error:', error.message);
      // Still show patents even if Gemini fails
      if (similarPatents.length > 0) {
        responseText = `I found ${similarPatents.length} similar patents related to your idea. Please review them above for insights on prior art and potential areas of novelty.`;
      } else {
        responseText = 'I apologize, but the backend services are currently unavailable. Please try again later.';
      }
    }

    if (!responseText) {
      responseText = 'I apologize, but I was unable to generate a response at this time. Please try again later.';
    }

    const message = {
      role: 'model',
      content: responseText,
      patents: similarPatents, // Add patent data here
      timestamp: Date.now(),
    };

    data.messages.push(message);
    await data.save();

    return NextResponse.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}