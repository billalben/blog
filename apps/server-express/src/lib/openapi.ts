import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import swaggerUi from "swagger-ui-express";
import { Router } from "express";
import { registry } from "./openapi-registry";

import "@/schemas/auth.schema";

registry.registerComponent("securitySchemes", "BearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

const generator = new OpenApiGeneratorV3(registry.definitions);

const document = generator.generateDocument({
  openapi: "3.0.3",
  info: {
    title: "Blog API",
    version: "1.0.0",
    description: "REST API for the blog platform",
  },
  servers: [
    { url: "http://localhost:3000", description: "Development server" },
  ],
});

const router = Router();

router.use("/docs", swaggerUi.serve, swaggerUi.setup(document));

router.get("/openapi.json", (_req, res) => {
  res.json(document);
});

export default router;
