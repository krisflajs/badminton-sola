import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.prijava.upsert({
    where: { id: 1 },
    update: {},
    create: {
      imePriimek: "Janez Novak",
      email: "janez@gmail.com",
      telefon: "041 234 567",
      datumRojstva: new Date("1990-01-01"),
      izkusenost: "TEKMOVALEC",
      proizvajalciLoparjev: ["Yonex", "Babolat"],
      objavaSlik: true,
      obdelavaPodatkov: true,
      dodatno: {
        "Prehrambene posebnosti": "gluten, krompir",
        "Trenutni lopar": "Yonex Astrox 99",
      },
    },
  });

  await prisma.prijava.upsert({
    where: { id: 2 },
    update: {},
    create: {
      imePriimek: "Metka Novak",
      email: "metka@gmail.com",
      telefon: "041 234 568",
      datumRojstva: new Date("1998-06-02"),
      izkusenost: "ZACETNIK",
      proizvajalciLoparjev: ["Wilson"],
      objavaSlik: true,
      obdelavaPodatkov: true,
      dodatno: {
        "Najljubši igralec": "Viktor Axelsen",
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
