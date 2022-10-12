import {
  Toolbar,
  Card as MuiCard,
  styled,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Drawer,
} from "@mui/material";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const drawerWidth = 240;

const Container = styled("div")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(0),
  maxWidth: 960,
  margin: "auto",
}));

export const Card = styled(MuiCard)({
  padding: 30,
  borderRadius: 16,
});

const NavBar = () => {
  const router = useRouter();
  const menuOptions = [
    {
      label: "Dashboards",
      path: "/",
    },
    { label: "New", path: "/new" },
  ];

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="permanent"
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        <Toolbar />
        <List>
          {menuOptions.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                disableRipple
                disabled={item.path === router.pathname}
                onClick={() => {
                  router.push(item.path);
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Container>{children}</Container>
      </Box>
    </Box>
  );
};
