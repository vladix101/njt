import {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";

const AddGroup = ({loggedInUser}) => {
    const navigate = useNavigate()
    const {groupId} = useParams()
    const [courses, setCourses] = useState([])
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState({})
    const [formData, setFormData] = useState({
        name: "",
        startDate: "",
        endDate: "",
        courseId: ""
    })

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/courses")
                if (!response.ok) {
                    return
                }
                setCourses(await response.json())
            } catch (error) {
                console.error("Error fetching courses:", error.message)
            }
        }

        void fetchCourses()
    }, [])

    useEffect(() => {
        const fetchGroup = async () => {
            if (!groupId) {
                return
            }

            try {
                const response = await fetch(`http://localhost:8080/api/listening-groups/${groupId}`)
                if (!response.ok) {
                    setError("Listening group could not be fetched")
                    return
                }

                const group = await response.json()
                setFormData({
                    name: group.name ?? "",
                    startDate: group.startDate ? group.startDate.slice(0, 16) : "",
                    endDate: group.endDate ? group.endDate.slice(0, 16) : "",
                    courseId: group.courseId ?? ""
                })
            } catch (error) {
                console.error("Error fetching listening group:", error.message)
                setError("Listening group could not be fetched")
            }
        }

        void fetchGroup()
    }, [groupId])

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
        setError("")
        setFieldErrors({})

        const validationErrors = {}
        if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
            validationErrors.endDate = "End date must not be before start date"
        }

        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors)
            return
        }

        const dataToSend = {
            name: formData.name,
            startDate: formData.startDate === "" ? null : formData.startDate,
            endDate: formData.endDate === "" ? null : formData.endDate,
            courseId: formData.courseId === "" ? null : Number(formData.courseId),
            instructorId: loggedInUser?.userId ?? null
        }

        try {
            const response = await fetch(`http://localhost:8080/api/listening-groups${groupId ? `/${groupId}` : ""}`, {
                method: groupId ? "PUT" : "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(dataToSend)
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                const backendFieldErrors = errorData?.fieldErrors ?? {}
                setFieldErrors(backendFieldErrors)
                setError(Object.keys(backendFieldErrors).length === 0 ? "Listening group could not be saved" : "")
                return
            }

            navigate("/")
        } catch (error) {
            console.error("Error saving listening group:", error.message)
            setError("Listening group could not be saved")
        }
    }

    return (
        <main className="main-content">
            <h1 className="app-title">{groupId ? "Edit Group" : "Add Group"}</h1>
            <Form onSubmit={handleSubmit} className="candidate-form">
                <Form.Group controlId="GroupName">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="GroupStartDate">
                    <Form.Label>Start date:</Form.Label>
                    <Form.Control type="datetime-local" name="startDate" value={formData.startDate} onChange={handleInputChange} />
                    {fieldErrors.startDate && <p className="field-error">{fieldErrors.startDate}</p>}
                </Form.Group>

                <Form.Group controlId="GroupEndDate">
                    <Form.Label>End date:</Form.Label>
                    <Form.Control type="datetime-local" name="endDate" value={formData.endDate} onChange={handleInputChange} />
                    {fieldErrors.endDate && <p className="field-error">{fieldErrors.endDate}</p>}
                </Form.Group>

                <Form.Group controlId="GroupCourse">
                    <Form.Label>Course:</Form.Label>
                    <Form.Select name="courseId" value={formData.courseId} onChange={handleInputChange}>
                        <option value="">Choose course</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {error && <p className="form-error">{error}</p>}

                <div className="form-actions">
                    <Button variant="secondary" type="button" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                </div>
            </Form>
        </main>
    )
}

export default AddGroup
