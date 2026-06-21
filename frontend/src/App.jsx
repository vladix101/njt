import './App.css'
import Header from './pages/header/Header.jsx'
import Dashboard from "./pages/dashboard/Dashboard.jsx"
import {useEffect, useState} from "react";
import {Routes, Route} from 'react-router-dom'
import NoMatch from "./pages/noMatch/NoMatch.jsx";
import RegisterStart from "./pages/register/RegisterStart.jsx";
import CandidateRegistration from "./pages/register/CandidateRegistration.jsx";
import InstructorRegistration from "./pages/register/InstructorRegistration.jsx";
import Login from "./pages/login/Login.jsx";
import MyCourses from "./pages/myCourses/MyCourses.jsx";
import AddGroup from "./pages/addGroup/AddGroup.jsx";
import AllCandidates from "./pages/allCandidates/AllCandidates.jsx";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null)

  useEffect(() => {
      localStorage.removeItem("loggedInUser")
  }, [])

  const handleLogin = (user) => {
      setLoggedInUser(user)
      localStorage.setItem("loggedInUser", JSON.stringify(user))
  }

  const handleLogout = () => {
      setLoggedInUser(null)
      localStorage.removeItem("loggedInUser")
  }

  return (
      <>
          <Header loggedInUser={loggedInUser} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Dashboard loggedInUser={loggedInUser}/>}/>
                <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
                <Route path="/register" element={<RegisterStart/>}/>
                <Route path="/register/candidate" element={<CandidateRegistration/>}/>
                <Route path="/register/instructor" element={<InstructorRegistration/>}/>
                <Route path="/my-courses" element={<MyCourses loggedInUser={loggedInUser}/>}/>
                <Route path="/add-group" element={<AddGroup loggedInUser={loggedInUser}/>}/>
                <Route path="/groups/:groupId/edit" element={<AddGroup loggedInUser={loggedInUser}/>}/>
                <Route path="/candidates" element={<AllCandidates/>}/>
                <Route path="*" element={<NoMatch/>}/>
            </Routes>
      </>
  )
}

export default App
