import axios from "axios";

const traceURL = process.env.REACT_APP_APIURL_TRACES;
const graphql_url = process.env.REACT_APP_GRAPHQLURL_TRACES;

export const TraceListPaginationApi = async (
  page,
  itemsPerPage,
  interval,
  sortOrder,
  serviceListData
) => {
  try {
    // Get the list of service names from localStorage and parse it
    // const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));

    // Construct the URL with the service names
    const serviceNameListParam = serviceListData.join("&serviceNameList=");
    // console.log(`${traceURL}/getalldata-sortorder?minutesAgo=${interval}&page=${page}&pageSize=${itemsPerPage}&serviceNameList=${serviceNameListParam}&sortOrder=${sortOrder}`);
    const response = await axios.get(
      `${traceURL}/getalldata-sortorder?minutesAgo=${interval}&page=${page}&pageSize=${itemsPerPage}&serviceNameList=${serviceNameListParam}&sortOrder=${sortOrder}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const TraceListPaginationApiWithDate = async (
  page,
  pageSize,
  startDate,
  endDate,
  minutesAgo,
  sortOrder,
  serviceName
) => {
  try {
    let gqlQuery;

    // Condition to check for historical data
    if (JSON.parse(localStorage.getItem('needHistoricalData'))) {
      gqlQuery = `
      query SortOrderTrace {
        sortOrderTrace(
          sortOrder:  ${JSON.stringify(sortOrder)}
          serviceNameList:${JSON.stringify(serviceName)}
          page: ${page}
          pageSize: ${pageSize}
          from: ${JSON.stringify(startDate)}
          to:  ${JSON.stringify(endDate)}
          minutesAgo: null
        ) {
          traces {
              createdTime
              duration
              methodName
              operationName
              serviceName
              statusCode
              traceId
           }
          totalCount
      }
    }
   `;
  }
  
  else {
    gqlQuery = `
    query SortOrderTrace {
      sortOrderTrace(
          sortOrder:  ${JSON.stringify(sortOrder)}
          serviceNameList:${JSON.stringify(serviceName)}
          page: ${page}
          pageSize: ${pageSize}
          from: ${JSON.stringify(startDate)}
          to: null
          minutesAgo:  ${minutesAgo}
      ){
        traces {
            createdTime
            duration
            methodName
            operationName
            serviceName
            statusCode
            traceId
         }
        totalCount
    }
  }
  `;
}


    // let myarray = ["order-srv-1"]
    // let dataToSend = myarray.toString()
    console.log("graphql"+gqlQuery);

    const response = await axios.post(
      graphql_url,
      {
        query: gqlQuery
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response.data);
    if (response.data) {
      console.log('GraphQL output:', response.data);
      return response.data;
    } else {
      console.error('GraphQL response is null:', response.data);
      throw new Error('Null response received');
    }

  } catch (error) {
    console.error('Error retrieving logs:', error);
    throw error;
  }
};

export const TraceFilterOption = async (lookback, page, pageSize, payload) => {
  try {
    const response = await axios.post(
      `${traceURL}/TraceQueryFilter?minutesAgo=${lookback}&page=${page}&pageSize=${pageSize}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json", // Set the Content-Type header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const TraceFilterOptionWithDate = async (
  startDate,
  minutesAgo,
  sortorder,
  endDate,
  page,
  pageSize,
  payload
) => {
  try {
    let gqlQuery;

    // Condition to check for historical data
    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      gqlQuery = `
      query TraceFilter {
        traceFilter(
            page: ${page}
            pagesize: ${pageSize}
            query: {
              ${payload.duration ? `duration: {min: ${payload.duration.min}, max: ${payload.duration.max}},` : ''}
              ${payload.methodName ? `methodName: ${JSON.stringify(payload.methodName)},` : ''}
              ${payload.serviceName ? `serviceName: ${JSON.stringify(payload.serviceName)},` : ''}
              ${payload.statusCode ? `statusCode: [${payload.statusCode.map(range => `{min: ${range.min}, max: ${range.max}}`).join(',')}]` : ''}
            }
            from: ${JSON.stringify(startDate)}
            to:  ${JSON.stringify(endDate)}
            minutesAgo: null
            sortorder: ${JSON.stringify(sortorder)}
        ) {
          traces {
              createdTime
              duration
              methodName
              operationName
              serviceName
              statusCode
              traceId
           }
          totalCount
      }
    }
    
      `;
    } else {
      gqlQuery = `
        query TraceFilter {
          traceFilter(
            query: {
              ${payload.duration ? `duration: {min: ${payload.duration.min}, max: ${payload.duration.max}},` : ''}
              ${payload.methodName ? `methodName: ${JSON.stringify(payload.methodName)},` : ''}
              ${payload.serviceName ? `serviceName: ${JSON.stringify(payload.serviceName)},` : ''}
              ${payload.statusCode ? `statusCode: [${payload.statusCode.map(range => `{min: ${range.min}, max: ${range.max}}`).join(',')}]` : ''}
            }
            page: ${page}
            pagesize: ${pageSize}
            from: ${JSON.stringify(startDate)}
            to: null
            minutesAgo: ${minutesAgo}
            sortorder: ${JSON.stringify(sortorder)}
          ) {
            traces {
                createdTime
                duration
                methodName
                operationName
                serviceName
                statusCode
                traceId
             }
            totalCount
        }
        }
      `;
    }

    const response = await axios.post(
      graphql_url,
      {
        query: gqlQuery,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("Trace filter GraphQL Query:", gqlQuery);
    console.log("GraphQL Response:", response.data);

    console.log(response, "================>");

    if (response.data) {
      console.log('GraphQL output:', response.data);
      return response.data;
    } else {
      console.error('GraphQL response is null:', response.data);
      throw new Error('Null response received');
    }
  } catch (error) {
    console.error('Error retrieving traces:', error);
    throw error;
  }
};

export const FindByTraceIdForSpans = async (traceId) => {
  console.log("Enetering traceID"+traceId);
  try {
    // let gqlQuery;

    // if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
    //   gqlQuery = `
    const needHistoricalData = JSON.parse(localStorage.getItem("needHistoricalData"));
    console.log('needHistoricalData:', needHistoricalData);
    let gqlQuery;
    if (true) {     
      gqlQuery = `
        query FindByTraceId {
          findByTraceId(traceId: "${traceId}") {
            createdTime
            duration
            methodName
            operationName
            serviceName
            spanCount
            statusCode
            traceId
            id
            spanDTOs {
              logSpanId
              logTraceId
              errorStatus
              logAttributes {
                key
                value {
                  intValue
                  stringValue
                }
              }
              errorMessage {
                stringValue
              }
              spans {
                endTimeUnixNano
                kind
                name
                parentSpanId
                spanId
                startTimeUnixNano
                traceId
                attributes {
                  key
                  value {
                    intValue
                    stringValue
                  }
                }
                status {
                  code
                }
              }
            }
          }
        }
      `;
    }
       const response = await axios.post(
        graphql_url,
      {
        query: gqlQuery
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("GraphQL Query:", gqlQuery);
    console.log("GraphQL Response:", response.data);

    if (response.data) {
      console.log('GraphQL span flow output:', response.data);
      return response.data;
    } else {
      console.error('GraphQL response is null:', response.data);
      throw new Error('Null response received');
    }
  } catch (error) {
    console.error('Error retrieving spans:', error);
    throw error;
  }
};

export const findLogByErrorTrace = async (traceId) => {
  try {
    const needHistoricalData = JSON.parse(localStorage.getItem("needHistoricalData"));
  console.log('needHistoricalData:', needHistoricalData);
  let gqlQuery;
  if (true) {    
      gqlQuery = `

      query FindByTraceErrorTraceId {
        findByTraceErrorTraceId(traceId: "${traceId}") {
            createdTime
            serviceName
            severityText
            spanId
            traceId
            scopeLogs {
                scope {
                    name
                }
                logRecords {
                    flags
                    observedTimeUnixNano
                    severityNumber
                    severityText
                    spanId
                    timeUnixNano
                    traceId
                    body {
                        stringValue
                    }
                    attributes {
                        key
                        value {
                            intValue
                            stringValue
                        }
                    }
                }
            }
            id
        }
    }
    `;
  }
  console.log("The GQL Query", gqlQuery);

  const response = await axios.post(
    graphql_url,
    {
      query: gqlQuery
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  console.log("data--------------",response.data);
  if (response.data) {
    console.log('GraphQL trace error msg output:', response.data);
    console.log("the response data is returned");
    return response.data;

  } else {
    console.error('GraphQL response is null:', response.data);
    throw new Error('Null response received');
  }
} catch (error) {
  console.error("Error retrieving users:", error);
  throw error;
}
};

export const getTraceSummaryData = async (timeMinutesAgo) => {
  try {
    // Get the list of service names from localStorage and parse it
    const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));

    // Construct the URL with the service names
    // const serviceNameListParam = serviceListData.join('&serviceNameList=');

    const serviceNameListParam = serviceListData.join("&serviceNameList=");

    console.log(
      `${traceURL}/TraceSumaryChartDataCount?serviceNameList=${serviceNameListParam}&timeAgoMinutes=${timeMinutesAgo}`
    );

    const response = await axios.get(
      `${traceURL}/TraceSumaryChartDataCount?serviceNameList=${serviceNameListParam}&timeAgoMinutes=${timeMinutesAgo}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const getTraceSummaryDataWithDate = async (
  startDate,
  endDate,
  minutesAgo
) => {
  try {
    // Get the list of service names from localStorage and parse it
    const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));

    // Construct the URL with the service names
    // const serviceNameListParam = serviceListData.join('&serviceNameList=');

    // const serviceNameListParam = serviceListData.join("&serviceNameList=");

    let gqlQuery;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {

      gqlQuery = `
      query TraceMetricCount {
        traceMetricCount(
            serviceNameList: ${JSON.stringify(serviceListData)}
            from: ${JSON.stringify(startDate)}
            to: ${JSON.stringify(endDate)}
            minutesAgo: null
        ) {
            apiCallCount
            peakLatency
            serviceName
            totalErrorCalls
            totalSuccessCalls
        }
    }
    `;

    } else {
      gqlQuery = `
      query TraceMetricCount {
        traceMetricCount(
            serviceNameList: ${JSON.stringify(serviceListData)}
            from: ${JSON.stringify(startDate)}
            to: null
            minutesAgo: ${minutesAgo}
        ) {
            apiCallCount
            peakLatency
            serviceName
            totalErrorCalls
            totalSuccessCalls
        }
    }
      `;
    

    }

    const response = await axios.post(
      graphql_url,
      {
        query: gqlQuery
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );


    console.log(response.data);
    if (response.data) {
      console.log('GraphQL output:', response.data);
      return response.data;
    } else {
      console.error('GraphQL response is null:', response.data);
      throw new Error('Null response received');
    }

  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const getRecentTraceList = async (page, pageSize, serviceName) => {
  try {
    const response = await axios.get(
      `${traceURL}/getErroredDataForLastTwo?page=${page}&pageSize=${pageSize}&serviceName=${serviceName}`
    );
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const getDbSummaryDataWithDate = async (
  startDate,
  endDate,
  minutesAgo
) => {
  try {
    // Get the list of service names from localStorage and parse it
    const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));


    let gqlQuery;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      gqlQuery = `
      query DBTraceMetricCount {
        dBTraceMetricCount(
            minutesAgo: 0
            from: ${JSON.stringify(startDate)}
            to: ${JSON.stringify(endDate)}
            serviceNameList: ${JSON.stringify(serviceListData)}
        ) {
            dbCallCount
            dbPeakLatencyCount
            serviceName
        }
    }
    `;
    } else {
      gqlQuery = `
      query DBTraceMetricCount {
        dBTraceMetricCount(
          minutesAgo: ${minutesAgo}
          from: ${JSON.stringify(startDate)}
          to: null
          serviceNameList: ${JSON.stringify(serviceListData)}
        ) {
            dbCallCount
            dbPeakLatencyCount
            serviceName
        }
    }
    `;
       }

       const response = await axios.post(
        graphql_url,
        {
          query: gqlQuery
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

    console.log(response.data);
    if (response.data) {
      console.log('GraphQL getDbSummaryDataWithDate output:', response.data);
      return response.data;
    } else {
      console.error('GraphQL response is null:', response.data);
      throw new Error('Null response received');
    }

      } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};


// export const getKafkaSummaryData = async (startDate, endDate, minutesAgo) => {
//   try {
//     const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));
//     const serviceNameListParam = serviceListData.join("&serviceNameList=");

//     var finalUrl;

//     if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
//       console.log(
//         `History call + ${traceURL}/KafkaSumaryChartDataCount?from=${startDate}&serviceNameList=${serviceNameListParam}&to=${endDate}`
//       );
//       finalUrl = `${traceURL}/KafkaSumaryChartDataCount?from=${startDate}&serviceNameList=${serviceNameListParam}&to=${endDate}`;
//     } else {
//       console.log(
//         `Minutes call + ${traceURL}/KafkaSumaryChartDataCount?minutesAgo=${minutesAgo}&serviceNameList=${serviceNameListParam}&to=${startDate}`
//       );
//       finalUrl = `${traceURL}/KafkaSumaryChartDataCount?from=${startDate}&minutesAgo=${minutesAgo}&serviceNameList=${serviceNameListParam}`;
//     }

//     const response = await axios.get(finalUrl);
//     return response.data;
//   } catch (error) {
//     console.error("Error retrieving users:", error);
//     throw error;
//   }
// };

export const getKafkaSummaryData = async (
  startDate,
   endDate, 
   minutesAgo
   ) => {
  try {
// Get the list of service names from localStorage and parse it
const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));

// Construct the URL with the service names
// const serviceNameListParam = serviceListData.join('&serviceNameList=');

// const serviceNameListParam = serviceListData.join("&serviceNameList=");

let gqlQuery;

if (JSON.parse(localStorage.getItem("needHistoricalData"))) {

  gqlQuery = `
  query KafkaTraceMetricCount {
    kafkaTraceMetricCount(
        serviceNameList: ${JSON.stringify(serviceListData)}
        from: ${JSON.stringify(startDate)}
        to: ${JSON.stringify(endDate)}
        minutesAgo: 0
    ) {
        kafkaCallCount
        kafkaPeakLatency
        serviceName
    }
}
`;
} else {
  gqlQuery = `
  query KafkaTraceMetricCount {
    kafkaTraceMetricCount(
        serviceNameList: ${JSON.stringify(serviceListData)}
        minutesAgo: ${minutesAgo}
          from: ${JSON.stringify(startDate)}
          to: null
    ) {
        kafkaCallCount
        kafkaPeakLatency
        serviceName
    }
}
`;
}
const response = await axios.post(
  graphql_url,
  {
    query: gqlQuery
  },
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

console.log(response.data);
if (response.data) {
  console.log('GraphQL output:', response.data);
  return response.data;
} else {
  console.error('GraphQL response is null:', response.data);
  throw new Error('Null response received');
}

} catch (error) {
console.error("Error retrieving users:", error);
throw error;
}
};



export const getPeakLatencyFilterData = async (
  startDate,
  minPeakLatency,
  maxPeakLatency,
  endDate,
  minutesAgo,
  serviceNameList
  
) => {
  try {
    const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));
    // const serviceNameListParam = serviceListData.join("&serviceNameList=");

    let gqlQuery;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      gqlQuery = `
      query PeakLatency {
        peakLatency(
            serviceNameList: ${JSON.stringify(serviceListData)}
            minpeakLatency: ${JSON.stringify(minPeakLatency)}
            maxpeakLatency: ${JSON.stringify(maxPeakLatency)}
            from: ${JSON.stringify(startDate)}
            to: ${JSON.stringify(endDate)}
            minutesAgo: null
        ) {
            apiCallCount
            peakLatency
            serviceName
            totalErrorCalls
            totalSuccessCalls
        }
    }
    
    `;
    

    } else {
      
      gqlQuery = `
      query PeakLatency {
        peakLatency(
            serviceNameList: ${JSON.stringify(serviceListData)}
            minpeakLatency: ${JSON.stringify(minPeakLatency)}
            maxpeakLatency: ${JSON.stringify(maxPeakLatency)}
            from: ${JSON.stringify(startDate)}
            to:null
            minutesAgo:${minutesAgo}
        ) {
            apiCallCount
            peakLatency
            serviceName
            totalErrorCalls
            totalSuccessCalls
        }
    }
    
      `;


    }

    const response = await axios.post(
      graphql_url,
      {
        query: gqlQuery
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response.data);
    if (response.data) {
      console.log('GraphQL output:', response.data);
      return response.data;
    } else {
      console.error('GraphQL response is null:', response.data);
      throw new Error('Null response received');
    }
    
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const getDBPeakLatencyFilterData = async (
  startDate,
  minPeakLatency,
  maxPeakLatency,
  endDate,
  minutesAgo,

) => {
  try {
    const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));
    // const serviceNameListParam = serviceListData.join("&serviceNameList=");

    let gqlQuery;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      gqlQuery = `
      query DBTracePeakLatencyCount {
        dBTracePeakLatencyCount(
          from: ${JSON.stringify(startDate)}
          to: ${JSON.stringify(endDate)}
            minutesAgo: 0
            serviceNameList: ${JSON.stringify(serviceListData)}
            minPeakLatency: ${JSON.stringify(minPeakLatency)}
            maxPeakLatency: ${JSON.stringify(maxPeakLatency)}
        ) {
            dbCallCount
            dbPeakLatencyCount
            serviceName
        }
    }
    
      `;

    } else {
      gqlQuery = `
      query DBTracePeakLatencyCount {
        dBTracePeakLatencyCount(
          from: ${JSON.stringify(startDate)}
          to: null
            minutesAgo:  ${minutesAgo}
            serviceNameList: ${JSON.stringify(serviceListData)}
            minPeakLatency: ${JSON.stringify(minPeakLatency)}
            maxPeakLatency: ${JSON.stringify(maxPeakLatency)}
        ) {
            dbCallCount
            dbPeakLatencyCount
            serviceName
        }
    }
     
      `;
     }

    const response = await axios.post(
      graphql_url,
      {
        query: gqlQuery
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response.data);
    if (response.data) {
      console.log('GraphQL getDBPeakLatencyFilterData output:', response.data);
      return response.data;
    } else {
      console.error('GraphQL response is null:', response.data);
      throw new Error('Null response received');
    }

  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};


export const getKafkaPeakLatencyFilterData = async (
  startDate,
  minPeakLatency,
  maxPeakLatency,
  endDate,
  minutesAgo,

) => {
  try {
    const serviceListData = JSON.parse(localStorage.getItem("serviceListData"));
    const serviceNameListParam = serviceListData.join("&serviceNameList=");

    var finalUrl;

    if (JSON.parse(localStorage.getItem("needHistoricalData"))) {
      console.log(
        `History call + ${traceURL}/KafkaSumaryChartPeakLatencyCount?from=${startDate}&maxpeakLatency=${maxPeakLatency}&minpeakLatency=${minPeakLatency}&serviceNameList=${serviceNameListParam}&to=${endDate}`
      );
      finalUrl = ` ${traceURL}/KafkaSumaryChartPeakLatencyCount?from=${startDate}&maxpeakLatency=${maxPeakLatency}&minpeakLatency=${minPeakLatency}&serviceNameList=${serviceNameListParam}&to=${endDate}`;
    } else {
      console.log(
        `Minutes call + ${traceURL}/KafkaSumaryChartPeakLatencyCount?from=${startDate}&maxpeakLatency=${maxPeakLatency}&minpeakLatency=${minPeakLatency}&minutesAgo=${minutesAgo}&serviceNameList=${serviceNameListParam}`
      );
      finalUrl = `${traceURL}/KafkaSumaryChartPeakLatencyCount?from=${startDate}&maxpeakLatency=${maxPeakLatency}&minpeakLatency=${minPeakLatency}&minutesAgo=${minutesAgo}&serviceNameList=${serviceNameListParam}`;
    }

    const response = await axios.get(finalUrl);
    return response.data;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};
