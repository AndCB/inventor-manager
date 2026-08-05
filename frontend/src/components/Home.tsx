import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import InventoryList from "./Inventory/InventoryList";
import { useAuth } from "../Contexts/AuthContext";

export default function Home() {
  const { auth, logout } = useAuth();

  return (
    <Container maxWidth="xl" disableGutters className="flex flex-col min-h-screen">
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Inventory Manager
          </Typography>
          {auth && (
            <Typography variant="body2" sx={{ mr: 2 }}>
              Signed in as {auth.username}
            </Typography>
          )}
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box className="flex-grow flex items-center justify-center">
        <InventoryList />
      </Box>
    </Container>
  );
}
