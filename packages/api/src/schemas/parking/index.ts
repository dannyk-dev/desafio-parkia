import z from "zod";
import { parkingStatusEnum, parkingTypeEnum } from "./enums.schema";

export const ParkingSpaceSchema = z.object({
  numero: z.string().min(1),
  status: parkingStatusEnum.optional(),
  tipo: parkingTypeEnum.optional(),
});

export type TParkingSpaceSchema = z.infer<typeof ParkingSpaceSchema>;

export * from "./parking-event.schema";
export * from "./enums.schema";
