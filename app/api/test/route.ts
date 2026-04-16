import { NextResponse } from "next/server";

export async function GET() {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return NextResponse.json({ error: "Env vars missing", AIRTABLE_API_KEY: !!AIRTABLE_API_KEY, AIRTABLE_BASE_ID: !!AIRTABLE_BASE_ID });
  }

  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Waitlist`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Name: "Test User",
          email: "test@test.com",
          number: "9876543210",
          city: "Mumbai",
          role: "Patient",
        },
      }),
    }
  );

  const data = await res.json();
  return NextResponse.json({ status: res.status, data });
}
