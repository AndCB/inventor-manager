import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { Alert, Snackbar } from "@mui/material";

export type SnackbarSeverity = "success" | "info" | "warning" | "error";

type SnackbarContextType = {
  openSnackbar: boolean;
  snackbarMessage: string;
  snackbarSeverity: SnackbarSeverity;
  openSnackbarWithMessage: (message: string, severity?: SnackbarSeverity) => void;
  closeSnackbar: () => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>("success");
  const [snackbarKey, setSnackbarKey] = useState(0);

  const openSnackbarWithMessage = useCallback(
    (message: string, severity: SnackbarSeverity = "success") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      // Incrementing the key restarts the auto-hide timer so consecutive
      // messages are always shown, even if the snackbar is already open.
      setSnackbarKey((key) => key + 1);
      setOpenSnackbar(true);
    },
    []
  );

  const closeSnackbar = useCallback(() => {
    setOpenSnackbar(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      openSnackbar,
      snackbarMessage,
      snackbarSeverity,
      openSnackbarWithMessage,
      closeSnackbar,
    }),
    [
      openSnackbar,
      snackbarMessage,
      snackbarSeverity,
      openSnackbarWithMessage,
      closeSnackbar,
    ]
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar
        key={snackbarKey}
        open={openSnackbar}
        autoHideDuration={snackbarSeverity === "error" ? 6000 : 3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  return context;
};
