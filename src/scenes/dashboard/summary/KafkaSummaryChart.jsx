import React, { useCallback, useContext, useEffect, useState } from 'react'
import ApiCalls from './KafkaCharts/ApiCalls'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import PeakLatencyKafka from './KafkaCharts/PeakLatencyKafka'
import { getKafkaSummaryData } from '../../../api/TraceApiService'
import { GlobalContext } from '../../../global/globalContext/GlobalContext'
import Loading from '../../../global/Loading/Loading'

const KafkaSummaryChart = () => {
    const { lookBackVal, 
        setActiveTab,
        setSelected,
        selectedStartDate,
        selectedEndDate ,
        needHistoricalData,
        setNavActiveTab
    } = useContext(GlobalContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [emptyMessage, setEmptyMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [integrationdata, setintegrationdata] = useState([]);

    const kafkaSummaryCount = useCallback(async () => {
        try {
            setLoading(true);
            var response = await getKafkaSummaryData(selectedStartDate, selectedEndDate, lookBackVal.value, needHistoricalData)
            console.log("kafka summary data " + response);
            if (response.length !== 0) {
                setintegrationdata(response);
              } else {
                setEmptyMessage("No Data to show");
              }
              setLoading(false);
        } catch (error) {
            console.log("ERROR on Kafka summary " + error)
            setErrorMessage("An error Occurred!");
            setLoading(false);
        }
    }, [selectedStartDate, selectedEndDate, lookBackVal, needHistoricalData])

    useEffect(() => {
        setErrorMessage("");
        setEmptyMessage("");
        kafkaSummaryCount();
        setActiveTab(3);
        setNavActiveTab(0);
    }, [setErrorMessage, setEmptyMessage, kafkaSummaryCount, setActiveTab, setNavActiveTab])

    const hasKafkaCallCount = integrationdata.some(
        (item) => item.kafkaCallCount !== 0
    );
    const hasKafkaPeakLatency = integrationdata.some(
        (item) => item.kafkaPeakLatency !== 0
    )

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
                    height: "73vh",
                }}
            >
                <Typography variant="h6" align="center">
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
                <Typography variant="h6" align="center">
                    {errorMessage}
                </Typography>
            </div>
        ) : integrationdata.length !== 0 ? (
            <div style={{
                maxHeight: "73vh",
                // overflowY: "auto",
                minWidth: "100%"
              }}>
        
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card elevation={3} style={{ margin: "15px 25px 15px 25px", height: "calc(40vh - 40px)" , color: 'black'}}>
                            <CardContent>
                                {hasKafkaCallCount ? (
                                    <ApiCalls data={integrationdata} />
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
                                  Kafka Count Chart - No data
                                </Typography>
                              </div>
                                )}
                                
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
        
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card elevation={3} style={{ margin: "5px 25px 15px 25px", height: "calc(40vh - 40px)" , color: 'black'}}>
                            <CardContent>
                                {hasKafkaPeakLatency ? (
                                    <PeakLatencyKafka data={integrationdata} />
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
                                  Peak Latency Count Chart - No data
                                </Typography>
                              </div>
                                )}
                                
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        ) : null
    }
    </div>
  );
};

export default KafkaSummaryChart