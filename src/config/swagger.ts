import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gyan Prisma API",
      version: "1.0.0",
      description:
        "Modular Express + Prisma ORM Backend API with Cloudinary integration.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
      {
        url: "https://prisma-orm-sable.vercel.app/",
        description: "Production server",
      },
    ],
  },
  apis: ["./src/docs/*.yaml", "./src/modules/**/*.yaml"],
};

export const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
