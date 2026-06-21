import './App.css'
import Header from './pages/header/Header.jsx'
import Dashboard from "./pages/dashboard/Dashboard.jsx"
import {Routes, Route} from 'react-router-dom'
import NoMatch from "./pages/noMatch/NoMatch.jsx";
import PostCandidate from "./pages/postCandidate/PostCandidate.jsx";
import ShowCandidates from "./pages/ShowCandidates/ShowCandidates.jsx";

function App() {

  return (
      <>
          <Header />
            <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/candidate" element={<PostCandidate/>}/>
                <Route path="/candidates" element={<ShowCandidates/>}/>
                <Route path="*" element={<NoMatch/>}/>
            </Routes>
      </>
  )
}

export default App
