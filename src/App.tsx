import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MemberHome from "./pages/MemberHome.tsx"
import LandingPage from "./pages/LandingPage.tsx"
import AppLayout from "./AppLayout.tsx"
import AdminHome from "./pages/AdminHome.tsx";
<<<<<<< HEAD
import AdminAnalytics from "./pages/AdminAnalytics.tsx";
=======
import WWW from "./components/WWW.tsx";
import AdminAnalytics from "./components/AdminAnalytics.tsx";
import BrowsePage from './pages/BrowsePage.tsx';


>>>>>>> 271911456cc23052c2736941c2656769f18b745d
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
                <Route path="/analytics" element={<AdminAnalytics/>} />
                <Route path="/browse" element={<BrowsePage/>} />
            </Routes>
            </AppLayout>
        </BrowserRouter>


        </>
    ) // end of return
} // end of App

export default App
