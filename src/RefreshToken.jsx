import axios from 'axios';

function RefreshToken({ refreshToken, onNewAccessToken }) {
  const handleRefresh = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/refresh/',
        {
            refresh:refreshToken,
        }, 
        {
        headers: {
          'Content-Type': 'application/json', // 요청 헤더에 JSON 타입 명시
        },
    });
      
      onNewAccessToken(response.data.access);
      alert('토큰이 갱신되었습니다.');
    } catch (error) {
        console.log('Refresh Token:', refreshToken);
      console.error('토큰 갱신 실패:', error);
      alert('토큰 갱신에 실패했습니다. 다시 로그인하세요.');
    }
  };

  return <button onClick={handleRefresh}>토큰 갱신</button>;
}
export default  RefreshToken;