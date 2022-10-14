import { gql } from "@apollo/client";

export const typeDefs = gql`
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
      id
      title
      pairs {
        coinId
      }
    }
  }

  query DashboardById($id: ID!) {
    dashboard(id: $id) {
      id
      title
      pairs {
        coinId
        vsCurrency
        price
      }
    }
  }

  mutation CreateDashboard($title: String!) {
    createDashboard(title: $title) {
      id
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
      success
    }
  }
`;
