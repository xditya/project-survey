import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = sign({ username }, JWT_SECRET, { expiresIn: "1h" });
    return NextResponse.json({ token });
  } else {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
