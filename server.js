import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import path from "path";

import { configDotenv } from "dotenv";
import { fileURLToPath } from "url";

import { getHeaders, getUrl, Response } from "./utils.js";

// Load .env file
configDotenv();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse request.body and make it available
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

// WMATA API wrapper
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

app.get("/api/trains", async (req, res) => {
  console.log("fetching trains...");

  try {
    const response = await fetch(getUrl("TrainPositions/TrainPositions", { contentType: "json" }), {
      method: "GET",
      headers: getHeaders(),
    });

    const data = await response.json().then((json) => json["TrainPositions"] || []);
    if (!data || data.length === 0) {
      throw new Error("data is null or empty");
    }

    return Response.OK(res, data);
  } catch (error) {
    return Response.Error(res, 500, error.message);
  }
});

// listen for requests :)
const listener = app.listen(port, async () => {
  console.log("Your app is listening on port " + listener.address().port);
});
