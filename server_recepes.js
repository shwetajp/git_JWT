const express = require("express");
const { authenticateJWT } = require("./server"); // Importing authenticateJWT from server.js
const fs = require("fs");
const path = require("path");

const router = express.Router(); // Create an Express router instance

const dataFilePath = path.join(__dirname, "recipes.json");

// Read the JSON file
const readData = () => {
  try {
    const data = fs.readFileSync(dataFilePath);
    const jsonData = JSON.parse(data);
    return jsonData.recipes || [];
  } catch (err) {
    console.error("Error reading data:", err);
    return [];
  }
};

// Write to the JSON file
const writeData = (recipes) => {
  fs.writeFileSync(dataFilePath, JSON.stringify({ recipes }, null, 2));
};

// CRUD Endpoints

// POST a new recipe
router.post("/", authenticateJWT, (req, res) => {
  const recipes = readData();
  const newRecipe = req.body;
  newRecipe.id = Date.now();
  newRecipe.userId = req.user.username; // Set the user ID to the username extracted from JWT payload
  recipes.push(newRecipe);
  writeData(recipes);
  res.status(201).json(newRecipe);
});

// GET all recipes
router.get("/", (req, res) => {
  const recipes = readData();
  res.json(recipes);
});

// GET a specific recipe
router.get("/:id", (req, res) => {
  const recipes = readData();
  const recipe = recipes.find((r) => r.id == req.params.id);
  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).send("Recipe not found");
  }
});

// Update a recipe
router.put("/:id", (req, res) => {
  const recipes = readData();
  const index = recipes.findIndex((r) => r.id == req.params.id);
  if (index !== -1) {
    recipes[index] = { ...recipes[index], ...req.body };
    writeData(recipes);
    res.json(recipes[index]);
  } else {
    res.status(404).send("Recipe not found");
  }
});

// Delete a recipe
router.delete("/:id", (req, res) => {
  let recipes = readData();
  const initialLength = recipes.length;
  recipes = recipes.filter((r) => r.id != req.params.id);
  if (recipes.length < initialLength) {
    writeData(recipes);
    res.json({
      message: `Recipe with ID ${req.params.id} deleted successfully`,
    });
  } else {
    res.status(404).send("Recipe not found");
  }
});

module.exports = router; // Export the router for use in the main server file
