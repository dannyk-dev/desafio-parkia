import type { ParkingStatus, ParkingType } from "@estacionamento-sys/db";
import z from "zod";

export const parkingStatusEnum = z.enum(["LIVRE", "OCUPADA"] as ParkingStatus[]);
export const parkingTypeEnum = z.enum(["CARRO", "MOTO", "DEFICIENTE"] as ParkingType[]);
