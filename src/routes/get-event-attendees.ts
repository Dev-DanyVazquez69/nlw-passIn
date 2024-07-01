import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { number, z } from "zod";
import { prisma } from "../lib/prisma";

export const getEventAttendees = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/getEvent/:eventId/attendees",
    {
      schema: {
        summary: 'Retornar os usuários de um evento',
        tags: ['Attendees'],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
            200: z.object({
                attendees: z.array(
                    z.object({
                        id: z.number(),
                        name: z.string(),
                        email: z.string().email(),
                        createdAt: z.date(),
                        checkInAt: z.date().nullable(),
                    })
                )
            })
        },
        querystring: z.object({
            pageIndex: z.string().nullish().default('0').transform(Number),
            query: z.string().nullish()
        })
      },
    },
    async (request, reply) => {

      const { eventId } = request.params;
      const { pageIndex, query } = request.query

      const attendees = await prisma.attendee.findMany({
        select:{
            id: true,
            name: true,
            email: true,
            createdAt: true,
            checkin: {
                select: {
                    createdAt: true,
                }
            }

        },
        where: query? {
            eventId,
            name: {
                contains: query
            }
        }: {
            eventId
        },
        take:10,
        skip: pageIndex * 10,
        orderBy: {
            createdAt: "desc"
        }
      })

      return reply.send({
        attendees: attendees.map(attendees => {
            return {
                id: attendees.id,
                name: attendees.name,
                email: attendees.email,
                createdAt: attendees.createdAt,
                checkInAt: attendees.checkin?.createdAt ?? null
            }
        })
    })
    }
  );
};
