import { data } from "react-router-dom";
import client from "../client";

export const worldApi = {
  createWorld: async (data) => {
    const response = await client.post("/world/create", data);
    return response;
  },
  worldList: async (data) => {
    const response = await client.post("/world/list", data);
    return response;
  },
};
