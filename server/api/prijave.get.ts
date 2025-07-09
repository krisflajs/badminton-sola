import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  const prijave = await prisma.prijava.findMany();
  return prijave;
});
