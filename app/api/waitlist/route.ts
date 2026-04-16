import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = "Waitlist";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, name, mobile, email, city } = body;

    if (!role || !name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const validRoles = ["patient", "doctor", "lab"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      console.error("Airtable env vars not set");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
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

    if (!airtableRes.ok) {
      const err = await airtableRes.json();
      console.error("Airtable error:", JSON.stringify(err));
      return NextResponse.json({ error: err?.error?.message || JSON.stringify(err) }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "You're on the waitlist!" }, { status: 201 });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
