import express, { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createServer } from "http";
import cors from "cors";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { extractTokenFromHeader, verifyToken } from "./auth";
import { db } from "./database";
import { Context, User } from "./types";

const PORT = process.env.PORT || 4000;

async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  // Create Apollo Server
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: process.env.NODE_ENV !== "production",
    formatError: (err: any) => {
      console.error("GraphQL Error:", err);
      return {
        message: err.message,
        code: err.extensions?.code,
        path: err.path,
      };
    },
  });

  await server.start();

  // Apply CORS and JSON middleware
  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    }),
    express.json({ limit: "10mb" }),
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }): Promise<Context> => {
        // Extract token from Authorization header
        const token = extractTokenFromHeader(req.get("Authorization"));

        let user: User | undefined;

        if (token) {
          const payload = verifyToken(token);
          if (payload) {
            user = db.getUserById(payload.userId);
          }
        }

        return {
          user,
          dataSources: {},
        };
      },
    })
  );

  // Health check endpoint
  app.get("/health", (req: Request, res: Response) => {
    res.json({
      status: "OK",
      message: "Employee Management GraphQL API is running",
      timestamp: new Date().toISOString(),
    });
  });

  // Start the server
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));

  console.log(`🚀 Employee Management GraphQL API ready at http://localhost:${PORT}/graphql`);
  console.log(`📊 GraphQL Playground available at http://localhost:${PORT}/graphql`);
  console.log(`🔍 Health check available at http://localhost:${PORT}/health`);
}

// Start the server
startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
