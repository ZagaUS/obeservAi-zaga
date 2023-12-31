import React, { useEffect } from "react";
import TraceList from "./trace/TraceList";
import { Box, Card, Typography, useMediaQuery, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import SpanFlow from "./trace/spanReactFlow/SpanFlow";
import SpanInfo from "./trace/spanReactFlow/SpanInfo";
import { useContext } from "react";
import { GlobalContext } from "../../global/globalContext/GlobalContext";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import ErrorContext from "./trace/ErrorBox/ErrorContext";

import "./index.css";

const Traces = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { traceGlobalEmpty, traceGlobalError, showError } =
    useContext(GlobalContext);

  const isiphone = useMediaQuery((theme) => theme.breakpoints.down("iphone"));
  const isiphoneSE = useMediaQuery((theme) =>
    theme.breakpoints.only("iphoneSE")
  );
  const isipadmini = useMediaQuery((theme) =>
    theme.breakpoints.only("ipadmini")
  );
  const isipadpro = useMediaQuery((theme) =>
    theme.breakpoints.only("isipadpro")
  );
  const issurfacepro = useMediaQuery((theme) =>
    theme.breakpoints.only("issurfacepro")
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "normal",
      }}
    >
      {traceGlobalError ? (
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
            {traceGlobalError}
          </Typography>
        </div>
      ) : traceGlobalEmpty ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "73vh",
          }}
        >
          <Typography variant="h5" fontWeight={"600"}>
            {traceGlobalEmpty}
          </Typography>
        </div>
      ) : (
        <div style={{ display: "flex", width: "100%" }}>
          {/* Rest of your JSX structure */}
          {/* <TraceTopBar /> */}

          <div style={{ width: "100%" }}>
            <Box sx={{ m: "14px 10px 0 20px" }}>
              <Card
                elevation={4}
                sx={{
                  // backgroundColor: theme.palette.mode==="dark"?"#2C3539":null,
                  padding: "15px",
                  width: "100%",
                  overflowX: "auto",
                  overflowY: issurfacepro ? "scroll" : null,
                  height: issurfacepro ? "110vh" : "calc(84vh - 72px)",

                  ...(isiphone && {
                    height: "calc(150vh - 5px)",
                  }),

                  ...(isipadmini && {
                    height: "120vh",
                  }),

                  ...(isipadpro && {
                    maxHeight: "170vh",
                  }),

                  // ...(
                  //   issurfacepro && {
                  //     maxHeight: "120vh",
                  //   }),
                }}
              >
                <TraceList />
              </Card>
            </Box>
          </div>

          <div style={{ width: "100%" }}>
            <Box sx={{ m: "14px 20px 10px 10px" }}>
              {!showError ? (
                <Card
                  elevation={4}
                  sx={{
                    padding: "15px",
                    width: isiphoneSE ? "500px" : isipadpro ? "450px" : "600px",
                    overflowY: issurfacepro ? "scroll" : null,
                    height: issurfacepro ? "110vh" : "calc(84vh - 72px)",
                    ...(isiphone && {
                      height: "148vh",
                    }),

                    ...(isipadmini && {
                      height: "120vh",
                    }),

                    ...(isipadpro && {
                      maxHeight: "170vh",
                    }),

                    // ...(
                    //   issurfacepro && {
                    //     maxHeight: "120vh",
                    //   }),
                  }}
                >
                  <SpanFlow />
                </Card>
              ) : (
                <Card
                  elevation={4}
                  sx={{
                    // backgroundColor: theme.palette.mode==="dark"?"#2C3539":null,
                    padding: "15px",
                    width: isiphoneSE ? "500px" : "600px",
                    height: "calc(84vh - 72px)",
                    // ...(
                    //   isiphone && {
                    //     height: "calc(150vh - 85px)",
                    //   }),
                  }}
                >
                  <ErrorContext />
                </Card>
              )}
              {/* <Box sx={{ m: "30px 20px 20px 0" }} >
            <Card sx={{ backgroundColor: colors.primary[400], padding: "15px", width: "620px", height: 315 }}>
              <SpanInfo />
            </Card>
          </Box> */}
            </Box>
          </div>
        </div>
      )}
    </div>
  );
};

export default Traces;
