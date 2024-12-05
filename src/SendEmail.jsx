import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';

function SendEmail({ postId }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!postId) {
      alert("글 번호가 선택되지 않았습니다.");
      return;
    }

    if (!email) {
      alert("이메일 주소를 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/send-email/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          email,
        }),
      });

      if (response.ok) {
        alert("이메일이 성공적으로 전송되었습니다.");
        setEmail(""); // 이메일 입력란 초기화
      } else {
        alert("이메일 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("서버와 통신 중 문제가 발생했습니다.");
    }finally {
      setLoading(false); // 이메일 전송 완료 후 로딩 상태 false로 설정
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="받는 사람의 이메일을 입력하세요"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSend} disabled={loading}> 
        {loading ? "전송 중..." : "이메일 전송"}
        </button>
      {loading && <Spinner />}
      
    </div>
  );
}

export default SendEmail;
