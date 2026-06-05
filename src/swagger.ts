import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const isProduction = process.env.NODE_ENV === "production";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Asuhan Gizi",
      version: "1.0.0",
      description: "Dokumentasi API untuk Backend Asuhan Gizi",
    },
    servers: [
      {
        url: isProduction ? "http://10.10.0.88/api-asuhangizi/api" : "/api",
        description: isProduction ? "Production Server" : "Local Development",
      },
    ],
  },
  apis: [
    "./src/routes/*.ts",
    "./src/routes/*.js",
    "./src/controllers/*.ts",
    "./src/controllers/*.js",
    "./dist/routes/*.js",
    "./dist/controllers/*.js",
  ],
};

let swaggerSpec = {};
try {
  swaggerSpec = swaggerJSDoc(options);
} catch (error) {
  console.error("❌ Gagal memuat dokumentasi Swagger JSDoc:", error);
}

export const setupSwagger = (app: Application, port: number) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📄 Swagger UI tersedia di http://localhost:${port}/api-docs`);
};
