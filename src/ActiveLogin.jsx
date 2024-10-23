import React, { useState } from "react";
import "./prac.css";

function ActiveLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  ///// 위는 로그인 폼 저장함수  useStete 구문으로 username, password, message 변수지정

  const handleSubmit = async (e) => {
    e.preventDefault(); //preventDefault 는 페이지 이동을 기본으로하는 이벤트에서 이동을막아줌

    const response = await fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    ///await 이 작업 앞에 붙게된다면 해당 작업이 완료될 때까지 다음코드의 실행을 중단하고 결과반환

    const data = await response.json();
    if (response.ok) {
      setMessage(data.message); // 환영 메시지 표시
    } else {
      setMessage(data.message); // 에러 메시지 표시
    }
  };
  return (
    <div className="login">
      <h1>libello</h1>
      <form
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
          onChange={function (e) {
            setUsername(e.target.value);
          }}
          //onChange 는 값이 입력되거나 지워질 때마다 이벤트가 발생함
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={function (e) {
            setPassword(e.target.value);
          }}
        />
        <br />
        <button type="submit">로그인</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default ActiveLogin;
