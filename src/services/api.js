import axios from "axios";

const api = axios.create({
  // Removida a última barra
  baseURL: "http://localhost:5000/task", 
});

export default api;