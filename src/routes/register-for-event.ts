import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { promise, z } from "zod";
import { prisma } from "../lib/prisma";
import { badRequest } from "./_errors/bad-request";

export const registerForEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: 'Registrar participantes em um evento',
        tags: ['Events'],
        body: z.object({
            name: z.string().min(4),
            email: z.string().email(),
          }),
        params: z.object({
            eventId: z.string().uuid(),
          }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { name, email } = request.body;

    //buscando no banco de dados se há um email repetido no registro de um evento
      const  attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
            eventId_email: {
                email,
                eventId
            }
        }
      })
      //verificação de email duplicado em um evento
      if(attendeeFromEmail !== null){
        throw new badRequest('Esse email já está cadastrado neste evento')
      }

      //funcão que possibilita rodas as duas funções assincronas de maneira paralela
      const [event, amountOfAttendeesForEvent] = await Promise.all([
      
        //buscando registro de um evento
        prisma.event.findUnique({
            where: {
                id:eventId
            }
          }),
      
          //buscando a quantidade de registros de usuário para um evento
          prisma.attendee.count({
            where: {
                eventId
            }
          })

      ])

      
      if(event?.maximumAttendees && amountOfAttendeesForEvent >= event.maximumAttendees) {
        throw new badRequest('O evento já atingiu sua quantidade máxima de inscritos')
      }

      //realizado o registro do usuário no evento
      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId,
        },
      });
      //retornando a resposta utilizando o status code 201 juntamente com o ID do registro
      return reply.status(201).send({ attendeeId: attendee.id });
    }
  );
};
