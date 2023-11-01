  import React, { useCallback, useState, useEffect, useContext } from "react";
  import DBCallsCount from "./DbCharts/DbCallsCount";
  import PeakLatencyChart from "./DbCharts/PeakLatencyChart";
  import Loading from "../../../global/Loading/Loading";
  import { Card, CardContent, Grid, Typography, useTheme } from "@mui/material";
  import { useNavigate } from "react-router-dom";
  import { GlobalContext } from "../../../global/globalContext/GlobalContext";
  import { tokens } from "../../../theme";
  import { getDbSummaryDataWithDate, getTraceSummaryDataWithDate } from "../../../api/TraceApiService";

  const DbSummaryCharts = () => {
    const {
      lookBackVal,
      setSelected,
      DbSummaryService,
      setDbSummaryService,
      selectedStartDate,
      selectedEndDate,
      needHistoricalData,
      setNavActiveTab,
      activeTab,
      setActiveTab,
    } = useContext(GlobalContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [emptyMessage, setEmptyMessage] = useState("");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [integrationdata, setintegrationdata] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // const integrationdata = [
    //   {
    //     serviceName: "order-project",
    //     dbCallCount: 20,
    //     dbName: "postgres",
    //     dbPeakLatencyCount: 2,
    //   },
    //   {
    //     serviceName: "vendor-project",
    //     dbCallCount: 35,
    //     dbName: "mongodb",
    //     dbPeakLatencyCount: 8,
    //   },
    //   {
    //     serviceName: "order-project",
    //     dbCallCount: 25,
    //     dbName: "postgres",
    //     dbPeakLatencyCount: 1,
    //   },
    //   {
    //     serviceName: "vendor-project",
    //     dbCallCount: 30,
    //     dbName: "mongodb",
    //     dbPeakLatencyCount: 5,
    //   },
    //   {
    //     serviceName: "order-project",
    //     dbCallCount: 20,
    //     dbName: "postgres",
    //     dbPeakLatencyCount: 4,
    //   },
    // ];


    
    const DBSummaryApiCall = useCallback(async () => {
      try {
        setLoading(true);
        var response = await getDbSummaryDataWithDate(selectedStartDate, selectedEndDate,lookBackVal.value);
        console.log("db",response);
        if (response.length !== 0) {
          setintegrationdata(response);
        } else {
          setEmptyMessage("No Data to show");
        }

        // console.log("Trace summary data " + JSON.stringify(response));
        setLoading(false);
      } catch (error) {
        // console.log("error " + error);
        setErrorMessage("An error Occurred!");
        setLoading(false);
      }
    }, [selectedStartDate, selectedEndDate,lookBackVal,needHistoricalData]);


    useEffect(() => {
      setErrorMessage("");
      setEmptyMessage("");
      DBSummaryApiCall();
      // setDbSummaryService([]);
      setActiveTab(2);
      setNavActiveTab(0);
    }, [DBSummaryApiCall, setErrorMessage, setEmptyMessage, setActiveTab, setNavActiveTab]);

    // useEffect(() => {
    //   // setNavActiveTab(2);
    //   setActiveTab(2);
    // }, []);

    const handleBarClick = (selectedDataPointIndex) => {
      const serviceName = integrationdata[selectedDataPointIndex].serviceName;
      console.log("ServiceName from DB summary" + serviceName);
      DbSummaryService.push(serviceName);
      localStorage.setItem("routeName", "Db");
      setSelected("Db");
      // navigate("/mainpage/logs");
      // setNavActiveTab(3);
    };

    const hasDbCountChartData = integrationdata.some(
      (item) => item.dbPeakLatencyCount !== 0
    );
    const hasPeakLatencyChartData = integrationdata.some(
      (item) => item.dbCallCount !== 0
    );

    return (
      <div>
        {loading ? (
          <Loading />
        ) : emptyMessage ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "80vh",
            }}
          >
            <Typography variant="h5" fontWeight={"600"}>
              {emptyMessage}
            </Typography>
          </div>
        ) : errorMessage ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "80vh",
            }}
          >
            <Typography variant="h5" fontWeight={"600"}>
              {errorMessage}
            </Typography>
          </div>
        ) : integrationdata.length !== 0 ? (
          <div
            style={{
              maxHeight: "73vh",
              overflowY: "auto",
              width: "100%",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card
                  elevation={3}
                  style={{
                    marginTop: "18px",
                    marginRight: "20px",
                    marginBottom: "10px",
                    marginLeft: "20px",
                    height: "calc(40vh - 40px)",
                    color: theme.palette.mode === "dark"?"white":"black"
                  }}
                >
                  <CardContent>
                    {hasDbCountChartData ? (
                      <DBCallsCount
                        data={integrationdata}
                        onBarClick={handleBarClick}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "calc(40vh - 24px)",
                          width: "100%",
                        }}
                      >
                        <Typography variant="h5" fontWeight={"600"}>
                          Database Count Chart - No data
                        </Typography>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card
                  elevation={3}
                  style={{
                    margin: "7px 20px 15px 20px",
                    height: "calc(40vh - 40px)",
                    color: theme.palette.mode === "dark"?"white":"black"
                  }}
                >
                  <CardContent>
                    {hasPeakLatencyChartData ? (
                      <PeakLatencyChart
                        data={integrationdata}
                        onBarClick={handleBarClick}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "calc(40vh - 24px)",
                          width: "100%",
                        }}
                      >
                        <Typography variant="h5" fontWeight={"600"}>
                          Peak Latency Chart - No data
                        </Typography>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        ) : null}
      </div>
    );
  };

  export default DbSummaryCharts;
