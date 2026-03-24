import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2Redirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("TOKEN FROM URL:", token); // 🔍 debug

    if (token) {
      // ✅ SAVE TOKEN
      localStorage.setItem("token", token);

      // ✅ FORCE REFRESH STATE
      window.location.href = "/"; 
    } else {
      navigate("/login");
    }
  }, []);

  return <h2>Logging in...</h2>;
};

export default OAuth2Redirect;