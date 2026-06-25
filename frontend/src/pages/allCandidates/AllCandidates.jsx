import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {apiUrl} from "../../api/apiConfig.js";

const AllCandidates = () => {
    const navigate = useNavigate()
    const [candidates, setCandidates] = useState([])
    const [filters, setFilters] = useState({
        name: "",
        surname: "",
        courseOrGroup: ""
    })
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await fetch(apiUrl("/api/candidates/with-listening-groups"))
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

    const handleFilterChange = (event) => {
        const {name, value} = event.target
        setFilters({
            ...filters,
            [name]: value
        })
    }

    const filteredCandidates = candidates.filter((candidate) => {
        const nameMatches = candidate.name?.toLowerCase().includes(filters.name.toLowerCase())
        const surnameMatches = candidate.surname?.toLowerCase().includes(filters.surname.toLowerCase())
        const courseOrGroupMatches = (candidate.listeningGroups ?? []).some((group) => {
            const searchValue = filters.courseOrGroup.toLowerCase()
            return group.name?.toLowerCase().includes(searchValue)
                || group.courseName?.toLowerCase().includes(searchValue)
                || group.subjectName?.toLowerCase().includes(searchValue)
        })

        return (!filters.name || nameMatches)
            && (!filters.surname || surnameMatches)
            && (!filters.courseOrGroup || courseOrGroupMatches)
    })

    return (
        <main className="main-content">
            <h1 className="app-title">Candidates</h1>
            <Button variant="secondary" type="button" className="back-button" onClick={() => navigate(-1)}>
                Back
            </Button>
            {error && <p className="form-error">{error}</p>}

            <section className="filter-bar" aria-label="Candidate filters">
                <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="Search by name"
                />
                <input
                    type="text"
                    name="surname"
                    value={filters.surname}
                    onChange={handleFilterChange}
                    placeholder="Search by surname"
                />
                <input
                    type="text"
                    name="courseOrGroup"
                    value={filters.courseOrGroup}
                    onChange={handleFilterChange}
                    placeholder="Search by course, subject or group"
                />
            </section>

            <section className="candidate-list" aria-label="Candidates">
                {filteredCandidates.map((candidate) => (
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
                                    {group.courseName ? `${group.name} - ${group.courseName}` : group.name}
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
