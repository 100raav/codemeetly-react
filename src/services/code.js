import api from "./api";

export const runCode = async (code, language, input) => {
  const res = await api.post("/api/code/run", {
    code,
    language,
    input,
  });

  return res.data;
};