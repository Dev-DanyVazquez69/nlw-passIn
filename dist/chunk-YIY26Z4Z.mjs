import {
  badRequest
} from "./chunk-QDMTYS7I.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/register-for-event.ts
import { z } from "zod";
var registerForEvent = async (app) => {
  app.withTypeProvider().post(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "Registrar participantes em um evento",
        tags: ["Events"],
        body: z.object({
          name: z.string().min(4),
          email: z.string().email()
        }),
        params: z.object({
          eventId: z.string().uuid()
        }),
        response: {
          201: z.object({
            attendeeId: z.number()
          })
        }
      }
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { name, email } = request.body;
      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            email,
            eventId
          }
        }
      });
      if (attendeeFromEmail !== null) {
        throw new badRequest("Esse email j\xE1 est\xE1 cadastrado neste evento");
      }
      const [event, amountOfAttendeesForEvent] = await Promise.all([
        //buscando registro de um evento
        prisma.event.findUnique({
          where: {
            id: eventId
          }
        }),
        //buscando a quantidade de registros de usuário para um evento
        prisma.attendee.count({
          where: {
            eventId
          }
        })
      ]);
      if (event?.maximumAttendees && amountOfAttendeesForEvent >= event.maximumAttendees) {
        throw new badRequest("O evento j\xE1 atingiu sua quantidade m\xE1xima de inscritos");
      }
      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId
        }
      });
      return reply.status(201).send({ attendeeId: attendee.id });
    }
  );
};

export {
  registerForEvent
};
