import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-event-attendees.ts
import { z } from "zod";
var getEventAttendees = async (app) => {
  app.withTypeProvider().get(
    "/getEvent/:eventId/attendees",
    {
      schema: {
        summary: "Retornar os usu\xE1rios de um evento",
        tags: ["Attendees"],
        params: z.object({
          eventId: z.string().uuid()
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkInAt: z.date().nullable()
              })
            )
          })
        },
        querystring: z.object({
          pageIndex: z.string().nullish().default("0").transform(Number),
          query: z.string().nullish()
        })
      }
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { pageIndex, query } = request.query;
      const attendees = await prisma.attendee.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          checkin: {
            select: {
              createdAt: true
            }
          }
        },
        where: query ? {
          eventId,
          name: {
            contains: query
          }
        } : {
          eventId
        },
        take: 10,
        skip: pageIndex * 10,
        orderBy: {
          createdAt: "desc"
        }
      });
      return reply.send({
        attendees: attendees.map((attendees2) => {
          return {
            id: attendees2.id,
            name: attendees2.name,
            email: attendees2.email,
            createdAt: attendees2.createdAt,
            checkInAt: attendees2.checkin?.createdAt ?? null
          };
        })
      });
    }
  );
};

export {
  getEventAttendees
};
