import {useEffect, useState} from "react";
import {Button, Col, Container, Row, Table} from "react-bootstrap";


const ShowStudents = () =>{

    const [students,setStudents] = useState([])

    useEffect(() => {
        const FetchStudents = async() =>{
            try{
                const response = await fetch("http://localhost:8080/api/students")
                const data = await response.json()
                setStudents(data)
            }catch(error){
                console.error("Fetching error:",error.message)
            }
        }
        void FetchStudents()
    }, []);


    return (
        <>
            <Container className="mt-5">
                <Row>
                    <Col>
                        <h1 className="main-content app-title">Prikaz svih studenata u sistemu</h1>
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
                                {students.map((student) =>(
                                    <tr key={student.id}>
                                        <td>{student.username}</td>
                                        <td>{student.name}</td>
                                        <td>{student.surname}</td>
                                        <td>{student.city_name}</td>
                                        <td>
                                            <Button variant="outline-secondary"> Update </Button>{" "}
                                            <Button variant="outline-danger"> Delete </Button>
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

export default ShowStudents