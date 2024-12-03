import React, { useEffect,useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AfterLoginCSS.css";

function ActiveAfterLogin() {
  const location = useLocation();
  //const username = location.state?.username || "User";
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  // 상태 정의
  const [title, setTitle] = useState(""); // 제목 입력 상태
  const [content, setContent] = useState(""); // 내용 입력 상태
  const [savedTitles, setSavedTitles] = useState([]); // 저장된 제목 목록
  const [isWriting, setIsWriting] = useState(false); // 글 작성 모드 활성화 여부
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    console.log(username+"팍이냐?")
    const fetchPosts = async () => {
      let token = localStorage.getItem("authToken"); // JWT 토큰
  
      try {
        // 게시물 목록을 가져오기 위한 요청
        let response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/`, {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰 인증
          },
        });
        const refreshToken = localStorage.getItem("refreshToken");

        console.log(refreshToken);
        // 토큰이 만료된 경우(401 Unauthorized)
        if (response.status === 401) {
          const refreshToken = localStorage.getItem("refreshToken"); // 저장된 refresh token
  
          if (refreshToken) {
            // refresh token으로 access token을 재발급 받기
            const refreshResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/token/refresh/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refresh: refreshToken }),
            });
  
            if (refreshResponse.ok) {
              const data = await refreshResponse.json();
              const newAccessToken = data.access_token; // 새로운 access token
              localStorage.setItem("authToken", newAccessToken); // 새로운 access token 저장
  
              // 새로운 access token으로 다시 게시물 목록 요청
              response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/`, {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              });
  
              if (response.ok) {
                const postsData = await response.json();
                console.log(postsData+"포스트데이터");
                setPosts(postsData); // 게시물 목록 설정
              } else {
                console.error("Error fetching posts after token refresh");
              }
            } else {
              console.error("Failed to refresh token");
            }
          } else {
            console.error("No refresh token available");
          }
        } else if (response.ok) {
          const postsData = await response.json();
          setPosts(postsData); // 게시물 목록 설정
          console.log(postsData+"포스트데이터2");

        } else {
          console.error("Error fetching posts:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchPosts();
  }, []);
  
  {/*setPosts(response.data); // 서버에서 받은 글 목록 저장
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);*/}


  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");

  // 로그인 페이지로 리디렉션
  navigate("/login");
  };
  const getCsrfToken = () => {
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
    return csrfToken;
  };
  const handleSave = async () => {
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const timestamp = new Date().toISOString(); // ISO 형식으로 저장
    const data = {
      author: username,
      timestamp,
      title,
      content,
    };

    try {
      // Access Token 가져오기 (예: localStorage에서)
      const token = localStorage.getItem("authToken"); 

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // 인증 토큰 추가
          "X-CSRFToken": getCsrfToken(),
        },
        credentials: "same-origin",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const savedTime = new Date(timestamp).toLocaleString("ko-KR", {
          hour12: false,
        });
        setSavedTitles((prev) => [...prev, `${title} (${savedTime})`]);
        setTitle("");
        setContent("");
        setIsWriting(false);
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
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
            <div className="posts-list">
              {/*{savedTitles.map((title, index) => (
                <div key={index} className="saved-title">
                  {title}
                </div>
              ))}*/}
               {/* 게시물 리스트 */}
               {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id}>
                    <span>{post.title} - {new Date(post.timestamp).toLocaleDateString()}</span>
                  </div>
                ))
              ) : (
                <div>저장된 글이 없습니다.</div>
              )}
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
