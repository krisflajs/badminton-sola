import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  const prijave = await prisma.prijava.findMany();
  return prijave;
});
