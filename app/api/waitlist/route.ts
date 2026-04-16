import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type WaitlistEntry = {
  id: string;
  role: "patient" | "doctor" | "lab";
  name: string;
  mobile: string;
  email: string;
  city: string;
  submittedAt: string;
};

const DATA_FILE = path.join(process.cwd(), "data", "waitlist.json");

function readWaitlist(): WaitlistEntry[] {
  try {
    if (!fs.existsSync(path.dirname(DATA_FILE))) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeWaitlist(entries: WaitlistEntry[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, name, mobile, email, city } = body;

    if (!role || !name || !mobile || !email || !city) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const validRoles = ["patient", "doctor", "lab"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const entries = readWaitlist();

    const alreadyExists = entries.find(
      (e) => e.email === email.toLowerCase().trim() && e.role === role
    );
    if (alreadyExists) {
      return NextResponse.json(
        { error: "This email is already on the waitlist for this role." },
        { status: 409 }
      );
    }

    const newEntry: WaitlistEntry = {
      id: crypto.randomUUID(),
      role,
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.toLowerCase().trim(),
      city: city.trim(),
      submittedAt: new Date().toISOString(),
    };

    entries.push(newEntry);
    writeWaitlist(entries);

    return NextResponse.json({ success: true, message: "You're on the waitlist!" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function GET() {
  const entries = readWaitlist();
  return NextResponse.json({ count: entries.length, entries });
}
