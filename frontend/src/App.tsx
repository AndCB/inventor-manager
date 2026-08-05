import "./App.css";
import { SnackbarProvider } from "./Contexts/SnackBarContext";
import Home from "./components/Home";

function App() {
  return (
    <SnackbarProvider>
      <Home />
    </SnackbarProvider>
  );
}

export default App;
