import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login.tsx";
import MemberHome from "./pages/MemberHome.tsx"
import LandingPage from "./pages/LandingPage.tsx"
import AppLayout from "./AppLayout.tsx"
import AdminHome from "./pages/AdminHome.tsx";
import WWW from "./components/WWW.tsx";
import AdminAnalytics from "./components/AdminAnalytics.tsx";
import BrowsePage from './pages/BrowsePage.tsx';
import ContentWindow from "./components/ContentWindow.tsx";


function App() {
    return (
        <>

        <BrowserRouter>
            <AppLayout>
            <Routes>
                <Route path="/" element={<LandingPage />}></Route>
                <Route path="/login" element={<Login />} />
                <Route path="/member/home" element={<MemberHome />} />
                <Route path="/admin/home" element={<AdminHome />} />
                <Route path="/www" element={<WWW />} />
                <Route path="/analytics" element={<AdminAnalytics/>} />
                <Route path="/browse" element={<BrowsePage/>} />
                <Route path="/content/:contentId" element={<ContentWindow />} />
            </Routes>
            </AppLayout>
        </BrowserRouter>


        </>
    ) // end of return
} // end of App

export default App
