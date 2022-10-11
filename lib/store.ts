import { v4 as uuid } from "uuid";
import { Dashboard, CoinPair } from "lib/types";

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
  symbol: string,
  vsCurrency: string
) => {
  const dashboard = getDashboardById(dashboardId)
  const pairExists = (pairs: CoinPair[] = []) =>
    pairs.find((pair) => pair.symbol === symbol && pair.vsCurrency === vsCurrency);

  if (dashboard && !pairExists(dashboard.pairs)) {
    dashboard.pairs.push({symbol, vsCurrency});
  
    updateDashboard(dashboard.id, dashboard.pairs)
  }
};
