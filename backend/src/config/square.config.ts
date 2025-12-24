import { Client, Environment } from "square/legacy";
import { config } from "./index.config";

const squareClient = new Client({
  accessToken: config.square.access_token,
  environment:
    config.isProd == true ? Environment.Production : Environment.Sandbox,
});

export default squareClient;
