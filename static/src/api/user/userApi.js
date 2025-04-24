import client from "../client";

export const userApi = {
  updateProfile: async (userData) => {
    const response = await client.post("/user/profile/update", userData);
    return response;
  },
  updatePassword: async (passwordData) => {
    const response = await client.post("/user/password/update", passwordData);
    return response;
  },
  getAccountStats: async () => {
    const response = await client.get("/user/stats");
    return response;
  },
};
