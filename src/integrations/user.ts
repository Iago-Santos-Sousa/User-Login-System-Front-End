import api from "./api";

import { AxiosError, AxiosResponse } from "axios";

type UserInfo = {
  name: string;
  email: string;
  password: string;
};

interface UserInfos {
  email: string;
  name: string;
  userId: number;
}

export const userApi = () => ({
  createUser: async (userInfo: UserInfo): Promise<number | null> => {
    const { name, email, password } = userInfo;
    const response: AxiosResponse = await api.post("/users/signup", {
      name,
      email,
      password,
    });

    return response.status;
  },

  forgotPassword: async (email: string): Promise<AxiosResponse> => {
    const response: AxiosResponse = await api.post("/users/forgot-password", {
      email,
    });

    return response.data;
  },

  resetPassword: async (
    resetPasswordToken: string,
    password: string,
  ): Promise<AxiosResponse> => {
    const response: AxiosResponse = await api.post("/users/reset-password", {
      resetPasswordToken,
      password,
    });

    return response.data;
  },

  checkUser: async (): Promise<number> => {
    try {
      const response: AxiosResponse = await api.get("/teste");
      return response.status;
    } catch (error) {
      if (typeof error === "string") {
        return 0;
      } else if (error instanceof Error) {
        return 0;
      }

      return 0;
    }
  },

  getUser: async (email: string): Promise<UserInfos> => {
    const response: AxiosResponse = await api.get(`/users/get-user/${email}`);
    return response.data;
  },

  uploadImage: async () => {},
});
