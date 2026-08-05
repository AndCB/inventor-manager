import "./App.css";
import { SnackbarProvider } from "./Contexts/SnackBarContext";
import { AuthProvider, useAuth } from "./Contexts/AuthContext";
import Home from "./components/Home";
import AuthPage from "./components/Auth/AuthPage";

function AppContent() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Home /> : <AuthPage />;
}

function App() {
  return (
    <SnackbarProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
