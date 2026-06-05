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
    //  SOLUSI: Menggunakan Relative Path agar adaptif terhadap Nginx Proxy
    servers: [
      {
        // Jika di production diakses lewat sub-path Nginx, arahkan langsung ke root relative-nya
        url: isProduction ? "/api-asuhangizi/api" : "/api",
        description: isProduction ? "Production Server" : "Local Development",
      },
      //  TIPS TAMBAHAN: Anda juga bisa menyediakan opsi fallback langsung ke port internal container jika diperlukan
      {
        url: "/api",
        description: "Direct API Relative Path",
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
