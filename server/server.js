require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Student = require("./studentModel");

const PORT = process.env.PORT || 5000;

async function connectDB() {

    try {

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Atlas connected successfully!");

    } catch (error) {

        console.log("MongoDB connection failed:");
        console.log(error.message);

        process.exit(1);
    }
}

function sendResponse(res, statusCode, data) {

    res.writeHead(statusCode, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    });

    res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {

    // Handle browser preflight request
    if (req.method === "OPTIONS") {

        res.writeHead(204, {
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });

        res.end();

        return;
    }

    // REGISTER
    if (req.method === "POST" && req.url === "/register") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {

            try {

                const data = JSON.parse(body);

                const {
                    fullName,
                    email,
                    password,
                    phone,
                    dateOfBirth,
                    gender,
                    course,
                    address
                } = data;

                if (
                    !fullName ||
                    !email ||
                    !password ||
                    !phone ||
                    !dateOfBirth ||
                    !gender ||
                    !course ||
                    !address
                ) {

                    return sendResponse(res, 400, {
                        message: "All fields are required"
                    });
                }

                const existingStudent = await Student.findOne({
                    email: email.toLowerCase()
                });

                if (existingStudent) {

                    return sendResponse(res, 409, {
                        message: "Email already registered"
                    });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const student = await Student.create({

                    fullName,

                    email: email.toLowerCase(),

                    password: hashedPassword,

                    phone,

                    dateOfBirth,

                    gender,

                    course,

                    address
                });

                sendResponse(res, 201, {
                    message: "Registration successful",
                    student: {
                        id: student._id,
                        fullName: student.fullName,
                        email: student.email,
                        course: student.course
                    }
                });

            } catch (error) {

                console.log(error);

                sendResponse(res, 500, {
                    message: "Registration failed"
                });
            }
        });

        return;
    }


    // LOGIN
    if (req.method === "POST" && req.url === "/login") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {

            try {

                const { email, password } = JSON.parse(body);

                const student = await Student.findOne({
                    email: email.toLowerCase()
                });

                if (!student) {

                    return sendResponse(res, 401, {
                        message: "Invalid email or password"
                    });
                }

                const passwordMatch = await bcrypt.compare(
                    password,
                    student.password
                );

                if (!passwordMatch) {

                    return sendResponse(res, 401, {
                        message: "Invalid email or password"
                    });
                }

                sendResponse(res, 200, {

                    message: "Login successful",

                    student: {
                        id: student._id,
                        fullName: student.fullName,
                        email: student.email,
                        phone: student.phone,
                        course: student.course,
                        gender: student.gender
                    }
                });

            } catch (error) {

                console.log(error);

                sendResponse(res, 500, {
                    message: "Login failed"
                });
            }
        });

        return;
    }


    sendResponse(res, 404, {
        message: "Route not found"
    });
});


connectDB().then(() => {

    server.listen(PORT, () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    });


});