import z from "zod";
import { parkingStatusEnum, parkingTypeEnum } from "./enums.schema";

export const ParkingSpaceSchema = z.object({
  numero: z.string().min(1),
  status: parkingStatusEnum.optional(),
  tipo: parkingTypeEnum.optional(),
});

export type TParkingSpaceSchema = z.infer<typeof ParkingSpaceSchema>;

export const ParkingSpaceResponse = z.object({
  counts: z.record(parkingStatusEnum, z.number()),
  items: z.array(
    ParkingSpaceSchema.extend({
      id: z.number().int().positive(),
      criadoEm: z.coerce.date(),
    })
  ),
});

export type TParkingSpaceResponse = z.infer<typeof ParkingSpaceResponse>;

export * from "./parking-event.schema";
export * from "./enums.schema";
