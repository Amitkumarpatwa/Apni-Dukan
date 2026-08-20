import { http } from "./http";

export const authApi = {
  login: (payload) => http.post("/auth/login", payload),
};
