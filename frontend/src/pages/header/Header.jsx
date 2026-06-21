import {Container, Navbar} from "react-bootstrap"
import {Link} from 'react-router-dom'
import './Header.css'
const Header = () =>{
    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="brand-logo">
                    Aplikacija
                </Navbar.Brand>

                <div className="ms-auto nav-links">
                    <Link className="nav-link" to="/register">
                        Register
                    </Link>
                </div>
            </Container>
        </Navbar>
    )
}

export default Header
