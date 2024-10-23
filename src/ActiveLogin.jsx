import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 리디렉션을 위해 추가
import "./prac.css";

function ActiveLogin() {
  const navigate = useNavigate(); // useNavigate 훅 사용하여 리디렉션 기능 추가

  useEffect(() => {
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.minHeight = '100vh';
    document.body.style.overflow = 'auto';
    document.body.style.flexDirection = 'column';
    document.body.style.fontFamily = 'Arial, sans-serif';
    document.body.style.textAlign = 'center';
    document.body.style.background = 'linear-gradient(rgb(241, 241, 241) 90%, rgb(104, 103, 103))';
    document.body.style.backgroundSize = 'contain';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';

    return () => {
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.body.style.margin = '';
      document.body.style.minHeight = '';
      document.body.style.overflow = '';
      document.body.style.flexDirection = '';
      document.body.style.fontFamily = '';
      document.body.style.textAlign = '';
      document.body.style.background = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.display = '';
      document.body.style.justifyContent = '';
      document.body.style.alignItems = '';
    };
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok && data.message == "환영합니다!") {
      //setMessage(data.message);

      // 로그인 성공 시 리디렉션 처리
      navigate("/after-login",{ state: { username: data.username }}); // 원하는 경로로 리디렉션 (라우터에 맞는 경로로 수정)
    } else {
      setMessage(data.message); // 에러 메시지 표시
    }
  };

  return (
    <div className="login">
      <h1>libello</h1>
      <form className="form1"
        action="/login"
        method="POST"
        onSubmit={handleSubmit}
        style={{ alignitems: "center" }}
      >
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">로그인</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default ActiveLogin;
