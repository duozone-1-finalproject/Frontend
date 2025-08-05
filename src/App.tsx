import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import OAuthSuccessPage from './pages/OAuthSuccessPage';
import EditPage from "./pages/EditPage";
import ChatBotPage from "./pages/ChatBotPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/main" element={<MainPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/oauth-success" element={<OAuthSuccessPage />} />
        <Route path="/edit" element={<EditPage />} />
        <Route path="/chatbot" element={<ChatBotPage />} />
      </Routes>
    </Router>
  );
};

export default App;
