import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { badRequest } from "./_errors/bad-request";

export const CheckIn = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/check-in",
    {
      schema: {
        summary: 'Realizar checkIn em um evento',
        tags: ['CheckIn'],
        response: {
            201: z.null(),
        },
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params;
      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId: attendeeId,
        },
      });

      if (attendeeCheckIn !== null) {
        throw new badRequest("Este usuário já realizou o seu checkIn");
      }

      await prisma.checkIn.create({
        data: {
            attendeeId,
        }
      })

      return reply.code(201).send();
    }
  );
};
