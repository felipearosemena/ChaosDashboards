import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Toolbar,
  Card as MuiCard,
  IconButton,
  Typography,
  Button,
  makeStyles,
  Theme,
  styled,
  Icon,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Drawer,
} from "@mui/material";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

const drawerWidth = 240;

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(0),
  maxWidth: 1180,
}));

export const Card = styled(MuiCard)({
  padding: 30,
  borderRadius: 16
})

export const Layout: React.FC<Props> = ({ children }) => {
  // const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const menuOptions = [
    {
      label: "Dashboards",
      path: "/",
    },
    { label: "New", path: "/new" },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuOptions.map((item, index) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              disableRipple
              disabled={item.path === router.pathname}
              onClick={() => router.push(item.path)}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Main>{children}</Main>
      </Box>
    </Box>
  );
};
