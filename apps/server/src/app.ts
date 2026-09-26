import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import type { Express, Request, Response } from "express";

const app: Express = express();

const CORS_OPTIONS = {
  origin: "http://localhost:3000",
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(CORS_OPTIONS));
app.use(morgan("combined"));
app.use(helmet.hidePoweredBy());

app.get("/v2/health", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Server status OK",
  });
});

export default app;
