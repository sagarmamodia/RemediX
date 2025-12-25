import { config } from "../config/index.config";

//HELPER FUNCTION TO CREATE NEW ROOM LINK
export async function createRoomAPI(): Promise<{
  newRoomUrl: string;
  newRoomName: string;
}> {
  const baseUrl = config.daily.DAILY_ROOM_API;

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.daily.DAILY_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        start_audio_off: true,
        enable_chat: true,
        start_video_off: true,
      },
    }),
  });

  const data = await response.json();
  return { newRoomUrl: data.url, newRoomName: data.name };
}

//HELPER FUNCTION TO DELETE A ROOM
export async function deleteRoomAPI(roomName: string) {
  const baseUrl = config.daily.DAILY_ROOM_API + "/" + roomName;

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.daily.DAILY_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
}
