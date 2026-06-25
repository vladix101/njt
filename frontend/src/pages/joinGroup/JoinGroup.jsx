import {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {apiUrl} from "../../api/apiConfig.js";

const JoinGroup = ({loggedInUser}) => {
    const navigate = useNavigate()
    const {groupId} = useParams()
    const [group, setGroup] = useState(null)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        cardNumber: "",
        expirationDate: "",
        cvc: ""
    })

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const response = await fetch(apiUrl(`/api/listening-groups/${groupId}`))
                if (!response.ok) {
                    setError("Listening group could not be fetched")
                    return
                }
                setGroup(await response.json())
            } catch (error) {
                console.error("Error fetching listening group:", error.message)
                setError("Listening group could not be fetched")
            }
        }

        void fetchGroup()
    }, [groupId])

    const handleInputChange = (event) => {
        const {name, value} = event.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const validateForm = () => {
        if (!/^\d{16}$/.test(formData.cardNumber)) {
            return "Card number must contain exactly 16 digits"
        }

        if (!/^\d{2}\/\d{2}$/.test(formData.expirationDate)) {
            return "Expiration date must use MM/YY format"
        }

        const month = Number(formData.expirationDate.slice(0, 2))
        if (month < 1 || month > 12) {
            return "Expiration month must be between 01 and 12"
        }

        if (!/^\d{3}$/.test(formData.cvc)) {
            return "CVC must contain exactly 3 digits"
        }

        return ""
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError("")

        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            return
        }

        try {
            const response = await fetch(
                apiUrl(`/api/candidates/${loggedInUser.userId}/listening-groups/${groupId}/join`),
                {method: "POST"}
            )

            if (!response.ok) {
                setError("Listening group could not be joined")
                return
            }

            navigate("/")
        } catch (error) {
            console.error("Error joining listening group:", error.message)
            setError("Listening group could not be joined")
        }
    }

    return (
        <main className="main-content">
            <h1 className="app-title">Join Group</h1>
            {group && (
                <section className="purchase-summary" aria-label="Purchase summary">
                    <h2>{group.name}</h2>
                    <p><span>Course</span>{group.courseName || "No course"}</p>
                    <p><span>Subject</span>{group.subjectName || "No subject"}</p>
                </section>
            )}

            <Form onSubmit={handleSubmit} className="candidate-form">
                <Form.Group controlId="JoinCandidateName">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control type="text" value={loggedInUser?.name ?? ""} readOnly />
                </Form.Group>

                <Form.Group controlId="JoinCandidateSurname">
                    <Form.Label>Surname:</Form.Label>
                    <Form.Control type="text" value={loggedInUser?.surname ?? ""} readOnly />
                </Form.Group>

                <Form.Group controlId="JoinCardNumber">
                    <Form.Label>Card number:</Form.Label>
                    <Form.Control
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        maxLength="16"
                    />
                </Form.Group>

                <Form.Group controlId="JoinExpirationDate">
                    <Form.Label>Expiration date:</Form.Label>
                    <Form.Control
                        type="text"
                        name="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength="5"
                    />
                </Form.Group>

                <Form.Group controlId="JoinCvc">
                    <Form.Label>CVC:</Form.Label>
                    <Form.Control
                        type="text"
                        name="cvc"
                        value={formData.cvc}
                        onChange={handleInputChange}
                        maxLength="3"
                    />
                </Form.Group>

                {error && <p className="form-error">{error}</p>}

                <div className="form-actions">
                    <Button variant="secondary" type="button" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                    <Button variant="primary" type="submit">
                        Join
                    </Button>
                </div>
            </Form>
        </main>
    )
}

export default JoinGroup
