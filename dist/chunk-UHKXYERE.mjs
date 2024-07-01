import {
  badRequest
} from "./chunk-QDMTYS7I.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/check-in.ts
import z from "zod";
var CheckIn = async (app) => {
  app.withTypeProvider().get(
    "/attendees/:attendeeId/check-in",
    {
      schema: {
        summary: "Realizar checkIn em um evento",
        tags: ["CheckIn"],
        response: {
          201: z.null()
        },
        params: z.object({
          attendeeId: z.coerce.number().int()
        })
      }
    },
    async (request, reply) => {
      const { attendeeId } = request.params;
      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId
        }
      });
      if (attendeeCheckIn !== null) {
        throw new badRequest("Este usu\xE1rio j\xE1 realizou o seu checkIn");
      }
      await prisma.checkIn.create({
        data: {
          attendeeId
        }
      });
      return reply.code(201).send();
    }
  );
};

export {
  CheckIn
};
