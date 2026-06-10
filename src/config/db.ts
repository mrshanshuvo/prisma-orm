import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const initDB = async () => {
  console.log("Connecting to the database...");
  await prisma.$connect();
  console.log("Database connected successfully.");
};

export default prisma;
