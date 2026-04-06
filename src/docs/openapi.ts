/**
 * OpenAPI 3 document — extend this file as you add or change APIs.
 * UI: GET /api-docs
 */
export const openapiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Elif Backend API",
    version: "1.0.0",
    description:
      "REST API documentation. Protected routes use `Authorization: Bearer <accessToken>` from `POST /signin`.",
  },
  servers: [{ url: "/", description: "Current server" }],
  tags: [
    { name: "Users", description: "Registration, auth, profiles" },
    { name: "Properties", description: "Requires JWT (Bearer)" },
    {
      name: "Property furniture",
      description: "Furniture per property — requires JWT (Bearer)",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/": {
      get: {
        tags: ["Users"],
        summary: "List all users",
        responses: {
          "200": { description: "OK" },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Create user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "full_name", "role"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                  full_name: { type: "string" },
                  role: { type: "string", description: "User role enum" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Created" },
          "400": { description: "Bad request" },
        },
      },
    },
    "/signin": {
      post: {
        tags: ["Users"],
        summary: "Sign in",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Returns accessToken, refreshToken, user" },
          "400": { description: "Bad request" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": { description: "OK" },
          "400": { description: "Bad request" },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update user",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  full_name: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "OK" },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user (soft delete)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "OK" },
        },
      },
    },
    "/properties": {
      post: {
        tags: ["Properties"],
        summary: "Create property",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["propertyName", "propertyLocation", "price"],
                properties: {
                  propertyName: { type: "string" },
                  propertyLocation: { type: "string" },
                  price: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Created" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/properties/{userId}": {
      get: {
        tags: ["Properties"],
        summary: "List properties for user",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
        },
      },
      put: {
        tags: ["Properties"],
        summary: "Update property for user",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  propertyName: { type: "string" },
                  propertyLocation: { type: "string" },
                  price: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/properties/{propertyId}": {
      delete: {
        tags: ["Properties"],
        summary: "Delete property by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "propertyId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
          "404": { description: "Not found" },
        },
      },
    },
    "/property-furniture": {
      post: {
        tags: ["Property furniture"],
        summary: "Create property furniture",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "propertyId",
                  "furnitureName",
                  "category",
                  "room",
                  "purchaseDate",
                  "furnitureCondition",
                  "purchasePrice",
                  "attachments",
                  "notes",
                ],
                properties: {
                  propertyId: { type: "string" },
                  furnitureName: { type: "string" },
                  category: { type: "string" },
                  room: { type: "string" },
                  purchaseDate: { type: "string" },
                  furnitureCondition: {
                    type: "string",
                    enum: ["NEW", "GOOD", "FAIR", "POOR"],
                  },
                  purchasePrice: { type: "number" },
                  attachments: {
                    type: "array",
                    items: { type: "string" },
                  },
                  notes: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Created" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/property-furniture/{propertyId}": {
      get: {
        tags: ["Property furniture"],
        summary: "List furniture for property",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "propertyId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
        },
      },
      put: {
        tags: ["Property furniture"],
        summary: "Update property furniture",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "propertyId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
        },
      },
      delete: {
        tags: ["Property furniture"],
        summary: "Delete property furniture",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "propertyId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
        },
      },
    },
  },
} as const;
