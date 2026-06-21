import {Container, Navbar} from "react-bootstrap"
import {Link, useNavigate} from 'react-router-dom'
import './Header.css'
const Header = ({loggedInUser, onLogout}) =>{
    const navigate = useNavigate()
    const userType = loggedInUser?.userType

    const handleLogout = () => {
        onLogout()
        navigate("/")
    }

    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="brand-logo">
                    VladLux
                </Navbar.Brand>

                <div className="ms-auto nav-links">
                    {!loggedInUser && (
                        <Link className="nav-link" to="/login">
                            Login
                        </Link>
                    )}

                    {userType === "CANDIDATE" && (
                        <>
                            <Link className="nav-link" to="/my-courses">
                                My Courses
                            </Link>
                            <button className="nav-link nav-button" type="button" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}

                    {userType === "INSTRUCTOR" && (
                        <>
                            <Link className="nav-link" to="/add-group">
                                Add Group
                            </Link>
                            <Link className="nav-link" to="/candidates">
                                View All Candidates
                            </Link>
                            <button className="nav-link nav-button" type="button" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </Container>
        </Navbar>
    )
}

export default Header
