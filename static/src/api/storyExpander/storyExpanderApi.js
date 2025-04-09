import client from "../client";

export const storyExpanderApi = {
  expandStory: async (data) => {
    const response = await client.post("/function/story-expander", data);
    return response;
  },
};
