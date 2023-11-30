import SideNavbar from "./global/SideNavbar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Route, Routes } from "react-router";
import LoginPage from "./scenes/auth/Login";
import Topbar from "./global/Topbar";
import { GlobalContextProvider } from "./global/globalContext/GlobalContext";
import Traces from "./scenes/traces";
import Metrics from "./scenes/metrics";
import Logs from "./scenes/logs";
import TraceSummaryChart from "./scenes/dashboard/summary/TraceSummaryChart";
import LogSummaryChart from "./scenes/dashboard/summary/LogSummaryChart";
import DashboardTopBar from "./scenes/dashboard/DashboardTopBar";
import DbSummaryCharts from "./scenes/dashboard/summary/DbSummaryCharts";
import KafkaSummaryChart from "./scenes/dashboard/summary/KafkaSummaryChart";
import PodDashboardCharts from "./scenes/dashboard/sustainability/PodDashboardCharts";
import NodeDashboardCharts from "./scenes/dashboard/sustainability/NodeDashboardCharts";
import HostDashboardCharts from "./scenes/dashboard/sustainability/HostDashboardCharts";

function App() {
  const [theme, colorMode] = useMode();

  const DashboardSection = () => {
    return (
      <div>
        <Routes>
          <Route index element={<TraceSummaryChart />} />
          <Route path="logSummary" element={<LogSummaryChart />} />
          <Route path="dbSummary" element={<DbSummaryCharts />} />
          <Route path="kafkaSummary" element={<KafkaSummaryChart />} />
        </Routes>
      </div>
    )
  }

  const SustainabilitySection = () => {
    return (
      <Routes>
        <Route index element={<PodDashboardCharts />} />
        <Route path="node" element={<NodeDashboardCharts />} />
        <Route path="host" element={<HostDashboardCharts />} />
      </Routes>
    )
  }

  const MainPage = () => {
    return (
      <div className="app">
        <SideNavbar />
        <main className="content">
          <Topbar />
          <DashboardTopBar />
          <Routes>
            <Route path="dashboard/*" element={<DashboardSection />} />
            <Route path="sustainability/*" element={<SustainabilitySection />} />
            <Route path="traces" element={<Traces />} />
            <Route path="metrics" element={<Metrics />} />
            <Route path="logs" element={<Logs />} />
          </Routes>
        </main>
      </div>
    );
  };

  return (
    <GlobalContextProvider>
      <ThemeProvider theme={theme}>
        <ColorModeContext.Provider value={colorMode}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* Nested routes for /mainpage/* */}
            <Route path="/mainpage/*" element={<MainPage />} />
          </Routes>
          {/* {localStorage.getItem("userInfo") !== null ? (<div className="app">
            <SideNavbar />
            <main className="content">
              <Topbar />
              <DashboardTopBar />
              <Routes>
                <Route path="/dashboard/*">
                  <Route index element={<TraceSummaryChart />} />
                  <Route path="logSummary" element={<LogSummaryChart />} />
                  <Route path="dbSummary" element={<DbSummaryCharts />} />
                  <Route path="kafkaSummary" element={<KafkaSummaryChart />} />
                  <Route path="keplerDashboard" element={<KeplerPowerMetrics />} />
                </Route>
                <Route path="/traces" element={<Traces />} />
                <Route path="/metrics" element={<Metrics />} />
                <Route path="/logs" element={<Logs />} />
              </Routes>
            </main>
          </div>) : null} */}
        </ColorModeContext.Provider>
      </ThemeProvider>
    </GlobalContextProvider>
  );
}
export default App;