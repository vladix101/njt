import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const GroupDetails = () => {
    const {groupId} = useParams()
    const [details, setDetails] = useState(null)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/listening-groups/${groupId}/details`)
                if (!response.ok) {
                    setError("Listening group details could not be fetched")
                    return
                }
                setDetails(await response.json())
            } catch (error) {
                console.error("Error fetching listening group details:", error.message)
                setError("Listening group details could not be fetched")
            }
        }

        void fetchDetails()
    }, [groupId])

    const formatDate = (date) => {
        if (!date) {
            return "No date"
        }
        return new Date(date).toLocaleString()
    }

    const group = details?.listeningGroup

    return (
        <main className="main-content">
            <h1 className="app-title">Group Details</h1>
            {error && <p className="form-error">{error}</p>}

            {group && (
                <section className="details-panel">
                    <h2>{group.name}</h2>
                    <p>Course: {group.courseName || "No course"}</p>
                    <p>Instructor: {group.instructorName || "No instructor"}</p>
                    <p>Start: {formatDate(group.startDate)}</p>
                    <p>End: {formatDate(group.endDate)}</p>

                    <div className="candidate-groups">
                        <h3>Joined Candidates</h3>
                        {(details.candidates ?? []).length === 0 && <p>No joined candidates</p>}
                        {(details.candidates ?? []).map((candidate) => (
                            <article className="joined-candidate-row" key={candidate.id}>
                                <span>{candidate.name} {candidate.surname}</span>
                                <span>{candidate.username || "No username"}</span>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </main>
    )
}

export default GroupDetails
