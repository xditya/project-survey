import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { cookies } from "next/headers";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await client.connect();
    const database = client.db("campus_survey");
    const surveys = database.collection("surveys");

    const surveyWithTimestamp = {
      ...body,
      submittedAt: new Date(),
    };

    const result = await surveys.insertOne(surveyWithTimestamp);

    if (result.acknowledged) {
      // Set a cookie to indicate that this device has submitted a survey
      cookies().set("hasSubmitted", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });

      return NextResponse.json(
        { message: "Survey submitted successfully", id: result.insertedId },
        { status: 200 }
      );
    } else {
      throw new Error("Failed to insert survey");
    }
  } catch (error) {
    console.error("Error submitting survey:", error);
    return NextResponse.json(
      { error: "Failed to submit survey" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
