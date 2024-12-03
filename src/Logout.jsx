import React from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage에서 토큰 및 사용자 이름 삭제
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");

    // 로그인 페이지로 리디렉션
    navigate("/login");
  };

  return (
    <button onClick={handleLogout}>로그아웃</button>
  );
}

export default Logout;
