import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./prac.css";

function ActiveLogin() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [usernameCheckMessage, setUsernameCheckMessage] = useState("");

  useEffect(() => {
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.minHeight = "100vh";
    document.body.style.overflow = "auto";
    document.body.style.flexDirection = "column";
    document.body.style.fontFamily = "Arial, sans-serif";
    document.body.style.textAlign = "center";
    document.body.style.background =
      "linear-gradient(rgb(241, 241, 241) 90%, rgb(104, 103, 103))";
    document.body.style.backgroundSize = "contain";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";

    return () => {
      document.documentElement.style.height = "";
      document.body.style.height = "";
    };
  }, []);

  const handleCheckUsername = async () => {
    const response = await fetch(
      `http://localhost:8000/api/check-username/?username=${username}`
    );
    const data = await response.json();
    if (data.exists) {
      setIsUsernameValid(false);
      setUsernameCheckMessage("중복 Id입니다!");
    } else {
      setIsUsernameValid(true);
      setUsernameCheckMessage("사용 가능한 Id입니다.");
    }
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok && data.message === "환영합니다!") {
      navigate("/after-login", { state: { username: data.username } });
    } else {
      setMessage(data.message);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (!isUsernameValid) {
      setMessage("중복을 해결하세요");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    const response = await fetch("http://localhost:8000/api/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email, name }),
    });

    const data = await response.json();
    if (response.ok && data.message === "회원가입 성공!") {
      setMessage(data.message);
      setIsSignup(false);
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="login">
      <h1>{isSignup ? "회원가입" : "libello"}</h1>
      {isSignup ? (
        <form className="form1" onSubmit={handleSignupSubmit}>
          <input
            type="text"
            className={`input-text ${!isUsernameValid ? "invalid" : ""}`}
            placeholder="아이디 입력"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="button"
            className="dupcheck"
            onClick={handleCheckUsername}
          >
            중복 확인
          </button>
          <span>{usernameCheckMessage}</span>
          <br />
          <input
            type="text"
            className="input-text"
            placeholder="이름 입력"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <input
            type="email"
            className="input-text"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            className="input-password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <input
            type="password"
            className="input-password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <br />
          {message && <p style={{ color: "red" }}>{message}</p>}
          <button type="submit" className="mpbutton">
            회원가입
          </button>
          <button
            type="button"
            className="mpbutton"
            onClick={() => setIsSignup(false)}
          >
            돌아가기
          </button>
        </form>
      ) : (
        <form className="form1" onSubmit={handleLoginSubmit}>
          <input
            type="text"
            className="input-text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            className="input-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit" className="mpbutton">
            로그인
          </button>
          <button
            type="button"
            className="mpbutton"
            onClick={() => setIsSignup(true)}
          >
            회원가입
          </button>
        </form>
      )}
    </div>
  );
}

export default ActiveLogin;
