import {useState} from "react";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const RegisterStart = () => {
    const [selectedType, setSelectedType] = useState("")
    const navigate = useNavigate()

    const handleNext = () => {
        if (!selectedType) {
            return
        }

        navigate(`/register/${selectedType.toLowerCase()}`, {
            state: {userType: selectedType}
        })
    }

    return (
        <main className="main-content">
            <h1 className="app-title">Register as:</h1>

            <section className="register-type-grid" aria-label="Registration type">
                <button
                    type="button"
                    className={`register-type-card ${selectedType === "CANDIDATE" ? "selected" : ""}`}
                    onClick={() => setSelectedType("CANDIDATE")}
                >
                    <span>Candidate</span>
                </button>

                <button
                    type="button"
                    className={`register-type-card ${selectedType === "INSTRUCTOR" ? "selected" : ""}`}
                    onClick={() => setSelectedType("INSTRUCTOR")}
                >
                    <span>Instructor</span>
                </button>
            </section>

            <Button
                className="register-next-button"
                disabled={!selectedType}
                onClick={handleNext}
            >
                Next
            </Button>
        </main>
    )
}

export default RegisterStart
