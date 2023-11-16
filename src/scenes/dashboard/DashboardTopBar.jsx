import React, { useCallback, useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FilterDialog from "./FilterDialog";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import {
  Box,
  Drawer,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "./DashboardTopBar.css";
import { FilterListOutlined, RefreshOutlined } from "@mui/icons-material";
import { GlobalContext } from "../../global/globalContext/GlobalContext";
import { options } from "../../global/MockData/MockTraces";
import Logfilter from "../logs/Logfilter";
import Metricfilter from "../metrics/Metricfilter";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";


const DashboardTopBar = () => {
  const navigate = useNavigate();
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // const {
  //   lookBackVal,
  //   setLookBackVal,
  //   setNeedFilterCall,
  //   setTraceGlobalError,
  //   setTraceGlobalEmpty,
  //   setTraceData,
  //   setSelectedTrace,
  //   setRecentTrace,
  //   activeTab,
  //   setActiveTab,
  //   setGlobalLogData,
  //   setNeedLogFilterCall,
  //   setRecentLogData,
  // } = useContext(GlobalContext);
  const [refresh, setRefresh] = useState(false);
  const {
    lookBackVal,
    setLookBackVal,
    setNeedFilterCall,
    setTraceGlobalError,
    setTraceGlobalEmpty,
    setTraceData,
    setSelectedTrace,
    setRecentTrace,
    activeTab,
    setActiveTab,
    setGlobalLogData,
    setNeedLogFilterCall,
    setRecentLogData,
    setSearchQuery,
    setLogTrace,
    setTraceRender,
    setLogRender,
    setMetricRender,
    setTraceSummaryService,
    setLogSummaryService,
    setFilterApiBody,
    setClearTraceFilter,
    setLogFilterApiBody,
    setClearLogFilter,
    selectedStartDate,
    setSelectedStartDate,
    selectedEndDate,
    setSelectedEndDate,
    setNeedHistoricalData,
    selectedService,
    selectedLogService,
    traceDisplayService,
    setTraceDisplayService,
    setSelectedLogService,
    setShowError,
    navActiveTab,
    setNavActiveTab,
    setMinMaxError,
    openDrawer,
    setOpenDrawer,
  } = useContext(GlobalContext);

  const [logFilterDialogOpen, setLogFilterDialogOpen] = useState(false);
  const [metricFilterDialogOpen, setmetricFilterDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [previousStartDate, setPreviousStartDate] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const FilterbuttonStyle = {
    backgroundColor: theme.palette.mode === "light" ? "#339999" : "#A9A9A9",
  };

  const RefreshiconStyle = { fontSize: "20px", color: colors.tabColor[500] };

  const iconStyle = {
    fontSize: "20px",
    color:
      window.location.pathname === "/mainpage/traces" ||
      window.location.pathname === "/mainpage/metrics" ||
      window.location.pathname === "/mainpage/logs"
        ? colors.tabColor[500]
        : "#666663",
  };

  useEffect(() => {
    const currentDate = new Date();
    if (endDate !== null || previousStartDate) {
      console.log("HISTORY FROM USEEFFECT");
      setNeedHistoricalData(true);
      localStorage.setItem("needHistoricalData", true);
    } else {
      setNeedHistoricalData(false);
      localStorage.setItem("needHistoricalData", false);
    }
    setTraceGlobalEmpty(null);
    setTraceGlobalError(null);
  }, [endDate, setNeedHistoricalData, previousStartDate]);

  const EmptyformattedDate = format(new Date(), "yyyy-MM-dd");

  const handleRefreshClick = () => {
    const defaultValue = 120;
    const defaultLabel = options.find(
      (option) => option.value === defaultValue
    );
    setLookBackVal(defaultLabel);
    setRecentTrace([]);
    setTraceData([]);
    setSelectedTrace([]);
    setNeedFilterCall(false);
    setNeedLogFilterCall(false);
    setTraceGlobalEmpty(null);
    setTraceGlobalError(null);
    setGlobalLogData([]);
    setFilterApiBody({});
    setLogFilterApiBody({});
    setRecentLogData([]);
    setRefresh(true);
    setSearchQuery([]);
    setLogTrace([]);
    setTraceRender(false);
    setLogRender(false);
    setMetricRender(false);
    setClearTraceFilter(true);
    setClearLogFilter(true);
    setTraceSummaryService([]);
    setLogSummaryService([]);
    setSelectedStartDate(EmptyformattedDate);
    setSelectedEndDate(EmptyformattedDate);
    setStartDate(new Date());
    setEndDate(null);
    setNeedHistoricalData(false);
    localStorage.setItem("needHistoricalData", false);
    setPreviousStartDate(false);
    setTraceDisplayService([]);
    setSelectedLogService([]);
    setShowError(false);
    setMinMaxError("");
  };

  const handleTabChange = (event, newValue) => {
    if (newValue === 0) {
      navigate("/mainpage/dashboard");
    } else if (newValue === 1) {
      navigate("/mainpage/dashboard/logSummary");
    } else if (newValue === 2) {
      navigate("/mainpage/dashboard/dbSummary");
    } else if (newValue === 3) {
      navigate("/mainpage/dashboard/kafkaSummary");
    }
    setActiveTab(newValue);
  };

  const handleTabChangePages = (event, newValue) => {
    if (newValue === 0) {
      navigate("/mainpage/dashboard");
    } else if (newValue === 1) {
      navigate("/mainpage/traces");
    } else if (newValue === 2) {
      navigate("/mainpage/metrics");
    } else if (newValue === 3) {
      navigate("/mainpage/logs");
    }
    setNavActiveTab(newValue);
  };

  const handleFilterClick = () => {
    // setFilterDialogOpen(true);
    if (window.location.pathname === "/mainpage/logs") {
      setLogFilterDialogOpen(true);
    } else if (window.location.pathname === "/mainpage/traces") {
      setFilterDialogOpen(true);
    } else if (window.location.pathname === "/mainpage/metrics") {
      setmetricFilterDialogOpen(true);
    }
  };

  const handleFilterDialogClose = () => {
    // setFilterDialogOpen(false);
    if (window.location.pathname === "/mainpage/logs") {
      setLogFilterDialogOpen(false);
    } else if (window.location.pathname === "/mainpage/traces") {
      setFilterDialogOpen(false);
    } else if (window.location.pathname === "/mainpage/metrics") {
      setmetricFilterDialogOpen(false);
    }
  };

  const handleLookbackChange = (event) => {
    console.log("VAL " + JSON.stringify(event.target.value));
    setLookBackVal(event.target.value);
    setMetricRender(false);
    setGlobalLogData([]);
    setLogRender(false);
    setLogTrace([]);
    setTraceGlobalEmpty(null);
    setTraceGlobalError(null);
  };

  const endDateClear = () => {
    console.log("On Clear");
    setEndDate(null);
    setNeedHistoricalData(false);
    // const currentDate = new Date(); // Get the current date
    // const currentDateFormatted = format(currentDate, "yyyy-MM-dd");

    // if (selectedStartDate !== currentDateFormatted) {
    //   // If startDate is not today, set endDate to today's date
    //   setSelectedStartDate(currentDateFormatted);
    //   setStartDate(currentDate);
    // }

    localStorage.setItem("needHistoricalData", false);
    if (previousStartDate) {
      setSelectedEndDate(selectedStartDate);
    } else {
      setSelectedEndDate(EmptyformattedDate);
    }
  };

  const startDateClear = () => {
    setStartDate(null);
  };

  const handleStartDateChange = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    console.log("Formatted Date " + formattedDate);
    setMetricRender(false);
    setSelectedStartDate(formattedDate);
    setGlobalLogData([]);
    setLogRender(false);
    setLogTrace([]);
    setTraceGlobalEmpty(null);
    setTraceGlobalError(null);

    const currentDate = new Date();
    const currentDateFormatted = format(currentDate, "yyyy-MM-dd");

    if (formattedDate !== currentDateFormatted && endDate === null) {
      setSelectedEndDate(formattedDate);
      setPreviousStartDate(true);
      // setEndDate(null);
    } else if (endDate === null) {
      setSelectedEndDate(EmptyformattedDate);
      setPreviousStartDate(false);
      setEndDate(null);
    }

    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    if (date !== null) {
      const formattedDate = format(date, "yyyy-MM-dd");
      console.log("Formatted Date " + formattedDate);
      setMetricRender(false);
      setGlobalLogData([]);
      setLogTrace([]);
      setLogRender(false);
      setTraceGlobalEmpty(null);
      setTraceGlobalError(null);
      setSelectedEndDate(formattedDate);
      setEndDate(date);
    }
  };

  // { window.location.pathname === "/mainpage/traces" ||
  // window.location.pathname === "/mainpage/metrics" ||
  // window.location.pathname === "/mainpage/logs" ?toggleDrawer:null}

  const toggleDrawer = () => {

    setOpenDrawer(!openDrawer)
  
  };

  const appBarStyles = {
    height: "70px",
  };
  return (
    <>
      <AppBar
        position="static"
        elevation={3}
        style={{ backgroundColor: colors.primary[400] }}
      >
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",

            // minHeight: "120px"
          }}
        >
          <div>
            {window.location.pathname === "/mainpage/dashboard" ||
            window.location.pathname === "/mainpage/traces" ||
            window.location.pathname === "/mainpage/metrics" ||
            window.location.pathname === "/mainpage/logs" ||
            window.location.pathname === "/mainpage/dashboard/logSummary" ||
            window.location.pathname === "/mainpage/dashboard/dbSummary" ||
            window.location.pathname === "/mainpage/dashboard/kafkaSummary" ? (
              <Tabs
                value={navActiveTab}
                onChange={handleTabChangePages}
                TabIndicatorProps={{
                  sx: {
                    // height: 2,
                    borderRadius: 3,
                    // backgroundColor: colors.tabIndicator[500],
                  },
                }}
                textColor="inherit"
                indicatorColor="primary"
              >
                <Tab label="Dashboard" sx={{ color: "#FFF" }} />
                <Tab label="Traces" sx={{ color: "#FFF" }} />
                <Tab label="Metrics" sx={{ color: "#FFF" }} />
                <Tab label="Logs" sx={{ color: "#FFF" }} />
              </Tabs>
            ) : null}
          </div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                alignItems: "center",
                marginBottom: "10px",
                marginRight: "10px",
              }}
            >
              <label
                style={{
                  fontSize: "10px",
                  marginBottom: "5px",
                  color: colors.tabColor[500],
                }}
              >
                Start Date
              </label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <DatePicker
                    value={startDate}
                    onChange={handleStartDateChange}
                    slotProps={{
                      textField: { variant: "standard" },

                      // field: {
                      //   clearable: true,
                      //   onClear: () => setStartDate(null),
                      // },
                    }}
                    maxDate={endDate}
                    disableFuture
                    sx={{
                      width: 153,
                      marginRight: 2,
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#848482" : "#FFF",

                      "& .MuiInput-underline:before": {
                        borderBottom: "none", // Remove the default underline
                      },

                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "none",
                      },

                      padding: "7px",
                      "& .MuiInputBase-input": {
                        padding: 0,
                        "&:hover": {
                          border: "none", // Remove hover border effect
                        },
                      },
                      "& .MuiInputBase-root": {
                        "&:hover": {
                          border: "none", // Remove hover border effect
                        },
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: 18, // Adjust the font size of the clearable icon
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </div>
            <div
              style={{
                alignItems: "center",
                marginBottom: "10px",
                marginRight: "10px",
              }}
            >
              <label
                style={{
                  fontSize: "10px",
                  marginBottom: "5px",
                  color: colors.tabColor[500],
                }}
              >
                End Date
              </label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <DatePicker
                    value={endDate}
                    minDate={startDate}
                    maxDate={new Date()}
                    onChange={handleEndDateChange}
                    slotProps={{
                      textField: { variant: "standard" },
                      field: { clearable: true, onClear: () => endDateClear() },
                    }}
                    disableFuture
                    className="customDatePicker"
                    sx={{
                      boxShadow: 0,
                      marginRight: 2,
                      width: 150,
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#848482" : "#FFF",

                      "& .MuiInput-underline:before": {
                        borderBottom: "none",
                      },

                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "none",
                      },

                      padding: "7px",
                      "& .MuiInputBase-input": {
                        padding: 0,

                        "&:hover": {
                          border: "none", // Remove hover border effect
                        },
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: 18, // Adjust the font size of the clearable icon
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </div>

            {/* {endDate === null ? ( */}
            <div
              style={{
                alignItems: "center",
                marginBottom: "20px",
                marginTop: "11px",
              }}
            >
              <label
                style={{
                  fontSize: "10px",

                  color: colors.tabColor[500],
                }}
              >
                TimeBy
              </label>
              {/* <Dropdown
                      options={options}
                      placeholder="Lookback for"
                      value={lookBackVal.label}
                      onChange={(val) => handleLookbackChange(val)}
                      arrowClosed={<span className="arrow-closed" />}
                      arrowOpen={<span className="arrow-open" />}
                    /> */}

              <div>
                {" "}
                <Select
                  value={lookBackVal}
                  onChange={
                    endDate !== null || previousStartDate
                      ? null
                      : handleLookbackChange
                  }
                  sx={{
                    minWidth: 153,
                    maxHeight: 35,
                    // marginTop: "10px",
                    marginRight: "25px",
                    borderRadius: 0,
                    // color:"",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#848482" : "#FFF",
                    color:
                      theme.palette.mode === "dark"
                        ? endDate !== null || previousStartDate
                          ? "#B3B3AD"
                          : "#FFF"
                        : endDate !== null || previousStartDate
                        ? "lightgray"
                        : "#000",
                    padding: "7px 16px",
                    "& .MuiSelect-icon": {
                      color:
                        theme.palette.mode === "dark"
                          ? endDate !== null || previousStartDate
                            ? "#B3B3AD"
                            : "#FFF"
                          : endDate !== null || previousStartDate
                          ? "lightgray"
                          : "#000", // Customize the dropdown arrow color
                    },
                    "& .MuiSelect-root": {
                      color: "#000", // Customize the dropdown text color
                    },
                    "& .MuiInputBase-input": {
                      padding: 0, // Remove input padding
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Time
                  </MenuItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={index}
                      value={option}
                      sx={{
                        color:
                          theme.palette.mode === "dark"
                            ? endDate !== null || previousStartDate
                              ? "#666663"
                              : "#FFF"
                            : endDate !== null || previousStartDate
                            ? "lightgray"
                            : "#000",
                      }}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
            {/* ) : null} */}
            <div
              style={{
                alignItems: "center",
                marginBottom: "20px",
                marginRight: "10px",
                marginTop: "9px",
              }}
            >
              <label
                style={{
                  fontSize: "10px",
                  marginBottom: "5px",
                  // marginLeft:"1px",
                  color: colors.tabColor[500],
                }}
              >
                Refresh
              </label>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Tooltip title="Refresh">
                  <IconButton
                    sx={{ mr: 2 }}
                    onClick={handleRefreshClick}
                    aria-label="Refresh"
                    style={FilterbuttonStyle}
                  >
                    <RefreshOutlined style={RefreshiconStyle} />
                  </IconButton>
                </Tooltip>
              </Box>
            </div>

            {isSmallScreen ? (
              <div
                style={{
                  alignItems: "center",
                  marginBottom: "20px",
                  // marginRight: "10px",
                  marginTop: "9px",
                }}
              >
                <label
                  style={{
                    fontSize: "10px",
                    marginBottom: "5px",
                    marginLeft: "5px",
                    color: colors.tabColor[500],
                  }}
                >
                  Filter
                </label>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Tooltip title="Filter">
                    <IconButton
                      sx={{ mr: 2 }}
                      onClick={toggleDrawer}
                      // aria-label="Refresh"
                      style={FilterbuttonStyle}
                    >
                      <FilterAltRoundedIcon style={RefreshiconStyle} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </div>
            ) : null}
          </Box>
        </Toolbar>
        <div style={{ marginTop: "-25px", marginLeft: "13px" }}>
          {isSmallScreen ? null : window.location.pathname ===
              "/mainpage/dashboard" ||
            window.location.pathname === "/mainpage/dashboard/logSummary" ||
            window.location.pathname === "/mainpage/dashboard/dbSummary" ||
            window.location.pathname === "/mainpage/dashboard/kafkaSummary" ? (
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              TabIndicatorProps={{
                sx: {
                  // height: 2,
                  marginTop: "-60px",
                  borderRadius: 3,
                  backgroundColor: colors.tabIndicator[500],
                },
              }}
              textColor="inherit"
              indicatorColor="primary"
            >
              <Tab label="Trace Summary" sx={{ color: "#FFF" }} />
              <Tab label="Log Summary" sx={{ color: "#FFF" }} />
              <Tab label="Db Summary" sx={{ color: "#FFF" }} />
              <Tab label="Kafka Summary" sx={{ color: "#FFF" }} />
            </Tabs>
          ) : null}

          {window.location.pathname === "/mainpage/traces" ? (
            <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
              <FilterDialog />
            </Drawer>
          ) : null}

          {window.location.pathname === "/mainpage/metrics" ? (
            <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
              <Metricfilter />
            </Drawer>
          ) : null}

          {window.location.pathname === "/mainpage/logs" ? (
            <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
              <Logfilter />
            </Drawer>
          ) : null}
          <Box
            sx={{
              alignItems: "flex-start",
              marginLeft: "25px",
              padding: "5px",
              marginTop: "5px",
            }}
          >
            {window.location.pathname === "/mainpage/traces" ? (
              <Typography variant="h5" fontWeight={500} sx={{ color: "#FFF" }}>
                TRACES{" "}
                {traceDisplayService.length > 0
                  ? `(${traceDisplayService.join(", ")})`
                  : ""}
              </Typography>
            ) : window.location.pathname === "/mainpage/metrics" ? (
              <Typography variant="h5" fontWeight={500} sx={{ color: "#FFF" }}>
                METRICS {`(${selectedService})`}
              </Typography>
            ) : window.location.pathname === "/mainpage/logs" ? (
              <Typography variant="h5" fontWeight={500} sx={{ color: "#FFF" }}>
                LOGS{" "}
                {selectedLogService.length > 0
                  ? `(${selectedLogService.join(", ")})`
                  : ""}
              </Typography>
            ) : null}
          </Box>
        </div>
      </AppBar>
    </>
  );
};

export default DashboardTopBar;
