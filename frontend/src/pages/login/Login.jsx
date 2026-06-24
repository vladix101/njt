import {useState} from "react";
import {Button, Form} from "react-bootstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";

const Login = ({onLogin}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const successMessage = location.state?.successMessage
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })
    const [error, setError] = useState("")

    const handleInputChange = (event) => {
        const {name, value} = event.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError("")

        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                setError("Invalid username or password")
                return
            }

            const loggedInUser = await response.json()
            onLogin(loggedInUser)
            navigate("/")
        } catch (error) {
            console.error("Error logging in:", error.message)
            setError("Login failed")
        }
    }

    return (
        <main className="main-content">
            <h1 className="app-title">Login</h1>
            <Form onSubmit={handleSubmit} className="candidate-form">
                <Form.Group controlId="LoginUsername">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="LoginPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                {error && <p className="form-error">{error}</p>}

                <Button variant="primary" type="submit" className="candidate-button">Login</Button>

                <p className="register-link-text">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </Form>
            {successMessage && <p className="registration-success-message">{successMessage}</p>}
        </main>
    )
}

export default Login
