import { useState, useEffect } from 'react';

function TokenExpiration({ exp }) {
  const calculateTimeLeft = (exp) => {
    const now = Math.floor(Date.now() / 1000); // 현재 시간 초 단위
    return exp && exp - now > 0 ? exp - now : 0; // 남은 시간 계산
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(exp));

  useEffect(() => {
    if (!exp) return; // exp가 없는 경우 조기 종료
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(exp));
    }, 1000);
    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [exp]);

  return (
    <div>
      {timeLeft > 0
        ? `로그인 만료까지 남은 시간: ${Math.floor(timeLeft / 60)}분 ${timeLeft % 60}초`
        : '로그인이 만료되었습니다. 다시 로그인하거나 토큰을 연장하세요.'}
    </div>
  );
}


export default TokenExpiration;
