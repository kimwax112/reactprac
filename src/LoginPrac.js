import React from 'react';
import "./prac.css";

class LoginPrac extends React.Component{
    render(){
  
    return(
        <div className="login">
            <h1>libello</h1>
                <form action="/login" method="POST" style={{alignitems:"center"}}>
                <input type="text" name="username" placeholder="Username" required/><br/>
                <input type="password" name="password" placeholder="Password" required/><br/>
                <input type="submit" value="로그인"/>
                </form>
        </div>
    );
}
}

export default LoginPrac;
