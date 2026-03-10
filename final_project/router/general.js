const express = require('express');
const axios = require('axios');
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Task 10: Get all books
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/books`); 
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11: Get book details by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${BASE_URL}/books/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found", error: error.message });
  }
});

// Task 12: Get book details by author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`${BASE_URL}/books/author/${encodeURIComponent(author)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found for this author", error: error.message });
  }
});

// Task 13: Get book details by title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`${BASE_URL}/books/title/${encodeURIComponent(title)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found with this title", error: error.message });
  }
});

module.exports.general = public_users;