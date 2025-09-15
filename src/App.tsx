import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import OAuthSuccessPage from './pages/OAuthSuccessPage';
import MyPage from "./pages/MyPage";
import DartViewer from "./pages/DartViewer";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/main" element={<MainPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth-success" element={<OAuthSuccessPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/dartviewer" element={<DartViewer />} />
      </Routes>
    </Router>
  );
};

export default App;