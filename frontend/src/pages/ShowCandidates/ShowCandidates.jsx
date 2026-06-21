import {useEffect, useState} from "react";
import {Button, Col, Container, Row, Table} from "react-bootstrap";


const ShowCandidates = () =>{

    const [candidates,setCandidates] = useState([])

    const getCandidateId = (candidate) => candidate.idCandidate ?? candidate.id

    useEffect(() => {
        const fetchCandidates = async() =>{
            try{
                const response = await fetch("http://localhost:8080/api/candidates")
                if (!response.ok) {
                    console.error("Candidates could not be fetched")
                    return
                }
                const data = await response.json()
                setCandidates(data)
            }catch(error){
                console.error("Fetching error:",error.message)
            }
        }
        void fetchCandidates()
    }, []);

    const handleDelete = async (candidateId) =>{
        try{
            const response = await fetch(`http://localhost:8080/api/candidateDel/${candidateId}`,{
                method: "DELETE"
            })

            if (response.ok){
                setCandidates((prevCandidates) => prevCandidates.filter((candidate) => getCandidateId(candidate) !== candidateId))
            } else {
                console.error("Candidate could not be deleted")
            }

        } catch(error){
            console.error("Error deleting candidate: ", error.message)
        }
    }


    return (
        <>
            <Container className="mt-5">
                <Row>
                    <Col>
                        <h1 className="main-content app-title">Prikaz svih kandidata u sistemu</h1>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Name</th>
                                    <th>Surname</th>
                                    <th>City</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map((candidate) =>(
                                    <tr key={getCandidateId(candidate)}>
                                        <td>{candidate.username}</td>
                                        <td>{candidate.name}</td>
                                        <td>{candidate.surname}</td>
                                        <td>{candidate.city_name ?? "Nije izabran grad"}</td>
                                        <td>
                                            <Button variant="outline-secondary"> Update </Button>{" "}
                                            <Button variant="outline-danger" onClick={() => handleDelete(getCandidateId(candidate))}> Delete </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default ShowCandidates
