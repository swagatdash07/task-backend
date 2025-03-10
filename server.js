const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB Connected")).catch((err) => console.error(err, "errr"));

app.use("/auth", authRoutes);
app.use("/tasks", require("./middleware/authMiddleware"), taskRoutes);

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("Server is running!");
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
