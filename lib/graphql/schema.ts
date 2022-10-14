import { gql } from "@apollo/client";

export const typeDefs = gql`
  type Query {
    dashboards: [Dashboard!]!
    dashboard(id: ID!): Dashboard
    coinInfo: CoinInfo!
    prices(ids: [String!]!, vsCurrencies: [String!]!): [CryptoPair!]!
  }

  type Mutation {
    createDashboard(title: String!): Dashboard!
    deleteDashboard(id: ID!): SuccessResponse
    addCryptoPair(dashboardId: ID!, coinId: String!, vsCurrency: String!): SuccessResponse
  }

  type SuccessResponse { success: Boolean }

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
    coinId: String!
    vsCurrency: String!
    price: Float
  }

  type Dashboard @entity {
    id: String! @id
    title: String! @column
    pairs: [CryptoPair!]! @column
  }
`;
