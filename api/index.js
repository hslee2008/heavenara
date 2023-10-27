const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());

/* Scrape Earthquake */
app.get("/scrape-earthquake-weathergov", async (req, res) => {
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

    if (eq_date < today.setDate(today.getDate() - 3)) return;
    if (date === "") return;

    eqs.push({
      date,
      magnitude,
      depth,
      latitude,
      longitude,
      location,
      map_pic,
      more_info,
    });
  });

  res.json(eqs);
});

/* Scrape Forest Fire News */
app.get("/scrape-forestfire-weathergov", async (req, res) => {
  let ffs = [];

  const browser = await puppeteer.launch({});
  const page = await browser.newPage();

  await page.goto(
    "https://www.safekorea.go.kr/idsiSFK/neo/sfk/cs/sfc/acd/frfireUserList.jsp?menuSeq=98",
    {
      waitUntil: "load",
    }
  );

  await page.waitForSelector(".content");
  await page.waitForTimeout(1000);

  const ffList = await page.$$eval(".boardList_table > tbody > tr", (rows) => {
    const data = [];

    rows.forEach((row) => {
      console.log(row);
      const location = row.querySelector(":nth-child(1) > a")?.textContent;
      const date = row.querySelector(":nth-child(2)")?.textContent;
      const status = row.querySelector(":nth-child(3)")?.textContent;

      data.push({ location, date, status });
    });

    return data;
  });

  ffs = ffList;

  await browser.close();

  res.json(ffs);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
