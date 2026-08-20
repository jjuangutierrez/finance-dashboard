import api from "@/lib/api";
import type { User } from "../../user/models/User";

class UserService {
  async getProfile(): Promise<User> {
    const { data } = await api.get<User>("/users/me");
    return data;
  }

  async updateProfile(request: {
    firstName: string;
    lastName: string;
    userName: string;
  }): Promise<void> {
    await api.put("/users/me", request);
  }
  async deleteAccount(): Promise<void> {
    await api.delete("/users/me");
  }
}

export default new UserService();
