const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // utilisateurs enregistrés

// Vérifie si le nom d'utilisateur est disponible (Task 6)
const isValid = (username) => {
  return !users.some(user => user.username === username);
}

// Vérifie si l'utilisateur et le mot de passe sont corrects
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

// Task 7: Login utilisateur enregistré
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Générer un JWT
  const accessToken = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });

  // Stocker le JWT dans la session
  req.session = req.session || {};
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "User successfully logged in", accessToken });
});

// Task 8: Ajouter ou modifier une critique de livre
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session?.authorization?.username;
  const isbn = req.params.isbn;
  const reviewText = req.query.review;

  if (!username) return res.status(401).json({ message: "User not logged in" });
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  if (!reviewText) return res.status(400).json({ message: "Review text missing" });

  // Initialiser les reviews si nécessaire
  if (!books[isbn].reviews) books[isbn].reviews = {};

  // Ajouter ou modifier la review de l'utilisateur
  books[isbn].reviews[username] = reviewText;

  return res.status(200).json({ message: `Review added/updated for ISBN ${isbn}`, reviews: books[isbn].reviews });
});

// Task 9: Supprimer la review d'un utilisateur
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session?.authorization?.username;
  const isbn = req.params.isbn;

  if (!username) return res.status(401).json({ message: "User not logged in" });
  if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({ message: `Review deleted for ISBN ${isbn}`, reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;