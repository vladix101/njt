import {Container, Nav, Navbar} from "react-bootstrap"
import {Link} from 'react-router-dom'
import './Header.css'
const Header = () =>{
    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="brand-logo">
                    Aplikacija
                </Navbar.Brand>

                <Nav className="ms-auto nav-links">
                    <Nav.Link as={Link} to="/candidates">
                        Candidates
                    </Nav.Link>

                    <Nav.Link as={Link} to="/candidate">
                        Post Candidate
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default Header
