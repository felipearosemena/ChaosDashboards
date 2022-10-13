import { gql } from "@apollo/client";

export const typeDefs = gql`
  fragment DashboardFragment on Dashboard {
    id
    title
    pairs {
      symbol
      vsCurrency
    }
  }

  query CoinInfo {
    coinInfo {
      coins {
        id
        symbol
        name
        image
        price
      }
      supportedCurrencies
    }
  }

  query Prices($ids: [String!]!, $vsCurrencies: [String!]!) {
    prices(ids: $ids, vsCurrencies: $vsCurrencies) {
      coinId
      vsCurrency
      price
    }
  }

  query Dashboards {
    dashboards {
      ...DashboardFragment
    }
  }

  query DashboardById($id: ID!) {
    dashboard(id: $id) {
      ...DashboardFragment
    }
  }

  mutation CreateDashboard($title: String!) {
    createDashboard(title: $title) {
      ...DashboardFragment
    }
  }

  mutation DeleteDashboard($id: ID!) {
    deleteDashboard(id: $id)
  }

  mutation AddCryptoPair(
    $dashboardId: ID!
    $symbol: String!
    $vsCurrency: String!
  ) {
    addCryptoPair(
      dashboardId: $dashboardId
      symbol: $symbol
      vsCurrency: $vsCurrency
    ) {
      ...DashboardFragment
    }
  }
`;
