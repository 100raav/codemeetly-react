import API from "./api";

// ✅ LOGIN
export const login = async (email, password) => {
  const res = await API.post("/auth/login", {
    email,
    password,
  });
  return res.data;
};

// ✅ REGISTER
export const register = async (name, email, password, role) => {
  const res = await API.post("/auth/register", {
    name,
    email,
    password,
    role,
  });
  return res.data;
};

// ✅ GET CURRENT USER
export const getCurrentUser = async () => {
  const res = await API.get("/auth/me");
  return res.data; // ⚠️ IMPORTANT (NOT res.data.data)
};