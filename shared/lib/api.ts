import axios from "axios";

const API_BASE = "/api"; // adjust if you have a different base URL

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optionally attach token for auth requests
export const setToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

// ----------------- AUTH -----------------
export const register = async (data: {
  username: string;
  name?: string;
  email: string;
  password: string;
  retypedPassword: string;
}) => {
  const response = await apiClient.post("/register", data);
  return response.data;
};

export const login = async (data: { username: string; password: string }) => {
  const response = await apiClient.post("/login", data);
  return response.data;
};

// ----------------- USERS -----------------
export const getUserProfile = async (userId: string) => {
  const response = await apiClient.get(`/user/${userId}`);
  return response.data;
};

// ----------------- CHATS -----------------
export const getUserChats = async (userId: string) => {
  const response = await apiClient.get(`/chats/${userId}`);
  return response.data;
};

export const createChat = async (data: {
  name: string;
  members: string[];
  type: "direct" | "group" | "bot";
}) => {
  const response = await apiClient.post("/chats", data);
  return response.data;
};

// ----------------- MESSAGES -----------------
export const sendMessage = async (data: {
  chatId: string;
  text: string;
}) => {
  const response = await apiClient.post("/messages", data);
  return response.data;
};

export default apiClient;
