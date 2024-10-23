import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // 사용자명 전달받기 위해 추가
import "./AfterLoginCSS.css";

function ActiveAfterLogin() {
  const location = useLocation();
  const username = location.state?.username || "User"; // 전달된 사용자명 또는 기본 "User"로 설정
  const navigate = useNavigate();

  // 상태 정의
  const [content, setContent] = useState(""); // 입력된 내용
  const [savedTitles, setSavedTitles] = useState([]); // 저장된 글 제목 목록

  const handleLogout = () => {
    // 필요한 경우 사용자 세션이나 상태를 초기화하는 로직 추가
    // 로그인 페이지로 리디렉션
    navigate("/login"); // 로그인 페이지 경로로 수정
  };

  const handleAddTitle = () => {
    // content의 첫 4글자를 저장
    if (content.length > 0) {
      const title = content.slice(0, 4); // 첫 4글자 추출
      setSavedTitles((prevTitles) => [...prevTitles, title]); // 저장된 제목 목록에 추가
      setContent(""); // 입력 필드 초기화
    }
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
              <div className="clickable border" onClick={handleAddTitle}>
                새 글작성
              </div>
              <div className="pluspage clickable border" onClick={handleAddTitle}>
                +
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
        <div
          className="thisist"
          contentEditable="true"
          style={{ padding: "15px", background: "#eee" }}
          onInput={(e) => setContent(e.currentTarget.textContent)} // 입력 내용 업데이트
        >
          {/* 내용 입력 공간 */}
        </div>
      </div>
    </div>
  );
}

export default ActiveAfterLogin;
