import { PrismaClient } from "../prisma/generated/client";
const prisma = new PrismaClient();

export default prisma;
export * from "../prisma/schema/interfaces";
