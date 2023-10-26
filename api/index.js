const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const phantom = require("phantom");
const { waitUntil } = require("async-wait-until");

const REGEX = require("./regex.js");

const app = express();
app.use(cors());

/* Scrape Earthquake News */
function Match(text, regex, index) {
  const matches = text.match(regex);

  if (matches) {
    return matches[index];
  }

  return null;
}

function locTOnumb(loc) {
  const locArr = loc.split(" ");
  const locNum = locArr[0];

  return locNum;
}

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

/* Scrape Strong Wind News */
app.get("/scrape-strongwind", async (req, res) => {
  let news = [];

  try {
    const response = await axios.get(
      "https://m.search.naver.com/search.naver?sm=mtb_hty.top&where=m&oquery=%EC%9E%AC%EB%82%9C%EB%AC%B8%EC%9E%90&tqi=ig6dWdprfShssL4f9dKssssstBh-115609&query=%EC%9E%AC%EB%82%9C%EB%AC%B8%EC%9E%90+%EA%B0%95%ED%92%8D"
    );
    const $ = cheerio.load(response.data);

    const $newsList = $(".disaster_list > li");

    $newsList.each((index, child) => {
      const galeInfo = $(child).find(".info_box > .date").text();

      const text = $(child).find(".disaster_text").text();
      const affectedArea = $(child).find(".info_box > .area").text();
      const date = galeInfo.slice(0, 10);
      const time = galeInfo.slice(12, 17);
      const area = galeInfo.slice(18, 22);
      const howtoactlink = $(child).find(".disaster_info > a").attr("href");

      news.push({
        text,
        affectedArea,
        date,
        time,
        area,
        howtoactlink,
      });
    });

    news = news.filter((item, index) => {
      const _item = JSON.stringify(item);
      return (
        index ===
        news.findIndex((obj) => {
          return JSON.stringify(obj) === _item;
        })
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }

  res.json(news);
});
/* Scrape Strong Wind News */

/* Scrape Heat Wave */
async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/KoichiYasuoka/roberta-large-korean-upos",
    {
      headers: {
        Authorization: "Bearer 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",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

app.get("/scrape-heatwave", async (req, res) => {
  let news = [];
  let length = 0;

  try {
    const response = await axios.get(
      "https://search.naver.com/search.naver?where=news&query=%EC%86%8D%EB%B3%B4%20%ED%8F%AD%EC%97%BC%EC%A3%BC%EC%9D%98%EB%B3%B4&sm=tab_opt&sort=1&photo=0&field=0&pd=0&ds=&de=&docid=&related=0&mynews=1&office_type=2&office_section_code=15&news_office_checked=2785&nso=so%3Add%2Cp%3Aall&is_sug_officeid=0&office_category=0&service_area=0"
    );
    const $ = cheerio.load(response.data);

    const $newsList = $(".list_news > li");

    length = $newsList.length;

    $newsList.each(async (index, child) => {
      const date = $(child).find(".info_group > .info").text().slice(5, -1);
      const title = $(child).find(".news_contents > .news_tit").attr("title");
      const link = $(child).find(".dsc_thumb").attr("href");

      let 도 = "",
        시 = "",
        군 = "",
        시도 = "";

      const res = await query(title);
      const place = res.filter((item) => item.entity_group === "NOUN");
      const words = [];

      for (let i = 0; i < place.length; i++) {
        words.push(place[i]["word"]);
      }

      words.forEach((text) => {
        if (text.endsWith("도")) 도 = text;
        if (text.endsWith("군")) 군 = text;
        if (text.endsWith("시") && !text.includes("도")) 시 = text;
        if (text.endsWith("시") && text.includes("도")) 시도 = text;
      });

      let si, doo;
      if (시도) {
        [si, doo] = 시도.split(" ");
        시 = si;
        도 = doo;
      }

      news.push({
        date,
        title,
        link,
        area: {
          도,
          시,
          군,
          시도,
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }

  await waitUntil(() => news.length === length);

  res.json(news);
});
/* Scrape Heat Wave */

/* Scrape Danger Zone */
function waitFor($config) {
  $config._start = $config._start || new Date();

  if ($config.timeout && new Date() - $config._start > $config.timeout) {
    if ($config.error) $config.error();
    if ($config.debug)
      console.log("timedout " + (new Date() - $config._start) + "ms");
    return;
  }

  if ($config.check()) {
    if ($config.debug)
      console.log("success " + (new Date() - $config._start) + "ms");
    return $config.success();
  }

  setTimeout(waitFor, $config.interval || 0, $config);
}

app.get("/scrape-dangerzone", async (req, res) => {
  let news = [];

  try {
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.open(
      "http://www.safekorea.go.kr/idsiSFK/neo/sfk/cs/sfc/fcl/riskUserList.html?menuSeq=314"
    );
    await page.property("onLoadFinished");
    const html = await page.property("content");

    waitFor({
      debug: true,
      interval: 0,
      timeout: 5000,
      check: function () {
        return page.evaluate(function () {
          return $("#apiTr").is(":visible");
        });
      },
      success: function () {
        const $ = cheerio.load(html);
        const $newsList = $("#apiTr > tr");

        $newsList.each((index, child) => {
          if (index % 2 === 1) return;

          const districtAreaName = $(child)
            .find(`#apiTr_${index / 2}_dstrAreaNm`)
            .text();
          const fullAreaName = $(child)
            .find(`#apiTr_${index / 2}_fullAreaNm`)
            .text()
            .slice(0, -1);
          const typeNm = $(child)
            .find(`#apiTr_${index / 2}_typeNm`)
            .text();
          console.log(typeNm);
          const type = typeNm.slice(0, 4);
          const date = typeNm.slice(-13, -4);

          const dateObject = new Date(date);

          news.push({
            districtAreaName,
            fullAreaName,
            type,
            date,
            typeNm,
          });
        });
      },
      error: function () {},
    });

    /*const $ = cheerio.load(html);
    const $newsList = $("#apiTr > tr");

    $newsList.each((index, child) => {
      if (index % 2 === 1) return;

      const districtAreaName = $(child)
        .find(`#apiTr_${index / 2}_dstrAreaNm`)
        .text();
      const fullAreaName = $(child)
        .find(`#apiTr_${index / 2}_fullAreaNm`)
        .text()
        .slice(0, -1);
      const typeNm = $(child)
        .find(`#apiTr_${index / 2}_typeNm`)
        .text();
      const type = typeNm.slice(0, 4);
      const date = typeNm.slice(-13, -4);

      const dateObject = new Date(date);

      news.push({
        districtAreaName,
        fullAreaName,
        type,
        date,
        typeNm,
      });
    });*/
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }

  res.json(news);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
