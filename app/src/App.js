import {
  useKakaoLoader,
  Map,
  MapMarker,
  MarkerClusterer,
  MapTypeControl,
  ZoomControl,
  Circle,
} from "react-kakao-maps-sdk";
import { useLayoutEffect, useState } from "react";

import {
  Dialog,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Snackbar,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import { DialogBar, EQinfo, FFinfo } from "./components";

const eqMagnitude = {
  Ⅰ: "대부분 사람들은 느낄 수 없으나, 지진계에는 기록된다.",
  Ⅱ: "조용한 상태나 건물 위층에 있는 소수의 사람만 느낀다.",
  Ⅲ: "실내, 특히 건물 위층에 있는 사람이 현저하게 느끼며, 정지하고 있는 차가 약간 흔들린다.",
  Ⅳ: "실내에서 많은 사람이 느끼고, 밤에는 잠에서 깨기도 하며, 그릇과 창문 등이 흔들린다.",
  Ⅴ: "거의 모든 사람이 진동을 느끼고, 그릇, 창문 등이 깨지기도 하며, 불안정한 물체는 넘어진다.",
  Ⅵ: "모든 사람이 느끼고, 일부 무거운 가구가 움직이며, 벽의 석회가 떨어지기도 한다.",
  Ⅶ: "일반 건물에 약간의 피해가 발생하며, 부실한 건물에는 상당한 피해가 발생한다.",
  Ⅷ: "일반 건물에 부분적 붕괴 등 상당한 피해가 발생하며, 부실한 건물에는 심각한 피해가 발생한다.",
  Ⅸ: "잘 설계된 건물에도 상당한 피해가 발생하며, 일반 건축물에는 붕괴 등 큰 피해가 발생한다.",
  Ⅹ: "대부분의 석조 및 골조 건물이 파괴되고, 기차선로가 휘어진다.",
  ⅩⅠ: "남아있는 구조물이 거의 없으며, 다리가 무너지고, 기차선로가 심각하게 휘어진다.",
  ⅩⅡ: "모든 것이 피해를 입고, 지표면이 심각하게 뒤틀리며, 물체가 공중으로 튀어 오른다.",
};

function App() {
  useKakaoLoader({
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
  const [moreAboutEQ, setMoreAboutEQ] = useState(false);
  const [eq, setEQ] = useState({});

  function openDialog(link) {
    setOpenLink(link);
    setOpen(true);
  }

  function init(position) {
    setLat(position.coords.latitude);
    setLng(position.coords.longitude);
  }

  useLayoutEffect(() => {
    navigator.geolocation.getCurrentPosition(init);

    navigator.geolocation.watchPosition(
      function (position) {
        if (
          position.coords.latitude !== lat &&
          position.coords.longitude !== lng
        )
          init(position);
      },
      function (error) {
        if (error.code === error.PERMISSION_DENIED) setDenied(true);
      }
    );

    async function getDisaster() {
      await fetch(
        "https://glowing-empanada-ae3094.netlify.app/.netlify/functions/eq"
      )
        .then((res) => res.json())
        .then((res) => {
          const temp_markers = [];

          localStorage.setItem("length", res.length);

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
              max_intensity,
              image,
              kmRadius,
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
              maxIntensity: max_intensity,
              image: image,
              kmRadius: kmRadius,
            });
          }

          setEQMarkers(temp_markers);
        });

      /*await fetch(
        "https://glowing-empanada-ae3094.netlify.app/.netlify/functions/ff"
      )
        .then((res) => res.json())
        .then((res) => {
          const temp_markers = [];

          const data = res.list;

          localStorage.setItem(
            "length",
            parseInt(localStorage.getItem("length")) + data.length
          );

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

          setFFMarkers(temp_markers);
        });*/
    }

    getDisaster();
  }, [lat, lng]);

  return (
    <>
      <Snackbar
        open={denied}
        autoHideDuration={6000}
        onClose={() => setDenied(false)}
        message="위치 추적 권한이 없습니다."
      />

      <SpeedDial
        ariaLabel="Natural Disaster"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<img src="/img/eq-icon.png" width="40" alt="earthquake" />}
          tooltipTitle="지진"
          tooltipOpen
          onClick={() => setCurrent("지진")}
        />
        <SpeedDialAction
          icon={<img src="/img/ff-icon.png" width="40" alt="forest fire" />}
          tooltipTitle="산불"
          tooltipOpen
          onClick={() => setCurrent("산불")}
        />
      </SpeedDial>

      <Dialog
        fullScreen
        open={moreAboutEQ}
        onClose={() => setMoreAboutEQ(false)}
      >
        <DialogBar setOpen={setMoreAboutEQ} openLink={openLink}></DialogBar>

        <div className="eq-center">
          <div className="eq-info-wrapper">
            <img
              src={eq.link}
              alt="earth quake information"
              className="eq-info-image"
            />

            <div className="eq-info">
              <h1>{eq.location}</h1>
              <h2>{eq.date}</h2>
              <h3>
                규모 {eq.magnitude} · 깊이 {eq.depth}km (
                {eq.depth < 70 ? "천발" : eq.depth < 300 ? "중발" : "심발"}지진)
              </h3>

              <br />
              <br />

              <div>
                <Typography variant="h5">
                  최대 진도 {eq.maxIntensity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {eqMagnitude[eq.maxIntensity]}
                </Typography>
              </div>
            </div>

            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
      </Dialog>

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
          <MapTypeControl position={"TOPRIGHT"} />
          <ZoomControl position={"RIGHT"} />

          <MapMarker position={{ lat: lat, lng: lng }}></MapMarker>

          <MarkerClusterer averageCenter>
            {current === "지진" &&
              EQmarkers.map((marker, index) => (
                <div key={`${marker.lat}/${marker.lng}/${index}/eq`}>
                  <MapMarker
                    position={{ lat: marker.lat, lng: marker.lng }}
                    image={{
                      src: "/img/earthquake.png",
                      size: { width: 30, height: 35 },
                    }}
                    onClick={() => {
                      setEQ(marker);
                      setMoreAboutEQ(true);
                    }}
                  >
                    <EQinfo
                      {...{ marker, openDialog }}
                      openMore={() => {
                        setEQ(marker);
                        setMoreAboutEQ(true);
                      }}
                    ></EQinfo>
                  </MapMarker>

                  {!marker.more_info.includes("undefined") && (
                    <Circle
                      center={{
                        lat: marker.lat,
                        lng: marker.lng,
                      }}
                      radius={parseInt(marker.kmRadius) * 1000}
                      strokeWeight={20}
                      strokeColor={"#FFE562"}
                      strokeOpacity={0.5}
                      strokeStyle={"solid"}
                      fillColor={"#FFE562"}
                      fillOpacity={0.5}
                    />
                  )}
                </div>
              ))}

            {current === "산불" &&
              FFmarkers.map((marker, index) => (
                <MapMarker
                  key={`${marker.lat}/${marker.lng}/${index}/ff`}
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
