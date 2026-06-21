import {useEffect, useState} from "react";

const MyCourses = ({loggedInUser}) => {
    const [listeningGroups, setListeningGroups] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchMyCourses = async () => {
            if (!loggedInUser?.userId) {
                setError("You need to be logged in as a candidate")
                return
            }

            try {
                const response = await fetch(`http://localhost:8080/api/candidates/${loggedInUser.userId}/listening-groups`)
                if (!response.ok) {
                    setError("Courses could not be fetched")
                    return
                }
                setListeningGroups(await response.json())
            } catch (error) {
                console.error("Error fetching candidate courses:", error.message)
                setError("Courses could not be fetched")
            }
        }

        void fetchMyCourses()
    }, [loggedInUser?.userId])

    const formatDate = (date) => {
        if (!date) {
            return "No start date"
        }
        return new Date(date).toLocaleString()
    }

    return (
        <main className="main-content">
            <h1 className="app-title">My Courses</h1>
            {error && <p className="form-error">{error}</p>}

            <section className="course-grid" aria-label="My courses">
                {listeningGroups.map((group) => (
                    <article className="course-card" key={group.id}>
                        <div>
                            <h2>{group.name}</h2>
                            <p className="course-date">Start: {formatDate(group.startDate)}</p>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    )
}

export default MyCourses
