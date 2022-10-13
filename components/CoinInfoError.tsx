import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { Card } from "./Layout";

export const CoinInfoError = ({ message = "" }) => {
  const router = useRouter();

  return (
    <Card>
      <h1>Error loading tokens</h1>
      <p>{message}</p>
      <Button onClick={() => router.reload()}>Reload</Button>
    </Card>
  );
};
