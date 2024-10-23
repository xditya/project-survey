import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { verify } from "jsonwebtoken";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    verify(token, JWT_SECRET);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid token" + error },
      { status: 401 }
    );
  }

  try {
    await client.connect();
    const database = client.db("campus_survey");
    const surveys = database.collection("surveys");

    const totalResponses = await surveys.countDocuments();

    const serviceRatings = await surveys
      .aggregate([
        {
          $group: {
            _id: null,
            printRating: { $avg: { $toInt: "$printRating" } },
            slipRating: { $avg: { $toInt: "$slipRating" } },
            canteenRating: { $avg: { $toInt: "$canteenRating" } },
          },
        },
      ])
      .toArray();

    const formattedRatings = [
      { name: "Printing Services", rating: serviceRatings[0].printRating },
      { name: "College Slips", rating: serviceRatings[0].slipRating },
      { name: "College Canteen", rating: serviceRatings[0].canteenRating },
    ];

    // Fetch all student data
    const studentData = await surveys.find({}).toArray();

    return NextResponse.json({
      totalResponses,
      serviceRatings: formattedRatings,
      studentData,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
