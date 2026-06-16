import {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const PostSudent = () =>{

    const navigate = useNavigate()

    const [formData,setFormData] = useState({
        username: "",
        password: "",
        name: "",
        surname: "",
        city_id: ""
    })

    const [cities,setCities] = useState([])

    const handleInputChange = (event) => {
        const {name, value} = event.target
        setFormData({
            ...formData,
            [name]:value,
        })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()

        const dataToSend = {
            ...formData,
            city_id: formData.city_id === "" ? null : Number(formData.city_id)
        };

        console.log(dataToSend)

        try{
            const response = await(fetch("http://localhost:8080/api/student", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(dataToSend)
            }))
            const data = await(response.json())
            console.log("Student is created : ", data)
            navigate("/")
        } catch (error){
            console.error("Error creating student : ", error.message)
        }

    }

    useEffect(() => {
        const fetchCities = async() => {
            try{
                const response = await fetch("http://localhost:8080/api/cities")

                if(!response.ok){
                    console.error("Data could not be fetched !")
                }

                const data = await response.json()
                setCities(data)
            }catch (error){
                console.error("Error fetching cities :",error)
            }
        }
        void fetchCities()
    }, []);

    return(
        <>
        <div>
            <h1 className="app-title main-content"> Dodaj novog studenta </h1>
            <Form onSubmit={handleSubmit} className="student-form">
                <Form.Group controlId="FormBasicUsername">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        type= "text"
                        name ="username"
                        placeholder="Enter username"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="FormBasicPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        name ="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="FormBasicName">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                        type="text"
                        name ="name"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="FormBasicSurname">
                    <Form.Label>Surname:</Form.Label>
                    <Form.Control
                        type="text"
                        name ="surname"
                        placeholder="Enter surname"
                        value={formData.surname}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="FormBasicCity">
                    <Form.Label>City:</Form.Label>
                    <Form.Select
                        name ="city_id"
                        value={formData.city_id}
                        onChange={handleInputChange}
                    >
                        <option value="">Choose city</option>

                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </Form.Select>

                </Form.Group>
                <Button variant="primary" type="submit" className="student-button"> Dodaj </Button>
            </Form>
        </div>
        </>
    )

}

export default PostSudent