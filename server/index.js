import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import connectDB from './config/db.js';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import User from './model/user.model.js';
import userRoutes from './routes/user.routes.js';

// Import your typeDefs and resolvers
import { typeDefs, resolvers } from './graphql/index.js';

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  // Enhanced CORS configuration
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }));
  app.use(express.json());
  app.use('/api', userRoutes);


  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.id).select('-password'); // Exclude password
          return { user };
        } catch (error) {
          console.error('JWT verification error:', error.message);
          return {};
        }
      }
      return {};
    },
    // Enable introspection and playground in development
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production'
  });

  await server.start();
  
  // Apply middleware with enhanced configuration
  server.applyMiddleware({ 
    app, 
    path: '/graphql',
    cors: false // We're using express cors instead
  });

  const PORT = process.env.PORT || 4000;

  try {
    await connectDB();
    console.log('✅ MongoDB connected');

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Exit with failure
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

startServer();