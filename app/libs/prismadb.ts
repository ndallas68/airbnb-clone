import { PrismaClient } from "@prisma/client";

// global definition of prisma so it can work throughout code
declare global {
    var prisma: PrismaClient | undefined
}

// constant that either searches for either globalThis.prisma or creates a new prisma client
const client = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV != 'production') globalThis.prisma = client
    // checks if we're in development by looking at if we're in production
    // hot reloading can create a bunch of instances. Assign the prisma client to a globalThis client that isn't affected
    // could import everywhere but this is best practice

export default client;