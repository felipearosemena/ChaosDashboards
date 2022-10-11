import { v4 as uuid } from "uuid";
import { BootstrapResponse, Dashboard, CoinPair } from "lib/models";

export const getBootstrapData = (): BootstrapResponse => {
  const data = localStorage.getItem("bootstrap");
  const emptyResponse: BootstrapResponse = {
    supportedCurrencies: [],
    coins: [],
  };

  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return emptyResponse;
    }
  } else {
    return emptyResponse;
  }
};

export const setBootstrapData = (data: BootstrapResponse) => {
  localStorage.setItem("bootstrap", JSON.stringify(data));
};

export const getDashboards = (): Dashboard[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const dashboards = localStorage.getItem("dashboards");

  if (dashboards) {
    try {
      return JSON.parse(dashboards);
    } catch {
      return [];
    }
  } else {
    return [];
  }
};

export const getDashboardById = (
  dashboardId: string
): Dashboard | undefined => {
  const dashboards = getDashboards();
  return dashboards.find((d) => d.id == dashboardId);
};

export const createDashboard = (title: string): Dashboard => {
  const dashboards = getDashboards();
  const newDashboard = {
    id: uuid(),
    title,
    pairs: [],
  };

  dashboards.push(newDashboard);

  localStorage.setItem("dashboards", JSON.stringify(dashboards));

  return newDashboard;
};

export const updateDashboard = (dashboardId: string, pairs: CoinPair[]) => {
  const dashboards = getDashboards()
  const updatedDashBoard = dashboards.find(d => d.id === dashboardId)
   
  if (updatedDashBoard) {
    updatedDashBoard.pairs = pairs
    localStorage.setItem("dashboards", JSON.stringify(dashboards));
  }
};

export const addPair = (
  dashboardId: string,
  coinId: string,
  vsCurrency: string
) => {
  const dashboard = getDashboardById(dashboardId)
  const pairExists = (pairs: CoinPair[] = []) =>
    pairs.find((pair) => pair.id == coinId && pair.vsCurrency == vsCurrency);

  if (dashboard && !pairExists(dashboard.pairs)) {
    dashboard.pairs.push({
      id: coinId,
      vsCurrency,
    });
  
    updateDashboard(dashboard.id, dashboard.pairs)
  }
};
