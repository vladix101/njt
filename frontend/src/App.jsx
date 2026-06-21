import './App.css'
import Header from './pages/header/Header.jsx'
import Dashboard from "./pages/dashboard/Dashboard.jsx"
import {Routes, Route} from 'react-router-dom'
import NoMatch from "./pages/noMatch/NoMatch.jsx";
import RegisterStart from "./pages/register/RegisterStart.jsx";
import CandidateRegistration from "./pages/register/CandidateRegistration.jsx";
import InstructorRegistration from "./pages/register/InstructorRegistration.jsx";

function App() {

  return (
      <>
          <Header />
            <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/register" element={<RegisterStart/>}/>
                <Route path="/register/candidate" element={<CandidateRegistration/>}/>
                <Route path="/register/instructor" element={<InstructorRegistration/>}/>
                <Route path="*" element={<NoMatch/>}/>
            </Routes>
      </>
  )
}

export default App
