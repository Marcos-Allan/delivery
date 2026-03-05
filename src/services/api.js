import axios from "axios";

const api = axios.create({
  baseURL: "https://delivery-back-fcfh.onrender.com",
  // baseURL: "http://localhost:3000",
});

export default api;