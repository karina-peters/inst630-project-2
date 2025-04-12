import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import path from "path";

import { configDotenv } from "dotenv";
import { fileURLToPath } from "url";

import { getHeaders, getUrl, Response } from "./utils.js";
import stationData from "./data/stations.json" with { type: "json" };

// Load .env file
configDotenv();

const app = express();
const port = process.env.PORT || 3000;

// Parse request.body and make it available
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// Fetch dataset from WMATA API
app.get("/api/routes", async (req, res) => {
  console.log("fetching routes...");

  try {
    const response = await fetch(getUrl("TrainPositions/StandardRoutes", { contentType: "json" }), {
      method: "GET",
      headers: getHeaders(),
    });

    const routes = await response.json().then((json) => json["StandardRoutes"] || []);
    if (!routes || routes.length === 0) {
      throw new Error("Route information is missing or empty");
    }

    return Response.OK(res, routes);
  } catch (error) {
    return Response.Error(res, 500, error.message);
  }
});

// Fetch supplementary data file
app.get("/api/stations/transfer", async (req, res) => {
  console.log("fetching stations...");

  try {
    if (!stationData) {
      throw new Error("data is null or empty");
    }

    const data = stationData.filter((s) => s.IsTransfer).map((s) => ({ code: s.Code, name: s.Name }));
    return Response.OK(res, data);
  } catch (error) {
    return Response.Error(res, 500, error.message);
  }
});

// listen for requests :)
const listener = app.listen(port, async () => {
  console.log("Your app is listening on port " + listener.address().port);
});
