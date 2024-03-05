import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

//// Define custom post, get, patch, put, and lid function

// Post will provide a request (type request)
export async function POST(
    request: Request
) {
    // define POST body
    const body = await request.json();
    // extract all fields we need from our body
    const {
        email,
        name,
        password
    } = body;

    // hash password ("encrypt" password)
    const hashedPassword = await bcrypt.hash(password, 12);

    // create user from prisma
    const user = await prisma.user.create({
        data: {
            email,
            name,
            hashedPassword
        }
    });

    return NextResponse.json(user);
}