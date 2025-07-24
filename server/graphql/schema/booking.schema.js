import { gql } from "apollo-server-express";

export const bookingTypeDefs = gql`
  type Booking {
    id: ID!
    guestFirstName: String!
    guestLastName: String!
    guestEmail: String!
    room: Room!
    checkIn: String!
    checkOut: String!
    status: String!
  }

  input BookingInput {
    guestFirstName: String!
    guestLastName: String!
    guestEmail: String!
    room: ID!
    checkIn: String!
    checkOut: String!
    status: String
  }

  input BookingUpdateInput {
    guestFirstName: String!
    guestLastName: String!
    guestEmail: String
    room: ID
    checkIn: String
    checkOut: String
    status: String
  }

  type Query {
    getAllBookings: [Booking]
    getBookingById(id: ID!): Booking
  }

  type Mutation {
    createBooking(input: BookingInput!): Booking
    updateBooking(id: ID!, input: BookingUpdateInput!): Booking
    deleteBooking(id: ID!): String
    cancelBooking(id: ID!): Booking
  }
`;
