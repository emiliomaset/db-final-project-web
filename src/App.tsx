import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MemberHome from "./pages/MemberHome.tsx"
import LandingPage from "./pages/LandingPage.tsx"
import AppLayout from "./AppLayout.tsx"
import AdminHome from "./pages/AdminHome.tsx";
import WWW from "./components/WWW.tsx";
import AdminAnalytics from "./pages/AdminAnalytics";


function App() {
    return (
        <>

        <BrowserRouter>
            <AppLayout>
            <Routes>
                <Route path="/" element={<LandingPage />}></Route>
                <Route path="/member/home" element={<MemberHome />} />
                <Route path="/admin/home" element={<AdminHome />} />
                <Route path="/www" element={<WWW />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />

            </Routes>
            </AppLayout>
        </BrowserRouter>


        </>
    ) // end of return
} // end of App

export default App
