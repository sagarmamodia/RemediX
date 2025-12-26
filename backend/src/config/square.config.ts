import { Client, Environment } from "square/legacy";
import { config } from "./index.config";

const squareClient = new Client({
  accessToken: config.square.access_token,
  environment: Environment.Sandbox,
});

export default squareClient;
