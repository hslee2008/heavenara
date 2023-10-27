import {
  useKakaoLoader,
  Map,
  MapMarker,
  MarkerClusterer,
} from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";

import {
  Dialog,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";

import DialogBar from "./components/DialogBar";
import EQinfo from "./components/EQinfo";
import Loading from "./components/Loading";
import Error from "./components/Error";

function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [percentage, setPercentage] = useState(5);
  const [loading, error] = useKakaoLoader({
    appkey: "6072e8a0344039acacc746c3c35906fb",
  });

  const [current, setCurrent] = useState("지진");

  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  const [EQmarkers, setEQMarkers] = useState([]);
  const [FFmarkers, setFFMarkers] = useState([]);

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
    async function fetchEarthquake() {
      setPercentage(15);
      navigator.geolocation.getCurrentPosition(init);
      setPercentage(30);

      // scrape earthquake
      await fetch("https://heavenara.cyclic.app/scrape-earthquake-weathergov")
        .then((res) => res.json())
        .then((res) => {
          const temp_markers = [];

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

            temp_markers.push({
              lat: latitude,
              lng: longitude,
              location: location,
              date: date,
              link: "https://www.weather.go.kr/" + map_pic,
              more_info: "https://www.weather.go.kr/" + more_info,
              magnitude: magnitude,
              depth: depth,
            });

            if (i === res.length - 1) setAppLoading(false);
          }

          setEQMarkers(temp_markers);
          setPercentage(70);
        });
    }

    async function fetchFFS() {
      const temp_markers = [];

      await fetch(
        "https://api.apify.com/v2/datasets/5cHXMX9PNpR64o4zI/items?token=apify_api_cyf3A0caKvPqYTpIVRitsmq7oPnE4T3g9hzw"
      )
        .then((res) => res.json())
        .then((res) => {
          for (let i = 0; i < res.length; i++) {
            const { location, date, status } = res[i];

            temp_markers.push({
              location,
              date,
              status,
            });
          }
        });

      setFFMarkers((prev) => [...prev, ...temp_markers]);
      setPercentage(80);
    }

    fetchEarthquake();
    fetchFFS();
    setPercentage(100);
  }, []);

  if (appLoading || loading) return <Loading percentage={percentage}></Loading>;
  if (error && !error.toString()?.includes("TypeError")) return <Error></Error>;

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<img src="/img/eq-icon.png" width="40" alt="earthquake" />}
          tooltipTitle="지진"
          onClick={() => setCurrent("지진")}
        />
        <SpeedDialAction
          icon={<img src="/img/ff-icon.png" width="40" alt="forest fire" />}
          tooltipTitle="산불"
          onClick={() => setCurrent("산불")}
        />
      </SpeedDial>

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
        <DialogBar {...{ setOpen, openLink }}></DialogBar>
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

          <MarkerClusterer averageCenter>
            {current === "지진" &&
              EQmarkers.map((marker, index) => (
                <MapMarker
                  clickable
                  position={{ lat: marker.lat, lng: marker.lng }}
                  key={`${marker.lat}/${marker.lng}/${index}`}
                  image={{
                    src: "/img/earthquake.png",
                    size: { width: 30, height: 35 },
                  }}
                >
                  <EQinfo {...{ marker, openDialog }}></EQinfo>
                </MapMarker>
              ))}

            {current === "산불" &&
              FFmarkers.map((marker, index) => (
                <MapMarker
                  clickable
                  position={{
                    
                  }}
                  key={`${marker.location[0]}/${marker.location[1]}/${index}`}
                  image={{
                    src: "/img/forest-fire.png",
                    size: { width: 30, height: 35 },
                  }}
                >
                  <EQinfo {...{ marker, openDialog }}></EQinfo>
                </MapMarker>
              ))}
          </MarkerClusterer>
        </Map>
      </div>
    </>
  );
}

export default App;
