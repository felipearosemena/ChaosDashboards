import { gql } from "@apollo/client";

export const typeDefs = gql`
  type Query {
    dashboards: [Dashboard!]!
    dashboard(id: ID!): Dashboard
    coinInfo: CoinInfo!
  }

  type Mutation {
    createDashboard(title: String!): Dashboard!
    deleteDashboard(id: ID!): Boolean
    addCryptoPair(dashboardId: ID!, symbol: String!, vsCurrency: String!): Dashboard!
  }

  type CoinInfo {
    supportedCurrencies: [String!]!
    coins: [Coin!]!
  }

  type Coin {
    id: String!
    symbol: String!
    name: String!
    image: String!
    price: Float!
  }

  type CryptoPair {
    symbol: String!
    vsCurrency: String!
  }

  type Dashboard @entity {
    id: String! @id
    title: String! @column
    pairs: [CryptoPair!]! @column
  }
`;
