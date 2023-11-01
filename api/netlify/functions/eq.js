const axios = require("axios");
const cheerio = require("cheerio");

exports.handler = async (event, context) => {
  let eqs = [];

  const response = await axios.get(
    "https://www.weather.go.kr/plus/eqkvol/domesticlist.jsp?dpType=a"
  );
  const $ = cheerio.load(response.data);

  const $eqList = $(".table_develop > tbody > tr");

  $eqList.each((index, child) => {
    const date = $(child).find(":nth-child(2)").text();
    const magnitude = $(child).find(":nth-child(3)").text();
    const depth = $(child).find(":nth-child(4)").text();
    const max_intensity = $(child).find(":nth-child(5)").text();
    const latitude = $(child).find(":nth-child(6)").text().trim().split(" ")[0];
    const longitude = $(child)
      .find(":nth-child(7)")
      .text()
      .trim()
      .split(" ")[0];
    const location = $(child).find(":nth-child(8)").text();
    const map_pic = $(child)
      .find(":nth-child(9) > a")
      .attr("onclick")
      ?.slice(16, 68);
    const more_info = $(child).find(":nth-child(10) > a").attr("href");

    const eq_date = new Date(date.split(" ")[0].replace(/\//g, "-"));
    const today = new Date();

    if (eq_date < today.setDate(today.getDate() - 7)) return;
    if (date === "") return;

    eqs.push({
      date,
      magnitude,
      depth,
      max_intensity,
      latitude,
      longitude,
      location,
      map_pic,
      more_info,
    });
  });

  const responseHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
  };

  return {
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify(eqs),
  };
};
