import './App.css'
import Header from './pages/header/Header.jsx'
import Dashboard from "./pages/dashboard/Dashboard.jsx"
import {Routes, Route} from 'react-router-dom'
import NoMatch from "./pages/noMatch/NoMatch.jsx";
import PostStudent from "./pages/postStudent/PostStudent.jsx";
import ShowStudents from "./pages/ShowStudents/ShowStudents.jsx";

function App() {

  return (
      <>
          <Header />
            <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/student" element={<PostStudent/>}/>
                <Route path="/students" element={<ShowStudents/>}/>
                <Route path="*" element={<NoMatch/>}/>
            </Routes>
      </>
  )
}

export default App
