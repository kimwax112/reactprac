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
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [usernameCheckMessage, setUsernameCheckMessage] = useState("");
  useEffect(() => {
    document.body.classList.add("active-login-body");
    return () => {
      document.body.classList.remove("active-login-body");
    };
  }, []);
  

  const handleCheckUsername = async () => {
    const response = await fetch(
      `http://localhost:8000/api/check-username/?username=${username}`
    );
    const data = await response.json();
    if (!username.trim()) {
      setMessage("입력 이후 중복확인을 진행하십시오");
        return;
    } else {
      if(data.exists){ 
       
        setIsUsernameValid(false);
        setUsernameCheckMessage("중복 Id입니다!");
      }else{
      setIsUsernameValid(true);
      setUsernameCheckMessage("사용 가능한 Id입니다.");
      }
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
      console.log(JSON.stringify(data) + " 데이터");
      console.log(data.access_token+"엑세스토큰");  // access_token 값 확인
      console.log(data.refresh_token+"리프레시토큰"); // refresh_token 값 확인
      console.log(data.username+"유저네임");      // username 값 확인
      localStorage.setItem("authToken", data.access_token); // 추가: 토큰 저장
      localStorage.setItem("refreshToken", data.refresh_token);
      localStorage.setItem("username", data.username);
      console.log(localStorage.getItem("refreshToken")+"리프레시")
      console.log(localStorage.getItem("authToken")+"토큰") 
      console.log(localStorage.getItem("username")+"유저네임")  // 추가: 사용자 이름 저장
      navigate("/after-login", { state: { username: data.username } });
    } else {
      setMessage(data.message);
    }
  };
  

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() && !password.trim()) {
      setMessage("회원가입 정보를 입력해 주십시오.");
      return;
    }

    if (!username.trim()) {
      setMessage("아이디가 입력되지 않았습니다.");
      return;
    }

    if (!password.trim()) {
      setMessage("비밀번호가 입력되지 않았습니다.");
      return;
    }
    if (!isUsernameValid) {
      setMessage("아이디 중복확인을 해주십시오.");
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
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok && data.message === "회원가입 성공!") {
      setMessage(data.message);
      setIsSignup(false);
    } else {
      setMessage(data.message);
    }
  };
   // 회원가입 화면으로 이동 시 초기화
   const handleGoToSignup = () => {
    setUsername("");
    setPassword("");
    setMessage("");
    setIsSignup(true);
  };

  // 로그인 화면으로 이동 시 초기화
  const handleGoToLogin = () => {
    setUsername("");
    setPassword("");
    setMessage("");
    setConfirmPassword("");
    setIsSignup(false);
    setUsernameCheckMessage("");
  };
  

  return (
    <div className="active-login-container">
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
            {/*<input
              type="text"
              className="input-text"
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />*/}
            {/*<input
              type="email"
              className="input-text"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />*/}
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
              onClick={handleGoToLogin}
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
            <p>{message}</p>
            <button type="submit" className="mpbutton">
              로그인
            </button>
            <button
              type="button"
              className="mpbutton"
              onClick={handleGoToSignup}
              
            >
              회원가입
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ActiveLogin;
