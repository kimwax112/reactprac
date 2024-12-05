import React, { useEffect,useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AfterLoginCSS.css";
import Modal from "react-modal";
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import TokenExpiration from "./TokenExpiration";
import { jwtDecode } from "jwt-decode";
import RefreshToken from './RefreshToken';
import SendEmail from "./SendEmail"; 
import ImageResize from 'quill-image-resize';
import Spinner from "./Spinner";

Quill.register('modules/ImageResize', ImageResize);
Modal.setAppElement("#root");

function ActiveAfterLogin() {
  //const username = location.state?.username || "User";
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const quillRef = React.useRef(null);

  // 상태 정의
  const [title, setTitle] = useState(""); // 제목 입력 상태
  const [content, setContent] = useState(""); // 내용 입력 상태
  const [savedTitles, setSavedTitles] = useState([]); // 저장된 제목 목록
  const [isWriting, setIsWriting] = useState(false); // 글 작성 모드 활성화 여부
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // 수정 모드
  const [currentPostId, setCurrentPostId] = useState(null); // 수정 중인 글 ID
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshToken =localStorage.getItem("refreshToken");
  const handleNewAccessToken = (newAccessToken) => {
  setAccessToken(newAccessToken);
  console.log('새로운 액세스 토큰:', newAccessToken);
  localStorage.setItem("authToken", newAccessToken); 
};
  useEffect(() => {
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

  }, []);
  let token = localStorage.getItem("authToken");
  const decoded = jwtDecode(token);
  const exp = decoded.exp;
  
  
  */}


  let token = localStorage.getItem("authToken");
  const decoded = jwtDecode(token);
  const exp = decoded.exp;
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");

  // 로그인 페이지로 리디렉션
  navigate("/login");
  };
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("authToken");
    setLoading(true);
    try {
      // 1. 사용자 게시물 삭제
      const postsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/user/${username}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        // 각 게시물 삭제
        for (let post of postsData) {
          const deleteResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${post.id}/`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!deleteResponse.ok) {
            console.error(`Failed to delete post with ID: ${post.id}`);
          }
        }
      }

      // 2. 사용자 정보 삭제
      const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${username}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (userResponse.ok) {
        alert("탈퇴가 완료되었습니다.");
        // 로그아웃 후 로그인 페이지로 리디렉션
        handleLogout();
      } else {
        console.error("User deletion failed");
        alert("회원탈퇴 중 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("서버와 통신 중 문제가 발생했습니다.");
    } finally {
      setLoading(false); // 로딩 상태를 false로 설정 (탈퇴 완료 후)
    }
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
    const token = localStorage.getItem("authToken"); 

    try {
      // Access Token 가져오기 (예: localStorage에서)

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

      {/*if (response.ok) {
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
      }*/}
      if (response.ok) {
        const newPost = await response.json();
        setPosts((prev) => [...prev, newPost]); // 새 글 추가
        resetForm();
      } else {
        alert("저장 중 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("서버와 통신 중 문제가 발생했습니다.");
    }
  };

  const handleUpdate = async () => {
    if (!title || !content || !currentPostId) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("authToken");
    const timestamp = new Date().toISOString();
    const data = { title, content, timestamp };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${currentPostId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts((prev) =>
          prev.map((post) => (post.id === currentPostId ? updatedPost : post))
        );
        resetForm();
      } else {
        alert("수정 중 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleSelectPost = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setCurrentPostId(post.id);
    setIsEditing(true);
    setIsWriting(true);
    setSelectedPost(post);
  };
  const resetForm = () => {
    setTitle("");
    setContent("");
    setCurrentPostId(null);
    setIsEditing(false);
    setIsWriting(false);
  };


  const handleDelete = async (postId) => {
    const token = localStorage.getItem("authToken");
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${currentPostId}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // 인증 토큰 추가
        },
      });
  
      if (response.status === 204) {
        alert("게시물이 삭제되었습니다.");
        setPosts((prev) => prev.filter((post) => post.id !== postId)); // 삭제된 글을 리스트에서 제거
      } else {
        alert("삭제 중 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("서버와 통신 중 문제가 발생했습니다.");
    }
  };
  const handleContentChange = (value) => {
    setContent(value);
  };
  return (
    <div>
      <div className="title1" >
        <h1>libello</h1>
        <div style={{display: "flex"}}>
        <TokenExpiration exp={exp}/>

          {/*
                  <TokenExpiration exp={exp}/>

          <h3>현재 액세스 토큰: {accessToken}</h3>
          <h3>현재 진짜 토큰: {localStorage.getItem("authToken")}</h3>*/}
          <div style={{marginLeft:'10px'}}>
          <RefreshToken 
          
            refreshToken={refreshToken}
            onNewAccessToken={handleNewAccessToken}
          />
          </div>
        </div>
      </div>

      <div className="lflex">
        <div className="lets">
          <nav>
            <div className="welcome" >
              <div>
            <header>
              <div>{username}님 환영합니다</div>
              <div className="hide border clickableDark" onClick={handleLogout}>
                로그아웃
              </div>
            </header>
            <section>
              <div
                className="clickable border"
                onClick={() => {resetForm(); setIsWriting(true);}}
              >
                새 글작성
              </div>
              
            </section>
            <section>
            
            <div className="clickable" onClick={openModal}>
                회원탈퇴
            </div>
           

            <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            style={{
            overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
            textAlign: "center",
            borderRadius: "8px",
            padding: "20px",
          },
        }}
        >
           <h2>탈퇴하시겠습니까?</h2>
           <div>
          {loading && <Spinner />}
          </div>
           <button onClick={handleDeleteAccount} style={{ marginTop: "20px" }}>
                  확인
                </button>
          <button onClick={closeModal} style={{ marginTop: "20px" }}>
          닫기
          </button>
        
          </Modal>
      
            </section>
            <div style={{marginLeft:'10px',  marginbottom: "10px"}}>
            <div>
            글제목:
            <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
            </div>
            </div>
            </div>
            {/* 저장된 제목 표시 */}
            {/*<div className="posts-list">
           
              
               {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <div className="clickable" key={post.id}  onClick={() => handleSelectPost(post)}   
                  style={{ border:"10px", fontSize: "10px",cursor: "pointer", padding: "10px 0", marginRight:"2px"}}>
                    <span>
                      <div style={{fontSize:"15px"}}>
                      {post.title} 
                      </div>
                      <div style={{textAlign:"right"}}>작성시간 : {new Date(post.timestamp).toLocaleDateString("ko-KR")}
                      {post.updated_at && (
                            <>
                              <br />
                              최종 수정 시간: {new Date(post.updated_at).toLocaleString("ko-KR")}
                            </>
                          )}
                       </div>
                      </span>
                  </div>
                ))
              ) : (
                <div>저장된 글이 없습니다.</div>
              )}
            </div>*/}
            <div className="posts-list" style={{paddingLeft:"5px"}} >
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div
                    className="clickable"
                    key={post.id}
                    onClick={() => handleSelectPost(post)}
                    style={{
                      border: "10px",
                      fontSize: "10px",
                      cursor: "pointer",
                      padding: "10px 0",
                      marginRight: "2px",
                    }}
                  >
                    <span>
                      <div style={{ fontSize: "15px" }}>{post.title}</div>
                      <div style={{ textAlign: "right", paddingRight:"10px" }}>
                        작성시간 : {new Date(post.timestamp).toLocaleDateString("ko-KR")}
                        {post.updated_at && (
                          <>
                            <br />
                            최종 수정 시간:{" "}
                            {new Date(post.updated_at).toLocaleString("ko-KR")}
                          </>
                                      )}
                        </div>
                      </span>
                    </div>
                  ))
                ) : (
                  <div>검색된 글이 없습니다.</div>
                )}
              </div>

            </div>
          </nav>
        </div>

        {/* 글 작성 영역 */}
        {isWriting ? (
          
          <div className="thisist2" style={{background:"#eee"}} >
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div style={{ marginBottom: "3rem" }}>
            <ReactQuill
              ref={quillRef}

              value={content}
              onChange={handleContentChange}
              placeholder="내용을 입력하세요"
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }], // 헤더 스타일
                  ['bold', 'italic', 'underline'], // 글꼴 스타일
                  [{ list: 'ordered' }, { list: 'bullet' }], // 리스트
                  ['link', 'image'], // 링크, 이미지 삽입
                  ['clean'], // 포맷 초기화
                ],
               
                ImageResize: {
                  parchment: Quill.import('parchment')
                  
                },
               
              }}
              formats={[
                'header',
                'bold',
                'italic',
                'underline',
                'list',
                'bullet',
                'link',
                'image',
              ]}
              
              style={{ marginBottom: "1rem", width: "100%", height:"50vh" }}
            />
             {/*<div>
              <h3>입력된 내용</h3>
              <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />*/}
            </div >
            <div style={{ display: "flex", gap: "1rem" }}>
              {isEditing ? (
                <>
                <div>
                <button onClick={handleUpdate}>수정</button>
                <button onClick={() => {resetForm(); handleDelete(currentPostId)}}>삭제</button>
                <button onClick={resetForm}>취소</button>

                </div>
                <SendEmail postId={currentPostId}/>
                
                </>
              ) : (
                <>
                <button onClick={handleSave}>저장</button>
                <button onClick={resetForm}>취소</button>
                </>
              )}
            </div>
          </div>
          
        ) : (
          <div
            className="thisist"
            style={{ padding: "15px", background: "#eee", whiteSpace:"pre-wrap" }}
          >
            <h1>환영합니다!<br></br>왼편에서 글을 불러오거나 새 글을 작성하세요!</h1> 
          </div>

        )}
      </div>
    </div>
  );
}

export default ActiveAfterLogin;
