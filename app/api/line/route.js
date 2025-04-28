import { NextResponse } from 'next/server';

const CHANNEL_ACCESS_TOKEN = process.env.NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN;

export async function POST(req) {
  try {
    const { userId, message } = await req.json();

    if (!userId || !message) {
      return NextResponse.json(
        { error: 'Missing userId or message' },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        to: userId,
        messages: [
          {
            type: "text",
            altText: "Status Update",
            text: message
          }
        ]
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `LINE API Error: ${response.status}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('LINE Message Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}