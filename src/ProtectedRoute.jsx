import React from "react";
import { Navigate } from "react-router-dom";

// 보호된 경로 컴포넌트
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("authToken"); // 로그인 상태 확인
  return isAuthenticated ? children : <Navigate to="/wrong-access" />;
}

export default ProtectedRoute;
