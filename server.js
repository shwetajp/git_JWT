const fs = require("fs");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = "your_secret_key"; // Change this to a strong secret key

app.use(express.json());


const users = [

  {
    username: "user1",
    password: "$2a$10$22vP.HhX2wSqy0dbKGO7LulmCzGsW9qZ1HTzQL1q8a9llU.OUH2Ju", // Hashed password for "password1"
  },
];

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};


app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
   
    const hashedPassword = await bcrypt.hash(password, 10);

   
    users.push({ username, password: hashedPassword }); 
    console.log(users);

   
    res.status(201).send("User registered");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Internal server error");
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = users.find((user) => user.username === username);
  console.log("Username:", username);
  console.log("Users:", users);
  console.log(user);
  if (!user) {
    return res.status(401).send("Username or password incorrect");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (passwordMatch) {
  // generate JWT token
    const token = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).send("Username or password incorrect");
  }
});

// CRUD endpoints for recipes
app.get("/recipes", authenticateJWT, (req, res) => {
  try {
    // ....................Read 
    const recipesData = fs.readFileSync("./recipes.json");
    const recipes = JSON.parse(recipesData);


    res.json(recipes.recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).send("Internal server error");
  }
});



app.post("/recipes", authenticateJWT, (req, res) => {
  try {
   
    const recipesData = fs.readFileSync("./recipes.json");
    let recipes = JSON.parse(recipesData);

    // ...........................Add new recipe
    const newRecipe = req.body;
    newRecipe.id = Date.now(); 
    newRecipe.userId = req.user.username; 
    recipes.recipes.push(newRecipe);

    
    fs.writeFileSync("./recipes.json", JSON.stringify(recipes, null, 2));

    //..................................... Send the new recipe as response
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error adding new recipe:", error);
    res.status(500).send("Internal server error");
  }
});

app.put("/recipes/:id", authenticateJWT, (req, res) => {
  try {
    // ...........................Read recipes from JSON file
    const recipesData = fs.readFileSync("./recipes.json");
    let recipes = JSON.parse(recipesData);

  
    const index = recipes.recipes.findIndex(
      (recipe) => recipe.id === parseInt(req.params.id)
    );

    if (index === -1) {
      return res.status(404).send("Recipe not found");
    }

    // Check if the user has permission to update the recipe
    if (recipes.recipes[index].userId !== req.user.username) {
      return res.status(403).send("Unauthorized");
    }

    // Update the recipe
    recipes.recipes[index] = { ...recipes.recipes[index], ...req.body };

    // Write updated recipes to JSON file
    fs.writeFileSync("./recipes.json", JSON.stringify(recipes, null, 2));

    // Send the updated recipe as response
    res.json(recipes.recipes[index]);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).send("Internal server error");
  }
});

app.delete("/recipes/:id", authenticateJWT, (req, res) => {
  try {
    // Read recipes from JSON file
    const recipesData = fs.readFileSync("./recipes.json");
    let recipes = JSON.parse(recipesData);

    // Find the index of the recipe to delete
    const index = recipes.recipes.findIndex(
      (recipe) => recipe.id === parseInt(req.params.id)
    );

    if (index === -1) {
      return res.status(404).send("Recipe not found");
    }

    // Check if the user has permission to delete the recipe
    if (recipes.recipes[index].userId !== req.user.username) {
      return res.status(403).send("Unauthorized");
    }

    // Remove the recipe from the list
    recipes.recipes.splice(index, 1);

    // Write updated recipes to JSON file
    fs.writeFileSync("./recipes.json", JSON.stringify(recipes, null, 2));

    res.send("Recipe deleted successfully");
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).send("Internal server error");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
