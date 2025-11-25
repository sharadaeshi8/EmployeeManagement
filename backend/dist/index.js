"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
const auth_1 = require("./auth");
const database_1 = require("./database");
const PORT = process.env.PORT || 4000;
async function startServer() {
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    const server = new server_1.ApolloServer({
        typeDefs: schema_1.typeDefs,
        resolvers: resolvers_1.resolvers,
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
        introspection: process.env.NODE_ENV !== 'production',
        formatError: (err) => {
            console.error('GraphQL Error:', err);
            return {
                message: err.message,
                code: err.extensions?.code,
                path: err.path
            };
        }
    });
    await server.start();
    app.use('/graphql', (0, cors_1.default)({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true
    }), express_1.default.json({ limit: '10mb' }), (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => {
            const token = (0, auth_1.extractTokenFromHeader)(req.get('Authorization'));
            let user;
            if (token) {
                const payload = (0, auth_1.verifyToken)(token);
                if (payload) {
                    user = database_1.db.getUserById(payload.userId);
                }
            }
            return {
                user,
                dataSources: {}
            };
        }
    }));
    app.get('/health', (req, res) => {
        res.json({
            status: 'OK',
            message: 'Employee Management GraphQL API is running',
            timestamp: new Date().toISOString()
        });
    });
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Employee Management GraphQL API ready at http://localhost:${PORT}/graphql`);
    console.log(`📊 GraphQL Playground available at http://localhost:${PORT}/graphql`);
    console.log(`🔍 Health check available at http://localhost:${PORT}/health`);
}
startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map