import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const Dashboard = ({loggedInUser}) => {
    const navigate = useNavigate()
    const [listeningGroups, setListeningGroups] = useState([])
    const [joinedGroupIds, setJoinedGroupIds] = useState([])
    const [error, setError] = useState("")
    const userType = loggedInUser?.userType

    useEffect(() => {
        const fetchListeningGroups = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/listening-groups")
                if (!response.ok) {
                    setError("Listening groups could not be fetched")
                    return
                }
                setListeningGroups(await response.json())
            } catch (error) {
                console.error("Error fetching listening groups:", error.message)
                setError("Listening groups could not be fetched")
            }
        }

        void fetchListeningGroups()
    }, [])

    useEffect(() => {
        const fetchJoinedGroups = async () => {
            if (userType !== "CANDIDATE" || !loggedInUser?.userId) {
                setJoinedGroupIds([])
                return
            }

            try {
                const response = await fetch(`http://localhost:8080/api/candidates/${loggedInUser.userId}/listening-groups`)
                if (!response.ok) {
                    setError("Joined groups could not be fetched")
                    return
                }

                const joinedGroups = await response.json()
                setJoinedGroupIds(joinedGroups.map((group) => group.id))
            } catch (error) {
                console.error("Error fetching joined groups:", error.message)
                setError("Joined groups could not be fetched")
            }
        }

        void fetchJoinedGroups()
    }, [loggedInUser?.userId, userType])

    const formatDate = (date) => {
        if (!date) {
            return "No start date"
        }
        return new Date(date).toLocaleString()
    }

    const handleJoin = (group) => {
        navigate(`/groups/${group.id}/join`)
    }

    const handleView = (group) => {
        navigate(`/groups/${group.id}`)
    }

    const handleEdit = (group) => {
        navigate(`/groups/${group.id}/edit`)
    }

    const handleDelete = async (group) => {
        try {
            const response = await fetch(`http://localhost:8080/api/listening-groups/${group.id}`, {
                method: "DELETE"
            })

            if (!response.ok) {
                setError("Listening group could not be deleted")
                return
            }

            setListeningGroups(listeningGroups.filter((listeningGroup) => listeningGroup.id !== group.id))
        } catch (error) {
            console.error("Error deleting listening group:", error.message)
            setError("Listening group could not be deleted")
        }
    }

    const confirmationUrl = (groupId) => (
        `http://localhost:8080/api/candidates/${loggedInUser.userId}/listening-groups/${groupId}/confirmation`
    )

    return(
        <>
            <main className="main-content">
                <h1 className="app-title">Groups</h1>

                {error && <p className="form-error">{error}</p>}

                <section className="course-grid" aria-label="Available courses">
                    {listeningGroups.map((group) => (
                        <article className="course-card" key={group.id}>
                            <div>
                                <div className="course-card-header">
                                    <h2>{group.name}</h2>
                                    <button className="course-info-button" type="button" aria-label="Course description">
                                        i
                                        <span className="course-info-tooltip" role="tooltip">
                                            {group.courseDescription || "No course description available."}
                                        </span>
                                    </button>
                                </div>
                                <div className="course-meta">
                                    <p><span>Start</span>{formatDate(group.startDate)}</p>
                                    <p><span>Course</span>{group.courseName || "No course"}</p>
                                    <p><span>Level</span>{group.courseLevel || "No level"}</p>
                                    <p><span>Subject</span>{group.subjectName || "No subject"}</p>
                                </div>
                            </div>

                            {userType === "CANDIDATE" && (
                                <div className="course-actions">
                                    {joinedGroupIds.includes(group.id) ? (
                                        <>
                                            <span className="purchased-label">Purchased</span>
                                            <a className="confirmation-link" href={confirmationUrl(group.id)} download>
                                                View Confirmation
                                            </a>
                                        </>
                                    ) : (
                                        <button className="course-register-button" type="button" onClick={() => handleJoin(group)}>
                                            JOIN
                                        </button>
                                    )}
                                </div>
                            )}

                            {userType === "INSTRUCTOR" && (
                                <div className="course-actions">
                                    <button className="course-secondary-button" type="button" onClick={() => handleView(group)}>
                                        VIEW
                                    </button>
                                    <button className="course-secondary-button" type="button" onClick={() => handleEdit(group)}>
                                        EDIT
                                    </button>
                                    <button className="course-danger-button" type="button" onClick={() => handleDelete(group)}>
                                        DELETE
                                    </button>
                                </div>
                            )}
                        </article>
                    ))}
                </section>
            </main>
        </>
    )
}

export default Dashboard
