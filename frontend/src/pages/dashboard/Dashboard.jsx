import {Link} from "react-router-dom";

const courses = [
    "Web Development",
    "Java Programming",
    "Database Systems",
    "Software Engineering",
    "React Fundamentals",
    "Spring Boot"
];

const Dashboard = () => {

    return(
        <>
            <main className="main-content">
                <h1 className="app-title">Courses</h1>

                <section className="course-grid" aria-label="Available courses">
                    {courses.map((course) => (
                        <article className="course-card" key={course}>
                            <h2>{course}</h2>
                            <Link className="course-register-button" to="/candidate">
                                Register
                            </Link>
                        </article>
                    ))}
                </section>
            </main>
        </>
    )
}

export default Dashboard
