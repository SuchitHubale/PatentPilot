import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/config/firebase"; // your Firebase config
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      // Query chats collection where userId matches
      const q = query(collection(db, "chats"), where("userId", "==", userId));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        _id: doc.id,  // Changed from 'id' to '_id'
        ...doc.data(),
      }));

      return NextResponse.json({ success: true, data });
    } catch (error) {
      console.error("Chat fetch error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch chats: " + error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}