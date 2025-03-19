require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Menu = require("./models/menuItem");

const mongoURI = process.env.MONGO_CON;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
  seedDatabase();
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

async function seedDatabase() {
  try {
    const filePath = path.join(__dirname, "menuItems.json");
    const menuData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    await Menu.deleteMany({});
    const insertedItems = await Menu.insertMany(menuData);
    
    console.log(`Inserted ${insertedItems.length} menu items.`);
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    mongoose.connection.close();
  }
}
