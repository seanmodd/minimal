import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from 'src/__graphql/apolloClient_and_queries';

export const ApolloWrapper = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
