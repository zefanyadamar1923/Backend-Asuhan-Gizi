import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Asuhan Gizi",
      version: "1.0.0",
      description: "Dokumentasi API untuk Backend Asuhan Gizi",
    },
    servers: [
      {
        url: "/api",
        description: "API Server",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application, port: number) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📄 Swagger UI tersedia di http://localhost:${port}/api-docs`);
};
