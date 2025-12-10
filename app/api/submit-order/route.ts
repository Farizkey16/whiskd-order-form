import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("Server Error: MAKE_WEBHOOK_URL is missing.");
      return NextResponse.json(
        { error: "Configuration Error" },
        { status: 500 }
      );
    }

    // 1. Parse the incoming form data (Files + JSON)
    const formData = await request.formData();

    // 2. Forward payload to Make.com
    const response = await fetch(webhookUrl, {
      method: "POST",
      body: formData, // Browser/Node automatically sets correct multipart headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Make.com responded with ${response.status}: ${errorText}`);
    }

    return NextResponse.json({ success: true, message: "Order received" });

  } catch (error: any) {
    console.error("Order Submission Failed:", error);
    
    return NextResponse.json(
      { error: "Failed to submit order. Please try again." },
      { status: 500 }
    );
  }
}