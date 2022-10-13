import { styled, Typography } from "@mui/material";
import { Coin } from "lib/graphql/generated";
import { Card } from "./Layout";

type StatCardWidgetProps = {
  coin: Coin;
  vsCoin: Coin;
  price?: number;
};

const CardGrid = styled("div")({ display: "grid", gap: 8 });

const CardHeader = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 8,
});

const Pair = styled("div")({
  height: 24,
  textTransform: "uppercase",
  fontWeight: 600,
  display: "flex",
  gap: 8,
  alignItems: "center",
});

const Source = styled("small")({
  opacity: 0.8,
});

const Price = styled("h2")({ height: 24, lineHeight: "24px", margin: 0 });

const PairSymbol = ({ coin }: { coin: Coin }) => {
  return (
    <>
      <img src={coin.image} alt={coin.name} width={20} height={20} />
      <span>{coin?.symbol}</span>
    </>
  );
};

export const StatCardWidget: React.FC<StatCardWidgetProps> = ({
  coin,
  vsCoin,
  price,
}) => {
  return (
    <Card>
      <CardGrid>
        <CardHeader>
          <Pair>
            <PairSymbol coin={vsCoin} /> /
            <PairSymbol coin={coin} />
          </Pair>
          <Source>Source: Coinbase</Source>
        </CardHeader>
        <Price>{price?.toFixed(2) ?? "-"}</Price>
      </CardGrid>
    </Card>
  );
};
