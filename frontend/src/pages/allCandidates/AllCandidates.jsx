import {useEffect, useState} from "react";

const AllCandidates = () => {
    const [candidates, setCandidates] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/candidates/with-listening-groups")
                if (!response.ok) {
                    setError("Candidates could not be fetched")
                    return
                }
                setCandidates(await response.json())
            } catch (error) {
                console.error("Error fetching candidates:", error.message)
                setError("Candidates could not be fetched")
            }
        }

        void fetchCandidates()
    }, [])

    return (
        <main className="main-content">
            <h1 className="app-title">Candidates</h1>
            {error && <p className="form-error">{error}</p>}

            <section className="candidate-list" aria-label="Candidates">
                {candidates.map((candidate) => (
                    <article className="candidate-card" key={candidate.id}>
                        <h2>{candidate.name} {candidate.surname}</h2>
                        <p>Username: {candidate.username || "No username"}</p>
                        <p>Age: {candidate.age ?? "No age"}</p>
                        <p>City: {candidate.cityName || "No city"}</p>

                        <div className="candidate-groups">
                            <h3>Listening Groups</h3>
                            {(candidate.listeningGroups ?? []).length === 0 && <p>No listening groups</p>}
                            {(candidate.listeningGroups ?? []).map((group) => (
                                <span key={group.id} className="candidate-group-pill">
                                    {group.name}
                                </span>
                            ))}
                        </div>
                    </article>
                ))}
            </section>
        </main>
    )
}

export default AllCandidates
