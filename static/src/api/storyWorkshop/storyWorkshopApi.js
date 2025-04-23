import client from "../client";

export const storyWorkshopApi = {
  generateStory: async (data) => {
    const response = await client.post("/function/story-generation", data);
    return response;
  },
};
