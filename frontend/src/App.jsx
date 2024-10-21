import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/home"
import Login from "./pages/login"
import Register from "./pages/register"
import Doctors from "./pages/Doctors"
import Home1 from "./pages/home1"
import Accountdelete from "./pages/accountdelete"
import Account from "./pages/account"
import Profile_page from "./pages/Profile"
import AccountUpdate from "./pages/update"
import Upload_img from "./pages/imgup"
import Profile_picture from "./pages/profilepicture"
import ABCWithParams from "./pages/staff"
import Report_Genaration from "./pages/patientSearch"
import P_account from "./pages/patientreg"
import Protected from "./components/protected"
import Graphs from "./pages/graphs"
import Footer from "./components/Footer"
import "./styls/App.css"


function Logout(){
  localStorage.clear();
  return <Navigate to="/" />
}

 
function App() {
  
  return (
    <div className="app-container">
      <div className="app-content">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Doctors />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/home" element={<Protected><Home1 /></Protected>} />
            <Route path="/new-account" element={<Protected><Account /></Protected>} />
            <Route path="/account-delete" element={<Protected><Accountdelete /></Protected>} />
            <Route path="/profile" element={<Protected><Profile_page /></Protected>} />
            <Route path="/profile/update" element={<Protected><AccountUpdate /></Protected>} />
            <Route path="/profile/pic" element={<Protected><Profile_picture /></Protected>} />
            <Route path="/component/:name" element={<Protected><ABCWithParams /></Protected>} />
            <Route path="/patient/register" element={<Protected><P_account /></Protected>} />
            <Route path="/upload-images/" element={<Protected><Upload_img /></Protected>} />
            <Route path="/patient-search/" element={<Protected><Report_Genaration /></Protected>} />
            <Route path="/graph/" element={<Protected><Graphs /></Protected>} />
          </Routes>
        </BrowserRouter>
      </div>
      <Footer />
    </div>
  );
}

export default App;
