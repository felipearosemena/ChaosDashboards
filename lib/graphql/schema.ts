import { gql } from "@apollo/client";

export const typeDefs = gql`
  type Query {
    dashboards: [Dashboard!]!
    dashboard(id: ID!): Dashboard
    widgets(dashboardId: ID!): [StartCardWidget!]!
    pairOptions: [CryptoPairOption!]!
  }

  type Mutation {
    createDashboard(title: String!): Dashboard!
    deleteDashboard(id: ID!): SuccessResponse
    addCryptoPair(dashboardId: ID!, coinId: String!, vsCurrency: String!): Dashboard!
  }

  type SuccessResponse { success: Boolean }

  type StartCardWidget {
    coin: Coin!
    vsCoin: Coin!
    price: Float!
  }

  type CoinInfo {
    supportedCurrencies: [SupportedCurrency!]!
    coins: [Coin!]!
  }

  type Coin {
    id: String!
    symbol: String!
    name: String!
    image: String!
  }

  type CryptoPair {
    coinId: String!
    vsCurrency: String!
  }

  type CryptoPairOption {
    coinId: String!
    vsCurrency: String!
    label: String!
  }

  type PricePair {
    coinId: String!
    vsCurrency: String!
    price: Float!
  }

  type SupportedCurrency {
    symbol: String!
  }

  type Dashboard @entity {
    id: String! @id
    title: String! @column
    pairs: [CryptoPair!]! @column
  }
`;
