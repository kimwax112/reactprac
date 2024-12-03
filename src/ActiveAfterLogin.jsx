import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AfterLoginCSS.css";

function ActiveAfterLogin() {
  const location = useLocation();
  const username = location.state?.username || "User";
  const navigate = useNavigate();

  // 상태 정의
  const [title, setTitle] = useState(""); // 제목 입력 상태
  const [content, setContent] = useState(""); // 내용 입력 상태
  const [savedTitles, setSavedTitles] = useState([]); // 저장된 제목 목록
  const [isWriting, setIsWriting] = useState(false); // 글 작성 모드 활성화 여부

  const handleLogout = () => {
    navigate("/login");
  };

  const handleSave = async () => {
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const timestamp = new Date().toISOString(); // ISO 형식으로 저장
    const data = {
      id: `T${String(savedTitles.length + 1).padStart(2, "0")}`,
      author: username,
      timestamp,
      title,
      content,
    };

    try {
      // Django 서버에 POST 요청 (URL과 헤더를 Django API에 맞게 수정)
      /*const response = await fetch("/api/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });*/
      const getCsrfToken = () => {
        const csrfToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("csrftoken="))
          ?.split("=")[1];
        return csrfToken;
      };
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/posts/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken(),
          },
          credentials: "same-origin",
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const savedTime = new Date(timestamp).toLocaleString("ko-KR", {
          hour12: false,
        });
        setSavedTitles((prev) => [...prev, `${title} (${savedTime})`]);
        setTitle("");
        setContent("");
        setIsWriting(false);
      } else {
        alert("저장 중 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("서버와 통신 중 문제가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setIsWriting(false);
  };

  return (
    <div>
      <div className="title1">
        <h1>libello</h1>
      </div>

      <div className="lflex">
        <div className="lets">
          <nav>
            <header className="clickable">
              <div>{username}님 환영합니다</div>
              <div className="hide border clickableDark" onClick={handleLogout}>
                로그아웃
              </div>
            </header>
            <section>
              <div
                className="clickable border"
                onClick={() => setIsWriting(true)}
              >
                새 글작성
              </div>
            </section>
            {/* 저장된 제목 표시 */}
            <div>
              {savedTitles.map((title, index) => (
                <div key={index} className="saved-title">
                  {title}
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* 글 작성 영역 */}
        {isWriting ? (
          <div
            className="writing-area"
            style={{ padding: "15px", background: "#eee" }}
          >
            <div>
              <label>제목:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
              />
            </div>
            <div>
              <label>내용:</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
              />
            </div>
            <div>
              <button onClick={handleSave}>저장</button>
              <button onClick={handleCancel}>취소</button>
            </div>
          </div>
        ) : (
          <div
            className="thisist"
            style={{ padding: "15px", background: "#eee" }}
          >
            등록된 글이 없습니다! '새 글작성' 버튼을 눌러 새 글을 등록해주세요.
          </div>
        )}
      </div>
    </div>
  );
}

export default ActiveAfterLogin;
