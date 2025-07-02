import axios from "axios";

export const api = axios.create({
  baseURL: process.env.URL_API_BACKEND,
  headers: {
    Accept: "application/json",
  },
});