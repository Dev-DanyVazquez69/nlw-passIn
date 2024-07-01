import {
  badRequest
} from "./chunk-QDMTYS7I.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-attendee-bagde.ts
import z from "zod";
var getAttendeeBadge = async (app) => {
  app.withTypeProvider().get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        summary: "Retornar registro de um participante",
        tags: ["Attendees"],
        params: z.object({
          attendeeId: z.coerce.number().int()
        }),
        response: {
          200: z.object({
            badge: z.object({
              id: z.number().int(),
              name: z.string(),
              email: z.string(),
              event: z.string(),
              checkInURL: z.string().url()
            })
          })
        }
      }
    },
    async (request, reply) => {
      const { attendeeId } = request.params;
      const attendee = await prisma.attendee.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          event: {
            select: {
              title: true
            }
          }
        },
        where: {
          id: attendeeId
        }
      });
      if (attendee === null) {
        throw new badRequest("O registro do usu\xE1rio n\xE3o foi encontrado");
      }
      const baseURL = `${request.protocol}://${request.hostname}`;
      const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL);
      return reply.send({
        badge: {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          event: attendee.event.title,
          checkInURL: checkInURL.toString()
        }
      });
    }
  );
};

export {
  getAttendeeBadge
};
