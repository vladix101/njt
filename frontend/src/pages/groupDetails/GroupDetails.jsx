import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import {apiUrl} from "../../api/apiConfig.js";

const GroupDetails = () => {
    const navigate = useNavigate()
    const {groupId} = useParams()
    const [details, setDetails] = useState(null)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(apiUrl(`/api/listening-groups/${groupId}/details`))
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
    const joinedCount = details?.candidates?.length ?? 0
    const otherCandidatesCount = Math.max((details?.totalCandidates ?? 0) - joinedCount, 0)
    const candidateChartData = [
        {name: "Joined this group", value: joinedCount},
        {name: "Other candidates", value: otherCandidatesCount}
    ]
    const chartColors = ["#16a34a", "#2563eb"]

    return (
        <main className="main-content">
            <h1 className="app-title">Group Details</h1>
            <Button variant="secondary" type="button" className="back-button" onClick={() => navigate(-1)}>
                Back
            </Button>
            {error && <p className="form-error">{error}</p>}

            {group && (
                <section className="details-panel">
                    <h2>{group.name}</h2>
                    <p>Course: {group.courseName || "No course"}</p>
                    <p>Level: {group.courseLevel || "No level"}</p>
                    <p>Subject: {group.subjectName || "No subject"}</p>
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

                    <div className="candidate-chart-panel">
                        <h3>Candidate Distribution</h3>
                        <div className="candidate-chart-summary">
                            <span><strong>{joinedCount}</strong> Joined this group</span>
                            <span><strong>{otherCandidatesCount}</strong> Other candidates</span>
                        </div>
                        <div className="candidate-chart">
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={candidateChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={54}
                                        outerRadius={86}
                                        paddingAngle={3}
                                    >
                                        {candidateChartData.map((entry, index) => (
                                            <Cell key={entry.name} fill={chartColors[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>
            )}
        </main>
    )
}

export default GroupDetails
