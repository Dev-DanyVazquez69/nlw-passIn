import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { badRequest } from "./_errors/bad-request";

export const getAttendeeBadge = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        summary: 'Retornar registro de um participante',
        tags: ['Attendees'],
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              id: z.number().int(),
              name: z.string(),
              email: z.string(),
              event: z.string(),
              checkInURL: z.string().url()
            }),
          }),
        },
      },
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
              title: true,
            },
          },
        },
        where: {
          id: attendeeId,
        },
      });

      if (attendee === null) {
        throw new badRequest("O registro do usuário não foi encontrado");
      }

      const baseURL = `${request.protocol}://${request.hostname}`
      const checkInURL = new URL(`/attendees/${attendeeId}/check-in`,baseURL)

      return reply.send({
        badge: {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          event: attendee.event.title,
          checkInURL: checkInURL.toString(),
        },
      });
    }
  );
};
