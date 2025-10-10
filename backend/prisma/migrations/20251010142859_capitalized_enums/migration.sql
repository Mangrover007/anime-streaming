/*
  Warnings:

  - The values [airing,finished,upcoming,hiatus] on the enum `AnimeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AnimeStatus_new" AS ENUM ('AIRING', 'FINISHED', 'UPCOMING', 'HIATUS');
ALTER TABLE "Anime" ALTER COLUMN "status" TYPE "AnimeStatus_new" USING ("status"::text::"AnimeStatus_new");
ALTER TYPE "AnimeStatus" RENAME TO "AnimeStatus_old";
ALTER TYPE "AnimeStatus_new" RENAME TO "AnimeStatus";
DROP TYPE "public"."AnimeStatus_old";
COMMIT;
