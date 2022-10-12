import { Typography } from "@mui/material";
import { Coin } from "lib/types";
import { Card } from "./Layout";

type StatCardWidgetProps = {
  coin: Coin;
  vsCoin: Coin;
  price?: number;
};

export const StatCardWidget: React.FC<StatCardWidgetProps> = ({
  coin,
  vsCoin,
  price,
}) => {
  return (
    <Card style={{ display: "grid", gap: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            height: 24,
            textTransform: "uppercase",
            fontWeight: 600,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <img src={vsCoin.image} alt="" width={20} height={20} />{" "}
          <span>{vsCoin?.symbol}</span> <span>/</span>
          <img src={coin.image} alt="" width={20} height={20} />{" "}
          <span>{coin?.symbol}</span>
        </div>
        <small style={{ opacity: 0.8 }}>Source: Coinbase</small>
      </div>
      <h2 style={{ height: 24, lineHeight: '24px', margin: 0 }}>
        {price?.toFixed(2) ?? "-"}
      </h2>
    </Card>
  );
};
