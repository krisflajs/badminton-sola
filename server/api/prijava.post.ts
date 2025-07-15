import { PrismaClient } from "@prisma/client";
import emptyToNull from "~/server/utils/emptyToNull";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const parsedBody = emptyToNull(body);

  const prijava = await prisma.prijava
    .create({
      // @ts-expect-error: to bo odpravljeno z validacijo
      data: parsedBody,
    })
    .catch((error) => {
      console.error(error);
      // let reason = "Unknown error";
      // if (error instanceof Prisma.PrismaClientValidationError) {
      //   const lines = error.message.split("\n");
      //   reason = lines[lines.length - 1];
      // } else {
      //   reason = error.message;
      // }
      return createError({
        statusCode: 500,
        message: `Prijava ni bila uspešna`,
      });
    });

  return prijava;
});
