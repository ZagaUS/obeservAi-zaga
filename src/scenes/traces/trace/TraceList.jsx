import React from 'react'
import { Card, CardContent, Typography, CardActionArea, Box, useTheme, CardHeader, Pagination } from '@mui/material';
import "./TraceList.css";
import { tokens } from '../../../theme';
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const mockTraces = [
    {
        servicename: 'orderService',
        endPoint: '/order/getOrderById/{id}',
        traceID: '123456987667898767898768987984594b345679',
        createdTime: 'a few seconds ago',
        statusCode: '200',
        method: 'GET',
        duration: '100 ms',
    },
    {
        servicename: 'Service 2',
        endPoint: '/endpoint2',
        traceID: '789012',
        createdTime: '1 min ago',
        statusCode: '404',
        method: 'POST',
        duration: '200 ms',
    },
    {
        servicename: 'Service 3',
        endPoint: '/endpoint3',
        traceID: '345678',
        createdTime: '2 min ago',
        statusCode: '200',
        method: 'GET',
        duration: '250 ms',
    },
    {
        servicename: 'Service 4',
        endPoint: '/endpoint4',
        traceID: '123456',
        createdTime: '5 min ago',
        statusCode: '200',
        method: 'GET',
        duration: '200 ms',
    },
    {
        servicename: 'Service 5',
        endPoint: '/endpoint5',
        traceID: '123456',
        createdTime: '10 min ago',
        statusCode: '200',
        method: 'GET',
        duration: '150 ms',
    },
    {
        servicename: 'vendorService',
        endPoint: '/vendor/deleteVendorById/{id}',
        traceID: '123456',
        createdTime: '15 min ago',
        statusCode: '200',
        method: 'DELETE',
        duration: '200 ms',
    }
];

const sortOrder = ['Earliest First', '1 hr ago', '2 hrs ago', '12 hrs ago'];

const TraceList = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // const [time, setTime] = useState('');

    // const handleChange = (event) => {
    //     setTime(event.target.value);
    // };

    return (
        <div  >
            <div>
                <Box display="flex" flexDirection="row" justifyContent="space-between"  >
                    <Typography variant="h7" style={{ margin: "10px 0 20px 10px" }}>Traces ({mockTraces.length})</Typography>

                    {/* <FormControl sx={{ width: "40%" }}>
                        <InputLabel id="demo-simple-select-label" style={{ color: colors.primary[100] }}>Sort Order</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={time}
                            input={<OutlinedInput label="Sort Order" />}
                            onChange={handleChange}
                        >
                            {sortOrder.map((sortorder) => (
                                <MenuItem
                                    key={sortorder}
                                    value={sortorder}
                                >
                                    {sortorder}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}

                    <Box sx={{ margin: "10px 0 20px 0" }} >
                        <Pagination count={10} variant="outlined" size='small' shape="rounded" />
                    </Box>

                    <Box sx={{ margin: "5px 0 20px 0" }} >
                        <Dropdown options={sortOrder} placeholder="Sort Order" arrowClosed={<span className="arrow-closed" />}
                            arrowOpen={<span className="arrow-open" />} />
                    </Box>
                </Box>

                <Box sx={{ maxHeight: "calc(80vh - 50px)", overflowY: "auto" }} >
                    {mockTraces.map((trace, index) => (
                        <Card className="tracelist-card" key={index} sx={{ margin: "10px 0 20px 0", width: "530px", height: "fit-content", backgroundColor: colors.primary[500] }} >
                            <CardActionArea>
                                {/* <CardHeader title={<Typography variant="h6" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.greenAccent[500], paddingInlineStart: "10px" }}>
                                    <span>{trace.servicename}: {trace.endPoint}</span>
                                    <span>{trace.duration}</span>
                                </Typography>} /> */}
                                <Box>
                                <Typography  sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.greenAccent[500], padding: "5px", fontSize:"16px" }}>
                                    <span> <span style={{ fontWeight: "600" }}>{trace.servicename}:</span> {trace.endPoint}</span>
                                    <span>{trace.duration}</span>
                                </Typography>
                                </Box>
                                <CardContent>
                                    {/* orderProject: /get/getAllOrder
                            <br />
                            TraceID: 3948357549bas943578942nmn24985378345676543456432
                            <br />
                            20ms:  StatusCode: 200  Method: GET */}

                                    <Typography variant="h8" >
                                        <span style={{ fontWeight: "600" }}>TraceID:</span> {trace.traceID}
                                    </Typography>

                                    <Typography variant="h8" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "15px 0 0 0 " }}>
                                        <span style={{width:"150px"}} >{trace.createdTime}</span>
                                        <span style={{width:"200px"}} > <span style={{ fontWeight: "600", margin: "0 5px 0 0" }}>StatusCode:</span>{trace.statusCode}</span>
                                        <span style={{width:"100px"}} > <span style={{ fontWeight: "600", margin: "0 2px 0 0" }}>Method:</span>{trace.method}</span>
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                        
                    ))}
                </Box>
            </div>
        </div>
    )
}

export default TraceList