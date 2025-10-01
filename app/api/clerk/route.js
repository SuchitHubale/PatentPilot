import { Webhook } from "svix";
import { db } from "@/config/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  const wh = new Webhook(process.env.SIGNING_SECRET);

  try {
    // ✅ Get headers
    const svixHeaders = {
      "svix-id": req.headers.get("svix-id"),
      "svix-timestamp": req.headers.get("svix-timestamp"),
      "svix-signature": req.headers.get("svix-signature"),
    };

    // ✅ Parse body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // ✅ Verify webhook
    const evt = wh.verify(body, svixHeaders);
    const { data, type } = evt;

    // ✅ Build user data
    const userData = {
      id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url || "",
    };

    const userRef = doc(db, "users", data.id);

    switch (type) {
      case "user.created":
      case "user.updated":
        await setDoc(userRef, userData, { merge: true }); // create or update
        break;

      case "user.deleted":
        await deleteDoc(userRef);
        break;
    }

    return NextResponse.json({ message: "User synced with Firestore" });
  } catch (err) {
    console.error("❌ Webhook Error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 });
  }
}
