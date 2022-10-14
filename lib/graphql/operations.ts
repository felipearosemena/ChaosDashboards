import { gql } from "@apollo/client";

export const typeDefs = gql`
  fragment DashboardFragment on Dashboard {
    id
    title
    pairs {
      coinId
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
    deleteDashboard(id: $id) {
      success
    }
  }

  mutation AddCryptoPair(
    $dashboardId: ID!
    $coinId: String!
    $vsCurrency: String!
  ) {
    addCryptoPair(
      dashboardId: $dashboardId
      coinId: $coinId
      vsCurrency: $vsCurrency
    ) {
      ...DashboardFragment
    }
  }
`;
