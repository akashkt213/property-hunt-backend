import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./routes/user.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import propertyFurnitureRoutes from "./routes/propertyfurniture.routes.js";
import { openapiDocument } from "./docs/openapi.js";

const app = express()

app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));
app.use("/", userRoutes);
app.use("/properties", propertyRoutes);
app.use("/property-furniture", propertyFurnitureRoutes);

export default app;