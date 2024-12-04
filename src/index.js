import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Write from './ReactQuillP';
import reportWebVitals from './reportWebVitals';
import SendEmail from './SendEmail';
import Comment from './savedText';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
  
  {/*<h1>테스트페이지1</h1>
  <Write/>
  <link
  rel="stylesheet"
  href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"/>*/}
  
 <React.StrictMode>
    <App />
 

  </React.StrictMode>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
