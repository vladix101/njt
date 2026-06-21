import {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";

const CandidateRegistration = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const userType = location.state?.userType ?? "CANDIDATE"

    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        username: "",
        password: "",
        age: "",
        cityId: ""
    })
    const [cities, setCities] = useState([])
    const [fieldErrors, setFieldErrors] = useState({})

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/cities")
                if (!response.ok) {
                    console.error("Cities could not be fetched")
                    return
                }
                setCities(await response.json())
            } catch (error) {
                console.error("Error fetching cities:", error)
            }
        }

        void fetchCities()
    }, [])

    const handleInputChange = (event) => {
        const {name, value} = event.target
        setFieldErrors({
            ...fieldErrors,
            [name]: ""
        })
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setFieldErrors({})

        const validationErrors = {}
        if (formData.password.length <= 6) {
            validationErrors.password = "Password must have more than 6 characters"
        }

        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors)
            return
        }

        const dataToSend = {
            ...formData,
            age: formData.age === "" ? null : Number(formData.age),
            cityId: formData.cityId === "" ? null : Number(formData.cityId)
        }

        try {
            const response = await fetch("http://localhost:8080/api/register/candidate", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(dataToSend)
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                setFieldErrors(errorData?.fieldErrors ?? {form: "Candidate registration failed"})
                return
            }

            navigate("/")
        } catch (error) {
            console.error("Error registering candidate:", error.message)
        }
    }

    return (
        <main className="main-content">
            <h1 className="app-title">Candidate registration</h1>
            <Form onSubmit={handleSubmit} className="candidate-form">
                <input type="hidden" value={userType} readOnly />

                <Form.Group controlId="CandidateName">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="CandidateSurname">
                    <Form.Label>Surname:</Form.Label>
                    <Form.Control type="text" name="surname" value={formData.surname} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="CandidateUsername">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control type="text" name="username" value={formData.username} onChange={handleInputChange} />
                    {fieldErrors.username && <p className="field-error">{fieldErrors.username}</p>}
                </Form.Group>

                <Form.Group controlId="CandidatePassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" name="password" value={formData.password} onChange={handleInputChange} />
                    {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
                </Form.Group>

                <Form.Group controlId="CandidateAge">
                    <Form.Label>Age:</Form.Label>
                    <Form.Control type="number" name="age" value={formData.age} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="CandidateCity">
                    <Form.Label>City:</Form.Label>
                    <Form.Select name="cityId" value={formData.cityId} onChange={handleInputChange}>
                        <option value="">Choose city</option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {fieldErrors.form && <p className="form-error">{fieldErrors.form}</p>}

                <Button variant="primary" type="submit" className="candidate-button">Register</Button>
            </Form>
        </main>
    )
}

export default CandidateRegistration
