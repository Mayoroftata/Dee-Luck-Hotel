// lib/ApolloWrapper.js
"use client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql", // or your deployed URL
  cache: new InMemoryCache(),
  credentials: "include", // only if you use cookies for auth
});

export const ApolloWrapper = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
