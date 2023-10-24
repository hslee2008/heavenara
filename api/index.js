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

app.get("/scrape-earthquake", async (req, res) => {
  let news = [];

  try {
    const response = await axios.get(
      "https://search.naver.com/search.naver?where=news&query=%EC%86%8D%EB%B3%B4%20%EC%A7%80%EC%A7%84&sm=tab_opt&sort=1&photo=0&field=0&pd=1&ds=&de=&docid=&related=0&mynews=0&office_type=0&office_section_code=0&news_office_checked=&nso=so%3Add%2Cp%3A1w&is_sug_officeid=0&office_category=0&service_area=0"
    );
    const $ = cheerio.load(response.data);

    const $newsList = $(".list_news > li");

    $newsList.each((index, child) => {
      const source = $(child).find(".info_group > a").attr("href");
      const time = $(child).find(".info_group > .info").text();
      const link = $(child).find(".news_contents > .dsc_thumb").attr("href");
      const title = $(child).find(".news_contents > .news_tit").attr("title");
      const description = $(child).find(".dsc_wrap > a").text();

      const date = Match(description, REGEX.date, 0);
      const location = Match(description, REGEX.location, 0);
      const magnitude = Match(description, REGEX.magnitude, 0);
      const latitude = locTOnumb(Match(description, REGEX.latitude, 1) ?? "");
      const longitude = locTOnumb(Match(description, REGEX.longitude, 1) ?? "");

      if (
        (date !== null || location !== null || magnitude !== null) &&
        !title.includes("중국")
      )
        news.push({
          source,
          time,
          link,
          title,
          description,
          info: {
            date,
            location,
            magnitude,
            latitude,
            longitude,
          },
        });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }

  res.json(news);
});
/* Scrape Earthquake News*/

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
      [type, date] = $(child)
        .find(`#apiTr_${index / 2}_typeNm`)
        .text()
        .split(" ( ");
      date = date?.replace(" ) ", "");

      const dateObject = new Date(date);

      if (dateObject > new Date())
        news.push({
          districtAreaName,
          fullAreaName,
          type,
          date,
        });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }

  res.json(news);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
