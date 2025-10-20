import './App.css'
import {BrowserRouter, Link, Routes, Route} from "react-router-dom";
import Home from "./pages/Home.tsx"
import LandingPage from "./pages/LandingPage.tsx"
import AppLayout from "./AppLayout.tsx"

function App() {
    return (
        <>

        <BrowserRouter>
            <AppLayout>
            <Routes>
                <Route path="/" element={<LandingPage />}></Route>
                <Route path="/Home" element={<Home />} />
            </Routes>
            </AppLayout>
        </BrowserRouter>


        </>
    ) // end of return
} // end of App

export default App
