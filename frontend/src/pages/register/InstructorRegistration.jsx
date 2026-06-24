import {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";
import EmailVerificationModal from "./EmailVerificationModal.jsx";

const InstructorRegistration = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const userType = location.state?.userType ?? "INSTRUCTOR"

    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        username: "",
        password: "",
        yearsOfExperience: "",
        subjectId: ""
    })
    const [subjects, setSubjects] = useState([])
    const [fieldErrors, setFieldErrors] = useState({})
    const [pendingRegistrationData, setPendingRegistrationData] = useState(null)
    const [isVerificationOpen, setIsVerificationOpen] = useState(false)
    const [verificationError, setVerificationError] = useState("")
    const [verificationSuccess, setVerificationSuccess] = useState("")
    const [isVerificationLoading, setIsVerificationLoading] = useState(false)
    const [isRegistrationLoading, setIsRegistrationLoading] = useState(false)

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
        if (isRegistrationLoading) {
            return
        }

        setFieldErrors({})

        const validationErrors = {}
        if (formData.password.length <= 6) {
            validationErrors.password = "Password must have more than 6 characters"
        }
        if (!formData.email.trim()) {
            validationErrors.email = "Email is required"
        }

        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors)
            return
        }

        const dataToSend = {
            ...formData,
            yearsOfExperience: formData.yearsOfExperience === "" ? null : Number(formData.yearsOfExperience),
            subjectId: formData.subjectId === "" ? null : Number(formData.subjectId)
        }

        setIsRegistrationLoading(true)

        try {
            const response = await fetch("http://localhost:8080/api/register/instructor", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(dataToSend)
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                setFieldErrors(errorData?.fieldErrors ?? {form: "Instructor registration failed"})
                return
            }

            setPendingRegistrationData(dataToSend)
            setVerificationError("")
            setVerificationSuccess("")
            setIsVerificationOpen(true)
        } catch (error) {
            console.error("Error registering instructor:", error.message)
        } finally {
            setIsRegistrationLoading(false)
        }
    }

    const handleConfirmVerification = async (code) => {
        if (!pendingRegistrationData) {
            setVerificationError("Registration data is missing")
            return
        }

        setIsVerificationLoading(true)
        setVerificationError("")
        setVerificationSuccess("")

        try {
            const response = await fetch("http://localhost:8080/api/register/instructor/verify", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    instructor: pendingRegistrationData,
                    email: pendingRegistrationData.email,
                    code
                })
            })

            if (!response.ok) {
                setVerificationError(await getErrorMessage(response, "Email verification failed"))
                return
            }

            setVerificationSuccess("Email verified successfully")
            navigate("/login", {state: {successMessage: "Registered successfully"}})
        } catch (error) {
            setVerificationError("Email verification failed")
            console.error("Error verifying instructor email:", error.message)
        } finally {
            setIsVerificationLoading(false)
        }
    }

    const handleResendVerificationCode = async () => {
        setIsVerificationLoading(true)
        setVerificationError("")
        setVerificationSuccess("")

        try {
            const response = await fetch("http://localhost:8080/api/auth/resend-verification-code", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: pendingRegistrationData?.email ?? formData.email})
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                const errors = errorData?.fieldErrors ?? {}
                setVerificationError(errors.email ?? errors.form ?? "Verification code could not be resent")
                return false
            }

            setVerificationSuccess("New verification code was sent")
            return true
        } catch (error) {
            setVerificationError("Verification code could not be resent")
            console.error("Error resending verification code:", error.message)
            return false
        } finally {
            setIsVerificationLoading(false)
        }
    }

    const getErrorMessage = async (response, fallbackMessage) => {
        const errorData = await response.clone().json().catch(() => null)
        const errors = errorData?.fieldErrors ?? {}
        const firstError = Object.values(errors)[0]

        if (errors.code || errors.email || errors.form || firstError || errorData?.message) {
            return errors.code ?? errors.email ?? errors.form ?? firstError ?? errorData.message
        }

        const text = await response.text().catch(() => "")
        return text || fallbackMessage
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

                <Form.Group controlId="InstructorEmail">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} />
                    {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
                </Form.Group>

                <Form.Group controlId="InstructorUsername">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control type="text" name="username" value={formData.username} onChange={handleInputChange} />
                    {fieldErrors.username && <p className="field-error">{fieldErrors.username}</p>}
                </Form.Group>

                <Form.Group controlId="InstructorPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" name="password" value={formData.password} onChange={handleInputChange} />
                    {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
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

                {fieldErrors.form && <p className="form-error">{fieldErrors.form}</p>}

                <Button variant="primary" type="submit" className="candidate-button" disabled={isRegistrationLoading}>
                    Register
                </Button>
            </Form>
            {isVerificationOpen && (
                <EmailVerificationModal
                    email={pendingRegistrationData?.email ?? formData.email}
                    isLoading={isVerificationLoading}
                    error={verificationError}
                    successMessage={verificationSuccess}
                    onConfirm={handleConfirmVerification}
                    onResend={handleResendVerificationCode}
                    onCancel={() => setIsVerificationOpen(false)}
                />
            )}
        </main>
    )
}

export default InstructorRegistration
