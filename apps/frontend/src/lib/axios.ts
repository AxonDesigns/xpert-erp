import axios from "axios";

const api = axios.create({
  baseURL: '/',
  proxy: {
    host: "localhost",
    port: 3000,
  },
  withCredentials: true,
})