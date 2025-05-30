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
  deleteWorld: async (params) => {
    const response = await client.get("/world/delete", { params });
    return response;
  },
  addCharacter: async (data) => {
    const response = await client.post("/world/add-character", data);
    return response;
  },
  addStory: async (data) => {
    const response = await client.post("/world/add-story", data);
    return response;
  },
  getWorld: async (params) => {
    const response = await client.get("/world/get", { params });
    return response;
  },
  getWorldCharacters: async (params) => {
    const response = await client.get("/world/get-characters", { params });
    return response;
  },
  getWorldStories: async (params) => {
    const response = await client.get("/world/get-stories", { params });
    return response;
  },
};
