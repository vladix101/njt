import {Container, Navbar} from "react-bootstrap"
import {useState} from "react"
import {Link, useNavigate} from 'react-router-dom'
import './Header.css'
const Header = ({loggedInUser, onLogout}) =>{
    const navigate = useNavigate()
    const userType = loggedInUser?.userType
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    const handleLogout = () => {
        onLogout()
        setShowLogoutConfirm(false)
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
                            <button className="nav-link nav-button" type="button" onClick={() => setShowLogoutConfirm(true)}>
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
                            <button className="nav-link nav-button" type="button" onClick={() => setShowLogoutConfirm(true)}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </Container>

            {showLogoutConfirm && (
                <div className="logout-modal-backdrop">
                    <section className="logout-modal" aria-label="Logout confirmation">
                        <h2>Are you sure you want to logout?</h2>
                        <div className="logout-modal-actions">
                            <button type="button" onClick={handleLogout}>Yes</button>
                            <button type="button" onClick={() => setShowLogoutConfirm(false)}>No</button>
                        </div>
                    </section>
                </div>
            )}
        </Navbar>
    )
}

export default Header
