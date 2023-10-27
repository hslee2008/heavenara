import { Box, CircularProgress, Typography } from "@mui/material";

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function Loading({ percentage }) {
  return (
    <div className="spinner-wrapper">
      <h1>울타리 너머로</h1>
      <CircularProgressWithLabel color="warning" value={percentage} />
      <p>이현승</p>
    </div>
  );
}

export default Loading;
