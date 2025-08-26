import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const credentials = {
  username: "admin",
  password: "Admin@1234",
};

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  async login() {
    if (this.accessToken) return this.accessToken;

    try {
      const response = await axios.post(`${API_URL}/token/`, credentials);
      this.accessToken = response.data.access;
      this.refreshToken = response.data.refresh;
      return this.accessToken;
    } catch (err: any) {
      console.error("Background login failed", err);
      throw err;
    }
  }

  getAccessToken() {
    return this.accessToken;
  }

  async refreshTokenIfNeeded() {
    if (!this.refreshToken) throw new Error("No refresh token available");
    const response = await axios.post(`${API_URL}/token/refresh/`, {
      refresh: this.refreshToken,
    });
    this.accessToken = response.data.access;
    return this.accessToken;
  }
}

export default new AuthService();
