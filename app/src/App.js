import { useKakaoLoader, Map, MapMarker } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";

import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { toDateDifference } from "./utils/date";

import "./css/App.css";

function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [loading, error] = useKakaoLoader({
    appkey: "6072e8a0344039acacc746c3c35906fb",
  });
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [markers, setMarkers] = useState([]);

  const [open, setOpen] = useState(false);
  const [openLink, setOpenLink] = useState("");

  function openDialog(link) {
    setOpenLink(link);
    setOpen(true);
  }

  function init(position) {
    setLat(position.coords.latitude);
    setLng(position.coords.longitude);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(init);

    // scrape earthquake
    fetch("https://heavenara.cyclic.app/scrape-earthquake-weathergov")
      .then((res) => res.json())
      .then((res) => {
        for (let i = 0; i < res.length; i++) {
          const {
            date,
            magnitude,
            depth,
            latitude,
            longitude,
            location,
            map_pic,
            more_info,
          } = res[i];

          setMarkers((markers) => [
            ...markers,
            {
              lat: latitude,
              lng: longitude,
              location: location,
              date: date,
              link: "https://www.weather.go.kr/" + map_pic,
              more_info: "https://www.weather.go.kr/" + more_info,
              magnitude: magnitude,
              depth: depth,
            },
          ]);

          if (i === res.length - 1) setAppLoading(false);
        }
      });
  }, []);

  if (appLoading || loading)
    return (
      <div className="spinner-wrapper">
        <ReactLoading type="spin" color="skyblue" height={300} width={300} />
      </div>
    );
  if (process.env.NODE_ENV === "production" && error)
    return (
      <div className="spinner-wrapper">
        <h1>unknown error</h1>
      </div>
    );

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <AppBar color="primary" sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
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
              <OpenInNewIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <iframe
          src={openLink}
          title="dialog"
          style={{
            width: "100vw",
            height: "100vh",
          }}
        ></iframe>
      </Dialog>

      <div className="App">
        <Map
          center={{ lat: lat, lng: lng }}
          style={{ width: "100%", height: "100vh" }}
          level={12}
        >
          <MapMarker position={{ lat: lat, lng: lng }}></MapMarker>

          {markers.map((marker, index) => (
            <MapMarker
              clickable
              position={{ lat: marker.lat, lng: marker.lng }}
              key={`${marker.lat}/${marker.lng}/${index}`}
              image={{
                src: "/img/earthquake.png",
                size: { width: 30, height: 35 },
              }}
              onClick={() => window.open(marker.link)}
            >
              <div
                className={`overlay-wrapper ${
                  marker.magnitude <= 2.5
                    ? "eq-1"
                    : marker.magnitude <= 5.4
                    ? "eq-2"
                    : marker.magnitude <= 6.0
                    ? "eq-3"
                    : marker.magnitude <= 6.9
                    ? "eq-4"
                    : marker.magnitude <= 7.9
                    ? "eq-5"
                    : "eq-6"
                }`}
              >
                <div
                  onClick={() => window.open(marker.link)}
                  className="overlay"
                >
                  <p className="location">{marker.location}</p>
                  <p className="more">
                    {toDateDifference(marker.date)}일 전 · {marker.magnitude}{" "}
                    규모
                  </p>
                </div>

                {marker.magnitude > 2.5 && (
                  <div className="button-wrapper">
                    <button
                      onClick={() =>
                        openDialog("https://www.weather.go.kr/pews/man/m1.html")
                      }
                    >
                      행동요령
                    </button>
                    {marker.more_info &&
                      marker.more_info !==
                        "https://www.weather.go.kr/undefined" && (
                        <button onClick={() => openDialog(marker.more_info)}>
                          더보기
                        </button>
                      )}
                  </div>
                )}
              </div>
            </MapMarker>
          ))}
        </Map>
      </div>
    </>
  );
}

export default App;
