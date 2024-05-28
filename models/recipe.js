// const mongoose = require("mongoose");

// const recipeSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   ingredients: { type: [String], required: true },
//   instructions: { type: [String], required: true },
//   prepTimeMinutes: { type: Number },
//   cookTimeMinutes: { type: Number },
//   servings: { type: Number },
//   difficulty: { type: String },
//   cuisine: { type: String },
//   caloriesPerServing: { type: Number },
//   tags: { type: [String] },
//   image: { type: String },
//   mealType: { type: [String] },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
//   rating: { type: Number },
//   reviewCount: { type: Number },
// });

// module.exports = mongoose.model("Recipe", recipeSchema);

const mongoose = require("mongoose");
const User = require("./user");

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: [String], required: true },
  prepTimeMinutes: { type: Number },
  cookTimeMinutes: { type: Number },
  servings: { type: Number },
  difficulty: { type: String },
  cuisine: { type: String },
  caloriesPerServing: { type: Number },
  tags: { type: [String] },
  image: { type: String },
  mealType: { type: [String] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Store the ObjectId of the user
  rating: { type: Number },
  reviewCount: { type: Number },
});

module.exports = mongoose.model("Recipe", recipeSchema);
