import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/index.config";

export const getVideoSDKToken = (): string => {
  if (!config.videosdk.api_key || !config.videosdk.secret) {
    throw new Error("API_KEY and SECRET are missing");
  }
  const options = { expiresIn: "120m", algorithm: "HS256" };
  const payload = {
    apikey: config.videosdk.api_key,
    permissions: ["allow_join"],
    version: 2,
  };

  const token = jwt.sign(
    payload,
    config.videosdk.secret,
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

export const deleteRoomAPI = async (roomId: string) => {
  const url = "https://api.videosdk.live/v2/rooms";
  const token = getVideoSDKToken();
  const options = {
    method: "POST",
    headers: {
      AUTHORIZATION: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomId: roomId,
    }),
  };

  const response = await fetch(url, options);
  if (!response.ok) throw new Error("Error occured deleting the room");
};
