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
  Snackbar,
} from "@mui/material";

import { DialogBar, EQinfo, FFinfo, Loading, Error } from "./components";

function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [percentage, setPercentage] = useState(5);
  const [loading, error] = useKakaoLoader({
    appkey: "6072e8a0344039acacc746c3c35906fb",
  });
  const [denied, setDenied] = useState(false);

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

      navigator.geolocation.watchPosition(
        function (position) {
          console.log("Latitude is :", position.coords.latitude);
          console.log("Longitude is :", position.coords.longitude);
        },
        function (error) {
          if (error.code === error.PERMISSION_DENIED) setDenied(true);
        }
      );

      setPercentage(30);

      await fetch(
        "https://glowing-empanada-ae3094.netlify.app/.netlify/functions/eq"
      )
        .then((res) => res.json())
        .then((res) => {
          const temp_markers = [];

          setPercentage(40);

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
          setPercentage(45);
        });
    }

    async function fetchFFS() {
      const temp_markers = [];

      fetch("https://glowing-empanada-ae3094.netlify.app/.netlify/functions/ff")
        .then((res) => res.json())
        .then((res) => {
          const data = res.list;

          setPercentage(100);

          for (let i = 0; i < data.length; i++) {
            const { tpStatus, loc, mapTime } = data[i];

            const kakao = window.kakao;
            var geocoder = new kakao.maps.services.Geocoder();

            geocoder.addressSearch(loc, function (result, status) {
              if (status === kakao.maps.services.Status.OK) {
                const lat = result[0].y;
                const lng = result[0].x;

                temp_markers.push({
                  lat,
                  lng,
                  loc,
                  mapTime,
                  tpStatus,
                  link: "https://www.weather.go.kr/w/ff/flood.do",
                  more_info: "https://www.weather.go.kr/w/ff/flood.do",
                });
              }
            });
          }
        });

      setFFMarkers(temp_markers);
      setPercentage(70);
    }

    fetchEarthquake();
    setPercentage(50);
    setTimeout(() => {
      setPercentage(60);
      fetchFFS();
    }, 1000);
  }, []);

  if (appLoading || loading) return <Loading percentage={percentage}></Loading>;
  if (error) return <Error error={error}></Error>;

  return (
    <>
      <Snackbar
        open={denied}
        autoHideDuration={6000}
        onClose={() => setDenied(false)}
        message="위치 추적 권한이 없습니다."
      />

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
                  key={`${marker.lat}/${marker.lng}/${index}`}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  image={{
                    src: "/img/forestfire.png",
                    size: { width: 30, height: 35 },
                  }}
                >
                  <FFinfo {...{ marker, openDialog }}></FFinfo>
                </MapMarker>
              ))}
          </MarkerClusterer>
        </Map>
      </div>
    </>
  );
}

export default App;
