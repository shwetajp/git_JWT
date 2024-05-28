// const express = require("express");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const mongoose = require("mongoose");
// const User = require("./models/user"); // Import User model
// const Recipe = require("./models/recipe");

// const app = express();
// const PORT = process.env.PORT || 3000;
// const SECRET_KEY = "your_secret_key";

// mongoose
//   .connect("mongodb://127.0.0.1:27017/recipesdb")
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// app.use(express.json());

// app.post("/register", async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     // Check if username or email already exists
//     const existingUser = await User.findOne({ $or: [{ username }, { email }] });
//     if (existingUser) {
//       return res.status(400).send("Username or email already exists");
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();
//     res.status(201).send("User registered");
//   } catch (error) {
//     console.error("Error registering user:", error);
//     res.status(500).send("Internal server error");
//   }
// });

// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(401).send("Username or password incorrect");
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (passwordMatch) {
//       const token = jwt.sign({ username: user.username }, SECRET_KEY, {
//         expiresIn: "1h",
//       });
//       res.json({ token });
//     } else {
//       res.status(401).send("Username or password incorrect");
//     }
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).send("Internal server error");
//   }
// });

// const authenticateJWT = (req, res, next) => {
//   const token = req.header("Authorization");
//   console.log(token);
//   if (token) {
//     jwt.verify(token, SECRET_KEY, (err, user) => {
//       if (err) {
//         return res.sendStatus(403);
//       }
//       req.user = user;
//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// };

// // CRUD endpoints for recipes
// app.get("/recipes", authenticateJWT, async (req, res) => {
//   try {
//     const recipes = await Recipe.find({ userId: req.user.username });
//     res.json(recipes);
//   } catch (error) {
//     console.error("Error fetching recipes:", error);
//     res.status(500).send("Internal server error");
//   }
// });

// // app.post("/recipes", authenticateJWT, async (req, res) => {
// //   try {
// //     const newRecipe = new Recipe({ ...req.body, userId: req.user.username });
// //     await newRecipe.save();
// //     res.status(201).json(newRecipe);
// //   } catch (error) {
// //     console.error("Error adding new recipe:", error);
// //     res.status(500).send("Internal server error");
// //   }
// // });

// app.post("/recipes", authenticateJWT, async (req, res) => {
//   try {
//     const newRecipe = new Recipe({ ...req.body, userId: req.user.username }); // Issue is here
//     console.log(newRecipe);
//     await newRecipe.save();
//     res.status(201).json(newRecipe);
//   } catch (error) {
//     console.error("Error adding new recipe:", error);
//     res.status(500).send("Internal server error");
//   }
// });

// app.put("/recipes/:id", authenticateJWT, async (req, res) => {
//   try {
//     const recipe = await Recipe.findById(req.params.id);
//     if (!recipe) {
//       return res.status(404).send("Recipe not found");
//     }
//     if (recipe.userId !== req.user.username) {
//       return res.status(403).send("Unauthorized");
//     }

//     Object.assign(recipe, req.body);
//     await recipe.save();
//     res.json(recipe);
//   } catch (error) {
//     console.error("Error updating recipe:", error);
//     res.status(500).send("Internal server error");
//   }
// });

// app.delete("/recipes/:id", authenticateJWT, async (req, res) => {
//   try {
//     const recipe = await Recipe.findById(req.params.id);
//     if (!recipe) {
//       return res.status(404).send("Recipe not found");
//     }
//     if (recipe.userId !== req.user.username) {
//       return res.status(403).send("Unauthorized");
//     }

//     await recipe.remove();
//     res.send("Recipe deleted successfully");
//   } catch (error) {
//     console.error("Error deleting recipe:", error);
//     res.status(500).send("Internal server error");
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Recipe = require("./models/recipe");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = "your_secret_key";

mongoose
  .connect("mongodb://127.0.0.1:27017/recipesdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

// // ...test purpose

// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// // Verify and decode the token
// const decodedToken = jwt.decode(token);

// // Log the decoded token
// console.log(decodedToken);

//....................... middleware.............
// const authenticateJWT = (req, res, next) => {
//   const token = req.header("Authorization");
//   if (token) {
//     jwt.verify(token, SECRET_KEY, (err, user) => {
//       if (err) {
//         return res.sendStatus(403);
//       }
//       req.user = user;
//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// };

// User registration
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send("Username or email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).send("User registered");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Internal server error");
  }
});

// User login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send("Username or password incorrect");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign({ username: user.username }, SECRET_KEY, {
        expiresIn: "1h",
      });
      res.json({ token });
    } else {
      res.status(401).send("Username or password incorrect");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal server error");
  }
});

const authenticateJWT = (req, res, next) => {
  // const token = req.header("Authorization");
  // console.log("JWT Token:", token);
  // // console.log()
  // if (token) {
  //   jwt.verify(token, SECRET_KEY, (err, user) => {
  //     if (err) {
  //       console.error("JWT Verification Error:", err);
  //       return res.sendStatus(403);
  //     }
  //     console.log("Authenticated User:", user);
  //     req.user = user;
  //     next();
  //   });
  // } else {
  //   res.sendStatus(401);
  // }

  const token = req.headers["authorization"];
  console.log("JWT Token:", token);
  if (!token) {
    console.log("not authorized");
    return res.status(401).json("Unauthorize user");
  }

  try {
    // const decoded = jwt.verify(token,config.secret);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json("Token not valid");
  }
};

// Recipe CRUD routes
app.get("/recipes", authenticateJWT, async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.user.username });
    if (!recipes || recipes.length === 0) {
      return res.status(404).send("No recipes found for this user");
    }
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).send("Internal server error");
  }
});

app.post("/recipes", authenticateJWT, async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const newRecipe = new Recipe({ ...req.body, userId: req.user.username });
    console.log("New Recipe:", newRecipe);
    await newRecipe.save();
    console.log("Recipe Saved Successfully");
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error adding new recipe:", error);
    res.status(500).send("Internal server error");
  }
});

app.put("/recipes/:id", authenticateJWT, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe || recipe.userId !== req.user.username) {
      return res.status(403).send("Unauthorized");
    }
    Object.assign(recipe, req.body);
    await recipe.save();
    res.json(recipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).send("Internal server error");
  }
});

app.delete("/recipes/:id", authenticateJWT, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe || recipe.userId !== req.user.username) {
      return res.status(403).send("Unauthorized");
    }
    await recipe.remove();
    res.send("Recipe deleted successfully");
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).send("Internal server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
