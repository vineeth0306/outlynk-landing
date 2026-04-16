import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

    const body = await req.json();
    const { role, name, mobile, email, city } = body;

    console.log("Received:", { role, name, email });

    if (!role || !name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      console.error("Missing env vars", { hasKey: !!AIRTABLE_API_KEY, hasBase: !!AIRTABLE_BASE_ID });
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Waitlist`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Name: name.trim(),
            email: email.toLowerCase().trim(),
            number: mobile?.trim() || "",
            city: city?.trim() || "",
            role: role.charAt(0).toUpperCase() + role.slice(1),
          },
        }),
      }
    );

    const data = await airtableRes.json();
    console.log("Airtable response:", airtableRes.status, JSON.stringify(data));

    if (!airtableRes.ok) {
      return NextResponse.json({ error: JSON.stringify(data) }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
