import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// 🔥 EXISTING
export const sendMessage = (text) => {
  return API.post(
    `/interaction/agent-log?text=${encodeURIComponent(text)}&hcp_id=1`
  );
};

// 🔥 ADD THIS (IMPORTANT)
export const saveInteraction = (data) => {
  return API.post("/interaction/manual-log", data);
};