-- CreateEnum
CREATE TYPE "Izkusenost" AS ENUM ('ZACETNIK', 'REKREATIVEC', 'TEKMOVALEC');

-- CreateTable
CREATE TABLE "prijave" (
    "id" SERIAL NOT NULL,
    "imePriimek" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefon" TEXT,
    "datumRojstva" TIMESTAMP(3) NOT NULL,
    "izkusenost" "Izkusenost" NOT NULL,
    "proizvajalciLoparjev" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "objavaSlik" BOOLEAN NOT NULL,
    "obdelavaPodatkov" BOOLEAN NOT NULL,
    "dodatno" JSONB,

    CONSTRAINT "prijave_pkey" PRIMARY KEY ("id")
);
