import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { WPSProvider } from "./context/WPSContext";
import { AppHeader } from "./components/AppHeader";
import { Home } from "./pages/Home";
import { WPSPage } from "./pages/WPS";
import { WPQRPage } from "./pages/WPQR";
import { FillerMetalsPage } from "./pages/FillerMetals";
import { ShieldingGasesPage } from "./pages/ShieldingGases";
import { PersonnelPage } from "./pages/Personnel";
import { UsersPage } from "./pages/Users";
import { ManufacturersPage } from "./pages/Manufacturers";
import { CustomersPage } from "./pages/Customers";
import { PowerSourcesPage } from "./pages/PowerSources";
import { WireFeedersPage } from "./pages/WireFeeders";
import { GasSensorsPage } from "./pages/GasSensors";
import { GeneralSettingsPage } from "./pages/GeneralSettings";
import { DevelopmentSettingsPage } from "./pages/DevelopmentSettings";
import { theme } from "./theme";

function AppContent() {
  return (
    <>
      <AppHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wps" element={<WPSPage />} />
        <Route path="/wpqr" element={<WPQRPage />} />
        <Route path="/filler-metals" element={<FillerMetalsPage />} />
        <Route path="/shielding-gases" element={<ShieldingGasesPage />} />
        <Route path="/personnel" element={<PersonnelPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/manufacturers" element={<ManufacturersPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/power-sources" element={<PowerSourcesPage />} />
        <Route path="/wire-feeders" element={<WireFeedersPage />} />
        <Route path="/gas-sensors" element={<GasSensorsPage />} />
        <Route path="/general" element={<GeneralSettingsPage />} />
        <Route path="/development" element={<DevelopmentSettingsPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <WPSProvider>
          <AppContent />
        </WPSProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
