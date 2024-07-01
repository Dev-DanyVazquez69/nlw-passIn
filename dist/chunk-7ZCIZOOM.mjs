import {
  badRequest
} from "./chunk-QDMTYS7I.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-event.ts
import { z } from "zod";
var getEvent = async (app) => {
  app.withTypeProvider().get(
    "/getEvent/:eventId",
    {
      schema: {
        summary: "Retornar um evento",
        tags: ["Events"],
        params: z.object({
          eventId: z.string().uuid()
        }),
        response: {
          200: z.object({
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().nullable(),
              attendeesAmount: z.number().int()
            })
          })
        }
      }
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const event = await prisma.event.findUnique({
        select: {
          id: true,
          title: true,
          slug: true,
          details: true,
          maximumAttendees: true,
          _count: {
            select: {
              Attendee: true
            }
          }
        },
        where: {
          id: eventId
        }
      });
      if (event === null) {
        throw new badRequest("Evento n\xE3o encontrado");
      }
      return reply.send({
        event: {
          id: event.id,
          title: event.title,
          slug: event.slug,
          details: event.details,
          maximumAttendees: event.maximumAttendees,
          attendeesAmount: event._count.Attendee
        }
      });
    }
  );
};

export {
  getEvent
};
