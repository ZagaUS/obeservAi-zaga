// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
// } from "@mui/material";
// import { tokens } from "../../../../theme";
// import { useTheme } from "@emotion/react";
// import { useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { GlobalContext } from "../../../../global/globalContext/GlobalContext";
// import { spanData } from "../../../../global/MockData/SpanData";

// const LogServiceTable = ({ tableData, selectedService }) => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const colors = tokens(theme.palette.mode);

//   const selectedServiceData = tableData.find(
//     (item) => item.serviceName === selectedService
//   );
//   // const { setSelected, setTraceData, setRecentTrace } = useContext(GlobalContext);
//   // Filter the data for the selected service
//   // const selectedApiCallsData = APICallsData.find(
//   //   (item) => item.serviceName === selectedService
//   // );

//   // const tableData = spanData.find(
//   //   (item) => item.serviceName === selectedService && item.traceId === "2384799a01be10b55245e99864bba516"
//   // );

//   // const selectedPeakLatencyData = PeakLatencyData.find(
//   //   (item) => item.serviceName === selectedService
//   // );
//   // const selectedErrorSuccessData = ErrSuccessData.find(
//   //   (item) => item.serviceName === selectedService
//   // );

//   // const handleOpenTrace = (trace) => {

//   //   // console.log("TRACE " + JSON.stringify([trace] ));
//   //   setRecentTrace([trace]);
//   //   // setTraceData([trace]);
//   //   localStorage.setItem("routeName", "Traces");
//   //   setSelected("Traces");
//   //   navigate("/mainpage/traces");
//   // }

//   return (
//     <div style={{ margin: "30px" }}>
//       {selectedService && (
//         // <Card elevation={3} style={{ margin: "16px" }}>
//         // <CardContent>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead style={{ backgroundColor: colors.primary[400] }}>
//               <TableRow>
//               <TableCell style={{ textAlign: "center" }}>Service Name</TableCell>
//                 <TableCell style={{ textAlign: "center" }}>Trace Id</TableCell>
//                 <TableCell style={{ textAlign: "center" }}>
//                   Operation Name
//                 </TableCell>
//                 <TableCell style={{ textAlign: "center" }}>
//                   Method Name
//                 </TableCell>
//                 <TableCell style={{ textAlign: "center" }}>Duration</TableCell>
//                 <TableCell style={{ textAlign: "center" }}>
//                   Status Code
//                 </TableCell>
//                 <TableCell style={{ textAlign: "center" }}>
//                   created Time
//                 </TableCell>
//                 <TableCell style={{ textAlign: "center" }}>Action</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               <TableRow key={selectedService}>
//                 <TableCell style={{ textAlign: "center" }}>
//                   {selectedService}
//                 </TableCell>
//                 <TableCell style={{ textAlign: "center" }}>
//                   {selectedServiceData.traceId}
//                 </TableCell>
//                 <TableCell style={{ textAlign: "center" }}>
//                   {selectedServiceData.methodName}
//                 </TableCell>
//                 <TableCell style={{ textAlign: "center" }}>
//                   {selectedServiceData.operationName}
//                 </TableCell>
//                 <TableCell style={{ textAlign: "center" }}>
//                   {selectedServiceData.duration}
//                 </TableCell>
//                 <TableCell style={{ textAlign: "center" }}>
//                   {selectedServiceData.statusCode}
//                 </TableCell>
//                 <TableCell style={{ textAlign: "center" }}>
//                   {selectedServiceData.createdTime}
//                 </TableCell>
//                 <TableCell style={{ textAlign: "center" }}>
//                   <Button variant="primary">OPEN TRACE</Button>
//                 </TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </div>
//   );
// };

// export default LogServiceTable;
import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../../../../global/globalContext/GlobalContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { tokens } from "../../../../theme";
import { useTheme } from "@emotion/react";
import { getErroredLogDataForLastTwo } from "../../../../api/LogApiService";
import Loading from "../../../../global/Loading/Loading";

const ServiceTable = ({ selectedService }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  
  const { setSelected, setTraceData, setRecentTrace, dashboardPageCount, dashboardPage, setDashboardPage } = useContext(GlobalContext);
  const navigate = useNavigate();

  
  const [selectedServiceData, setselectedServiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log("selectedServiceData", selectedServiceData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;
  const serviceName = selectedService;

  const handlePageChange = async (event, selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const handleOpenTrace = (trace) => {

    // console.log("TRACE " + JSON.stringify([trace] ));
    setRecentTrace([trace]);
    // setTraceData([trace]);
    localStorage.setItem("routeName", "Traces");
    setSelected("Traces");
    navigate("/mainpage/traces");
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const logDataResponse = await getErroredLogDataForLastTwo(
          currentPage,
          pageSize,
          serviceName
        );
        // console.log("logDataResponse", logDataResponse.data);
        setselectedServiceData(logDataResponse.data);
        setTotalPages(Math.ceil(logDataResponse.totalCount / pageSize));
      } catch (error) {
        console.error("Error fetching log data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedService, currentPage]);

  return (
    <div>
      {" "}
      {loading ? (
        <Loading />
      ) : (
        <div style={{ margin: "30px" }}>
          {selectedService && selectedServiceData.length > 0?(
            <>
              {" "}
              <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{
                          textAlign: "center",
                          backgroundColor: colors.primary[400],
                        }}
                      >
                        Service Name
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "center",
                          backgroundColor: colors.primary[400],
                        }}
                      >
                        Trace Id
                      </TableCell>

                      <TableCell
                        style={{
                          textAlign: "center",
                          backgroundColor: colors.primary[400],
                        }}
                      >
                        created Time
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "center",
                          backgroundColor: colors.primary[400],
                        }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedServiceData.length !== 0
                      ? selectedServiceData.map((tableInfo, index) => (
                          <TableRow key={index}>
                            <TableCell style={{ textAlign: "center" }}>
                              {tableInfo.serviceName}
                            </TableCell>
                            <TableCell style={{ textAlign: "center" }}>
                              {tableInfo.traceId}
                            </TableCell>

                            <TableCell style={{ textAlign: "center" }}>
                              {tableInfo.createdTime}
                            </TableCell>
                            <TableCell style={{ textAlign: "center" }}>
                              <Button variant="primary" onClick={() => handleOpenTrace(tableInfo)}>OPEN LOG</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      : null}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack
                spacing={2}
                direction="row"
                justifyContent="center"
                style={{ marginTop: "20px" }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                  size="small"
                />
              </Stack>
            </>
          ):serviceName?( <div style={{textAlign:"center",fontWeight:"bold"}}>There is no table data for this service</div>):null}
        </div>
      )}
    </div>
  );
};

export default ServiceTable;