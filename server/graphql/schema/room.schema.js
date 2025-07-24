import { gql } from 'graphql-tag';

const roomTypeDefs = gql`
    type Room {
        id: ID!
        name: String!
        number: String!
        price: Float
        description: String
        category: String!
        images: [String]
        amenities: [String]
        isAvailable: Boolean
    }

    type Query {
        getAllRooms: [Room]
        getRoomById(id: ID!): Room
    }

    input RoomInput {
        name: String!
        price: Float
        number: String!
        description: String
        category: String!
        images: [String]
        amenities: [String]
        isAvailable: Boolean
    }

    type Mutation {
        createRoom(input: RoomInput!): Room
        deleteRoom(id: ID!): String
        updateRoom(id: ID!, input: RoomInput!): Room
    }
`;

export default roomTypeDefs;
