import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import BrowsePage from "./pages/BrowsePage";
import AdminHome from "./pages/AdminHome";
import MemberHome from "./pages/MemberHome";
import AdminAnalytics from "./pages/AdminAnalytics";
import MemberProfile from "./pages/MemberProfile";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/browse" element={<BrowsePage />} />

        {/* Admin pages */}
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />

        {/* Member pages */}
        <Route path="/member/home" element={<MemberHome />} />
        <Route path="/member/profile" element={<MemberProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
