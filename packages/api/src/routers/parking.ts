import z from "zod";
import { protectedProcedure, publicProcedure } from "../index";
import { parkingService } from "../services/parking.service";
import { MemoryPublisher } from "@orpc/experimental-publisher/memory";
import { ParkingSpaceSchema, type TParkingUpdate } from "../schemas/parking";
import { ORPCError } from "@orpc/server";

const pub = new MemoryPublisher<{ "parking:update": TParkingUpdate }>();

export const parkingRouter = {
  list: publicProcedure.handler(async () => {
    return await parkingService.list();
  }),
  create: protectedProcedure.input(ParkingSpaceSchema).handler(async ({ input, context }) => {
    if (context.session?.user.role !== "ADMIN") {
      throw new ORPCError("FORBIDDEN", {
        message: "You do not have permission to perform this action.",
      });
    }

    const newParking = await parkingService.create(input);

    pub.publish("parking:update", {
      type: "created",
      item: newParking,
    });

    return newParking;
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        numero: z.string().min(1).optional(),
        status: z.enum(["livre", "ocupada"]).optional(),
        tipo: z.enum(["carro", "moto", "deficiente"]).optional(),
      })
    )
    .handler(async ({ input, context }) => {
      if (context.session?.user.role !== "admin") {
        throw new Error("forbidden");
      }
      const { id, ...patch } = input;

      const updatedParking = await parkingService.update(id, patch);
      pub.publish("parking:update", {
        type: "updated",
        item: updatedParking,
      });

      return updatedParking;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .handler(async ({ input, context }) => {
      if (context.session?.user.role !== "admin") {
        throw new Error("forbidden");
      }

      const removedParking = await parkingService.remove(input.id);
      pub.publish("parking:update", {
        type: "removed",
        id: input.id,
      });

      return removedParking;
    }),
  live: publicProcedure.handler(async function* ({ input, signal, lastEventId }) {
    const iterator = pub.subscribe("parking:update", { signal, lastEventId });

    for await (const update of iterator) {
      yield update;
    }
  }),
};
