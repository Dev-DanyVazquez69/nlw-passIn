import {
  errorHandler
} from "./chunk-T72KMCSY.mjs";
import {
  CheckIn
} from "./chunk-UHKXYERE.mjs";
import {
  createEvent
} from "./chunk-HQJTNAMN.mjs";
import "./chunk-CBR34VQD.mjs";
import {
  getAttendeeBadge
} from "./chunk-4CPCOWCI.mjs";
import {
  getEventAttendees
} from "./chunk-6OBC4O77.mjs";
import {
  getEvent
} from "./chunk-7ZCIZOOM.mjs";
import {
  registerForEvent
} from "./chunk-YIY26Z4Z.mjs";
import "./chunk-QDMTYS7I.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
var app = fastify();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["aplication/json"],
    produces: ["aplication/json"],
    info: {
      title: "Pass In",
      description: "aplica\xE7\xE3o de registros em eventos",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(CheckIn);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("Servidor est\xE1 online");
});
