require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const indexRouter = require("./routes/index");
const userRoutes = require("./routes/user");
const apiRoutes = require("./routes/api");
const Menu = require("./models/menuItem");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", apiRoutes);

// Connect to MongoDB using environment variable
const mongoURI = process.env.MONGO_CON;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Set the view engine to Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// populates the menu.pug with entries from the database.
app.get("/menu", async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.render("menu", { menuItems });
  } catch (err) {
    res.status(500).send("Error fetching menu items.");
  }
});

// Use the router
app.use("/", indexRouter);
app.use("/user", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
