import client from "../client";

export const visualWorkshopApi = {
  generateImage: async (data) => {
    const response = await client.post("/function/generate-picture", data);
    return response;
  },
};
