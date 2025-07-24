import roomTypeDefs from './schema/room.schema.js';
import roomResolvers from './resolvers/room.resolver.js';
import {bookingTypeDefs} from './schema/booking.schema.js';
import {bookingResolvers}  from './resolvers/booking.resolver.js';
import userTypeDefs from './schema/user.schema.js';
import userResolvers from './resolvers/user.resolver.js';


export const typeDefs = [roomTypeDefs, bookingTypeDefs, userTypeDefs];
export const resolvers = [roomResolvers, bookingResolvers, userResolvers];
