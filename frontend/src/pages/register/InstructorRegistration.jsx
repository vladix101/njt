import {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";

const InstructorRegistration = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const userType = location.state?.userType ?? "INSTRUCTOR"

    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        username: "",
        password: "",
        yearsOfExperience: "",
        subjectId: ""
    })
    const [subjects, setSubjects] = useState([])

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/subjects")
                if (!response.ok) {
                    console.error("Subjects could not be fetched")
                    return
                }
                setSubjects(await response.json())
            } catch (error) {
                console.error("Error fetching subjects:", error)
            }
        }

        void fetchSubjects()
    }, [])

    const handleInputChange = (event) => {
        const {name, value} = event.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const dataToSend = {
            ...formData,
            yearsOfExperience: formData.yearsOfExperience === "" ? null : Number(formData.yearsOfExperience),
            subjectId: formData.subjectId === "" ? null : Number(formData.subjectId)
        }

        try {
            const response = await fetch("http://localhost:8080/api/register/instructor", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(dataToSend)
            })

            if (!response.ok) {
                console.error("Instructor registration failed")
                return
            }

            navigate("/")
        } catch (error) {
            console.error("Error registering instructor:", error.message)
        }
    }

    return (
        <main className="main-content">
            <h1 className="app-title">Instructor registration</h1>
            <Form onSubmit={handleSubmit} className="candidate-form">
                <input type="hidden" value={userType} readOnly />

                <Form.Group controlId="InstructorName">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="InstructorSurname">
                    <Form.Label>Surname:</Form.Label>
                    <Form.Control type="text" name="surname" value={formData.surname} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="InstructorUsername">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control type="text" name="username" value={formData.username} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="InstructorPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" name="password" value={formData.password} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="InstructorExperience">
                    <Form.Label>Years of experience:</Form.Label>
                    <Form.Control
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="InstructorSubject">
                    <Form.Label>Subject:</Form.Label>
                    <Form.Select name="subjectId" value={formData.subjectId} onChange={handleInputChange}>
                        <option value="">Choose subject</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>{subject.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" className="candidate-button">Register</Button>
            </Form>
        </main>
    )
}

export default InstructorRegistration
