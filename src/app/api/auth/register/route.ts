import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI)

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    await client.connect()
    const db = client.db()
    
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    return NextResponse.json(
      { message: "User created successfully", userId: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
} 