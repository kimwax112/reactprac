import logo from './logo.svg';
import './App.css';
import React from 'react';
import LoginPrac from './LoginPrac';
import ActiveLogin from './ActiveLogin';
import ActiveAfterLogin from './ActiveAfterLogin';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Logout from './Logout';
import WrongAccess from './WrongAccess'; 

function App() {
  const isAuthenticated = !!localStorage.getItem("authToken");

  return (
    <Router>
      <Routes>
        {/* 홈 페이지 및 로그인 페이지 설정 */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/after-login" /> : <ActiveLogin />} />
        <Route path="/login" element={<ActiveLogin />} />

        {/* 인증된 사용자만 접근 가능한 /after-login */}
        <Route
          path="/after-login"
          element={
            <ProtectedRoute>
              <ActiveAfterLogin />
            </ProtectedRoute>
          }
        />
        
        {/* 로그아웃 컴포넌트 */}
        <Route path="/logout" element={<Logout />} />
        {/* 잘못된 접근 페이지 */}
        <Route path="/wrong-access" element={<WrongAccess />} />
      </Routes>
    </Router>
  );
}

export default App;