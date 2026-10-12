import { useState } from "react";
import "./App.css";

function App() {

    const [page, setPage] = useState("login");

    const [message, setMessage] = useState("");

    const [student, setStudent] = useState(null);


    const [registerData, setRegisterData] = useState({

        fullName: "",
        email: "",
        password: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        course: "",
        address: ""

    });


    const [loginData, setLoginData] = useState({

        email: "",
        password: ""

    });


    function handleRegisterChange(e) {

        setRegisterData({

            ...registerData,

            [e.target.name]: e.target.value

        });

    }


    function handleLoginChange(e) {

        setLoginData({

            ...loginData,

            [e.target.name]: e.target.value

        });

    }


    async function registerStudent(e) {

        e.preventDefault();

        setMessage("");

        try {

            const response = await fetch(
                "http://localhost:5000/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(registerData)
                }
            );

            const data = await response.json();

            if (response.ok) {

                setMessage("Registration successful! Please login.");

                setRegisterData({
                    fullName: "",
                    email: "",
                    password: "",
                    phone: "",
                    dateOfBirth: "",
                    gender: "",
                    course: "",
                    address: ""
                });

                setPage("login");

            } else {

                setMessage(data.message);
            }

        } catch (error) {

            setMessage("Server connection failed");

        }
    }


    async function loginStudent(e) {

        e.preventDefault();

        setMessage("");

        try {

            const response = await fetch(
                "http://localhost:5000/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(loginData)
                }
            );

            const data = await response.json();

            if (response.ok) {

                setStudent(data.student);

                setMessage("");

            } else {

                setMessage(data.message);
            }

        } catch (error) {

            setMessage("Server connection failed");

        }
    }


    function logout() {

        setStudent(null);

        setLoginData({
            email: "",
            password: ""
        });

        setPage("login");
    }


    // STUDENT DASHBOARD

    if (student) {

        return (

            <div className="dashboard">

                <nav>

                    <h2>Student Portal</h2>

                    <button onClick={logout}>
                        Logout
                    </button>

                </nav>


                <div className="welcome">

                    <h1>
                        Welcome, {student.fullName}
                    </h1>

                    <p>
                        You have successfully logged in.
                    </p>

                </div>


                <div className="student-card">

                    <h2>Student Information</h2>

                    <p>
                        <strong>Name:</strong> {student.fullName}
                    </p>

                    <p>
                        <strong>Email:</strong> {student.email}
                    </p>

                    <p>
                        <strong>Phone:</strong> {student.phone}
                    </p>

                    <p>
                        <strong>Gender:</strong> {student.gender}
                    </p>

                    <p>
                        <strong>Course:</strong> {student.course}
                    </p>

                </div>

            </div>

        );
    }


    return (

        <div className="container">

            <div className="box">

                <h1>Student Portal</h1>


                {page === "login" && (

                    <>

                        <h2>Student Login</h2>

                        <form onSubmit={loginStudent}>

                            <input
                                type="email"
                                name="email"
                                placeholder="Registered Email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                required
                            />

                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                required
                            />

                            <button type="submit">
                                Login
                            </button>

                        </form>


                        <p>
                            Don't have an account?
                        </p>

                        <button
                            className="secondary"
                            onClick={() => {
                                setMessage("");
                                setPage("register");
                            }}
                        >
                            Register
                        </button>

                    </>

                )}


                {page === "register" && (

                    <>

                        <h2>Student Registration</h2>

                        <form onSubmit={registerStudent}>

                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={registerData.fullName}
                                onChange={handleRegisterChange}
                                required
                            />


                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                required
                            />


                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                required
                            />


                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={registerData.phone}
                                onChange={handleRegisterChange}
                                required
                            />


                            <label>Date of Birth</label>

                            <input
                                type="date"
                                name="dateOfBirth"
                                value={registerData.dateOfBirth}
                                onChange={handleRegisterChange}
                                required
                            />


                            <select
                                name="gender"
                                value={registerData.gender}
                                onChange={handleRegisterChange}
                                required
                            >

                                <option value="">
                                    Select Gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>


                            <select
                                name="course"
                                value={registerData.course}
                                onChange={handleRegisterChange}
                                required
                            >

                                <option value="">
                                    Select Course
                                </option>

                                <option value="BCA">
                                    BCA
                                </option>

                                <option value="B.Tech">
                                    B.Tech
                                </option>

                                <option value="MCA">
                                    MCA
                                </option>

                            </select>


                            <textarea
                                name="address"
                                placeholder="Address"
                                value={registerData.address}
                                onChange={handleRegisterChange}
                                required
                            />


                            <button type="submit">
                                Register
                            </button>

                        </form>


                        <p>
                            Already registered?
                        </p>

                        <button
                            className="secondary"
                            onClick={() => {
                                setMessage("");
                                setPage("login");
                            }}
                        >
                            Login
                        </button>

                    </>

                )}


                {message && (

                    <div className="message">
                        {message}
                    </div>

                )}

            </div>

        </div>
    );
}

export default App;