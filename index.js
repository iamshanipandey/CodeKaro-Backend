const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");

const database = require("./config/database");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT  = process.env.PORT || 3000;

//Database Connection
database.connect();
//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "https://code-karo-front-end.vercel.app/",
        credentials: true,
    })
)
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
)

//Cloudinary Connection
cloudinaryConnect();

//routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", profileRoutes);
app.use("/api/v1", courseRoutes);
app.use("/api/v1", paymentRoutes);

//default routes
app.get("/", (req, res) =>{
    return res.status(200).json({
        success: true,
        message:"Your server is up and running..",
    })
})

app.listen(PORT, ()=>{
    console.log(`App is running at ${PORT}`)
});

