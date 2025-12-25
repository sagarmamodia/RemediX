import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/index.config";

export const getVideoSDKToken = (): string => {
  if (!config.videosdk.API_KEY || !config.videosdk.SECRET) {
    throw new Error("API_KEY and SECRET are missing");
  }
  console.log(config.videosdk.API_KEY);
  const options = { expiresIn: "120m", algorithm: "HS256" };
  const payload = {
    apikey: config.videosdk.API_KEY,
    permissions: ["allow_join"],
    version: 2,
  };

  const token = jwt.sign(
    payload,
    config.videosdk.SECRET,
    options as SignOptions
  );
  return token;
};

export const createRoomAPI = async (): Promise<string> => {
  const url = "https://api.videosdk.live/v2/rooms";
  const token = getVideoSDKToken();
  const options = {
    method: "POST",
    headers: {
      AUTHORIZATION: token,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, options);
  const data = await response.json();
  return data.roomId;
};
