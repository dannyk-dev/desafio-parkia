/*
  Warnings:

  - The `status` column on the `parking_spaces` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tipo` column on the `parking_spaces` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ParkingStatus" AS ENUM ('LIVRE', 'OCUPADA');

-- CreateEnum
CREATE TYPE "ParkingType" AS ENUM ('CARRO', 'MOTO', 'DEFICIENTE');

-- AlterTable
ALTER TABLE "parking_spaces" DROP COLUMN "status",
ADD COLUMN     "status" "ParkingStatus" NOT NULL DEFAULT 'LIVRE',
DROP COLUMN "tipo",
ADD COLUMN     "tipo" "ParkingType" NOT NULL DEFAULT 'CARRO';
