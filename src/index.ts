import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { middleware } from "@line/bot-sdk";

import { handleEvent } from "./handler";
import { config } from "./client";

// const photon = new Photon()
const app = express();

app.post("/callback", middleware(config), (req, res) => {
  if (req.body.destination) {
    console.log("Destination User ID: " + req.body.destination);
  }

  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }

  // handle events separately
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const port = process.env["PORT"] || 8443;

app.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:${port}`)
);
