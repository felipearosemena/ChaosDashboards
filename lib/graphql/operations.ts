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

  query Widgets($dashboardId: ID!) {
    widgets(dashboardId: $dashboardId) {
      coin {
        id
        symbol
        name
        image
      }
      vsCoin {
        id
        symbol
        name
        image
      }
      price
    }
  }

  query CryptoPairOptions {
    pairOptions {
      coinId
      vsCurrency
      label
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
