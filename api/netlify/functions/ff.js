const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

exports.handler = async (req, res) => {
  const startDate = new Date(new Date().setDate(new Date().getDate() - 5));
  const endDate = new Date();
  let sd_day = 0;
  let ed_day = 0;

  if (startDate.getDate() < 10) sd_day = `0${startDate.getDate()}`;
  else sd_day = startDate.getDate();

  if (endDate.getDate() < 10) ed_day = `0${endDate.getDate()}`;
  else ed_day = endDate.getDate();

  const startDateString = `${startDate.getFullYear()}${
    startDate.getMonth() + 1
  }${sd_day}`;
  const endDateString = `${endDate.getFullYear()}${
    endDate.getMonth() + 1
  }${ed_day}`;

  const call_url = `/idsiDIJ/dij/getCommonInfoAjax.do?system=SFK&sqlType=list&metaYn=Y&dataYn=Y&tranSeq=1&pageSize=10&pageNum=1&infoId=FOA_FOREST_MAP&qArea1=&qArea2=&startDate=${startDateString}&currentDate=${endDateString}&st_cd=`;

  const response = await axios({
    url: "https://www.safekorea.go.kr/idsiSFK/sfk/cs/csc/sfkApi.do",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `call_url=${encodeURIComponent(call_url)}`,
  });

  if (!response.ok) {
    return res
      .status(500)
      .json({ error: "Failed to fetch data from the remote server" });
  }

  const data = await response.json();

  const responseHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
  };

  return {
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify(data.data),
  };
};
