import { FastifyInstance } from "fastify";
import { badRequest } from "../routes/_errors/bad-request";
import { ZodError } from "zod";

type FastifyErrorHandle = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandle = (error, request, reply) => {
    
    if(error instanceof ZodError){
        return reply.status(400).send({
            message: `Error during validation`, 
            error: error.flatten().fieldErrors,
        })
    }
  
  
  
    if (error instanceof badRequest) {
    return reply.status(400).send({
      message: error.message,
    });
  }
  return reply.status(500).send({ message: "um erro aconteceu!" });
};
