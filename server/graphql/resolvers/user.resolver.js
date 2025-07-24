import jwt from 'jsonwebtoken';
import User from '../../model/user.model.js';

const SECRET = process.env.JWT_SECRET || 'secret';

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: '7d' });

const userResolvers = {
  Query: {
    getProfile: async (_, __, { user }) => {
      if (!user) throw new Error('Unauthorized');
      return await User.findById(user.id);
    }
  },
  Mutation: {
    register: async (_, { input }) => {
      const existing = await User.findOne({ email: input.email });
      if (existing) throw new Error('Email already in use');
      const user = new User(input);
      await user.save();
      return {
        token: generateToken(user),
        user,
      };
    },
    login: async (_, { input }) => {
      const user = await User.findOne({ email: input.email });
      if (!user || !(await user.comparePassword(input.password))) {
        throw new Error('Invalid credentials');
      }
      return {
        token: generateToken(user),
        user,
      };
    }
  }
};

export default userResolvers;
