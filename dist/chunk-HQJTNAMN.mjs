import {
  generateSlug
} from "./chunk-CBR34VQD.mjs";
import {
  badRequest
} from "./chunk-QDMTYS7I.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/create-event.ts
import { z } from "zod";
var createEvent = async (app) => {
  app.withTypeProvider().post(
    "/events",
    {
      schema: {
        summary: "Criar um evento",
        tags: ["Events"],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable()
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid()
          })
        }
      }
    },
    async (request, reply) => {
      const createSchema = z.object({});
      const { details, maximumAttendees, title } = request.body;
      const slug = generateSlug(title);
      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug
        }
      });
      if (eventWithSameSlug != null) {
        throw new badRequest("Another event with same title already exist.");
      }
      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug
        }
      });
      return reply.status(201).send({
        eventId: event.id
      });
    }
  );
};

export {
  createEvent
};
