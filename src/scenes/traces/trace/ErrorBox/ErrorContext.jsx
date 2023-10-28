import { Box, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled, tableCellClasses, useTheme } from '@mui/material';
import React, { useCallback, useContext, useState } from 'react'
import { tokens } from '../../../../theme';
import { errorLogs } from '../../../../global/MockData/OpenErrors';
import "./ErrorContext.css"
import { format } from 'date-fns';
import { GlobalContext } from '../../../../global/globalContext/GlobalContext';
import { useEffect } from 'react';
import Loading from '../../../../global/Loading/Loading';

const ErrorContext = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { erroredLogData, traceLoading } = useContext(GlobalContext);
    const [transformedData, setTransformedData] = useState([]);

    const createTimeInWords = (createdTime) => {
        const formattedTime = format(createdTime, "MMMM dd, yyyy HH:mm:ss a");
        return formattedTime;
    };

    const marshellErroredLogs = useCallback(() => {
        // const marshelledData = [];
        // erroredLogData.forEach((log) => {
        //     let logRecord = {
        //         spanId: log.spanId,
        //         severityText: log.severityText,
        //         createdTime: log.createdTime,
        //         name: log.scopeLogs[0].scope.name,
        //         messageBody: log.scopeLogs[0].logRecords[0].body.stringValue,
        //         attributes: [], // Initialize attributes as an array
        //     };

        //     // Combine attributes into an array
        //     if (log.scopeLogs[0].logRecords[0].attributes) {
        //         log.scopeLogs[0].logRecords[0].attributes.forEach((attribute) => {
        //             // Push each attribute to the attributes array
        //             logRecord.attributes.push({
        //                 key: attribute.key,
        //                 value: attribute.value.stringValue,
        //             });
        //         });
        //     }

        //     marshelledData.push(logRecord);
        // });
        // setTransformedData(marshelledData);
        // console.log("TransData " + JSON.stringify(transformedData));

        const groupedData = {};

        erroredLogData.forEach((log) => {
            const spanId = log.spanId;

            // Check if the spanId already exists in the groupedData
            if (!groupedData[spanId]) {
                groupedData[spanId] = {
                    spanId,
                    logs: [],
                };
            }

            const logRecord = {
                severityText: log.severityText,
                createdTime: log.createdTime,
                name: log.scopeLogs[0].scope.name,
                messageBody: log.scopeLogs[0].logRecords[0].body.stringValue,
                attributes: [],
            };

            if (log.scopeLogs[0].logRecords[0].attributes) {
                log.scopeLogs[0].logRecords[0].attributes.forEach((attribute) => {
                    logRecord.attributes.push({
                        key: attribute.key,
                        value: attribute.value.stringValue,
                    });
                });
            }

            groupedData[spanId].logs.push(logRecord);
        });

        // Convert the grouped data object into an array of logs
        const marshelledData = Object.values(groupedData);

        setTransformedData(marshelledData);
        console.log("TransData " + JSON.stringify(marshelledData));
    }, [erroredLogData]);


    useEffect(() => {
        marshellErroredLogs();
    }, [marshellErroredLogs])


    return (
        <>
            {traceLoading ? (
                <Loading />
            ) : (<div style={{ maxHeight: "calc(80vh - 70px)", overflowY: "auto", paddingRight: "10px", marginTop: "10px" }} >
                {transformedData.map((log, index) => (
                    log.logs.map((record, subIndex) => (
                        <Box key={subIndex} >
                            <Typography
                                variant="h6"
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    backgroundColor: colors.redAccent[500],
                                    color: "#FFF",
                                    padding: "5px",
                                    borderRadius: "5px",
                                    marginTop: "10px"
                                }}
                            >
                                <span>SpanId:{log.spanId}</span>
                                <span>CreatedTime: {record.createdTime}</span>
                            </Typography>
                            <TableContainer component={Paper} >
                                <Table aria-label="customized table">
                                    <TableBody>
                                        <div style={{ overflowX: 'hidden' }}>
                                            <TableRow>
                                                <TableCell align='left' style={{ width: '20%' }}>
                                                    name
                                                </TableCell>
                                                <TableCell align='left' style={{ width: '80%' }}>
                                                    {record.name}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align='left' style={{ width: '20%' }}>
                                                    error.message
                                                </TableCell>
                                                <TableCell align='left' style={{ width: '80%' }}>
                                                    {record.messageBody}
                                                </TableCell>
                                            </TableRow>
                                            {record.attributes.length > 0 ? (
                                                record.attributes.map((attribute, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell align='left' style={{ width: '20%' }}>
                                                            <div>{attribute.key}</div>
                                                        </TableCell>
                                                        <TableCell align='left' style={{ width: '80%' }}>
                                                            <div className={attribute.key === "exception.stacktrace" ? "scrollable" : ""}>
                                                                {attribute.key === "exception.stacktrace" ? (
                                                                    <div className="stacktrace">{attribute.value}</div>
                                                                ) : (
                                                                    attribute.value
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : null}
                                        </div>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    ))
                ))}
            </div>)}
        </>
    )
}

export default ErrorContext