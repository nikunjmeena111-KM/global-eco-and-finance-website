import axios from "axios";
import News from "../models/news.model.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const getGlobalNews = async (context = {}) => {
  if (context?.source !== "cron") {
    logger.info({ layer: "externalService", service: "news", action: "getGlobalNews", message: "Started" });
  }

  // Check DB cache
  const latestNews = await News.find({ category: "global" })
    .sort({ publishedAt: -1 });

  if (latestNews.length > 0) {
    const lastUpdate = new Date(latestNews[0].createdAt).getTime();
    const now = Date.now();

    if (now - lastUpdate < CACHE_DURATION) {
      if (context?.source !== "cron") {
        logger.info({ layer: "cache", service: "news", action: "getGlobalNews", message: "Mongo HIT" });
      }

      return {
        source: "cache",
        count: latestNews.length,
        news: latestNews,
      };
    }
  }

  // Fetch from external API
  const API_KEY = process.env.NEWS_API_KEY;

  if (!API_KEY) {
    logger.error({ layer: "externalService", service: "news", action: "getGlobalNews", message: "API key missing" });
    throw new ApiError(500, "News API key not configured");
  }

  const response = await axios.get(
    `https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=8&apiKey=${API_KEY}`
  );

  if (response.data.status !== "ok") {
    logger.error({ layer: "externalService", service: "news", action: "getGlobalNews", message: "API failed" });
    throw new ApiError(500, "Failed to fetch news");
  }

  const articles = response.data.articles;

  // Normalize Data
  const formattedNews = articles.map((article) => ({
    title: article.title,
    description: article.description,
    url: article.url,
    imageUrl: article.urlToImage,
    source: article.source?.name,
    publishedAt: article.publishedAt,
    category: "global",
  }));

  //Replace Old News
  await News.deleteMany({ category: "global" });
  await News.insertMany(formattedNews);

  if (context?.source !== "cron") {
    logger.info({ layer: "externalService", service: "news", action: "getGlobalNews", message: "Success", count: formattedNews.length });
  }

  return {
    source: "api",
    count: formattedNews.length,
    news: formattedNews,
  };
};


export {getGlobalNews}