import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { Close, OpenInNew } from "@mui/icons-material";

function DialogBar({ setOpen, openLink }) {
  return (
    <AppBar color="primary" sx={{ position: "relative" }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => setOpen(false)}
          aria-label="close"
        >
          <Close />
        </IconButton>
        
        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
          기상청 지진정보
        </Typography>

        <IconButton
          edge="start"
          color="inherit"
          onClick={() => {
            setOpen(false);
            window.open(openLink);
          }}
        >
          <OpenInNew />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default DialogBar;
