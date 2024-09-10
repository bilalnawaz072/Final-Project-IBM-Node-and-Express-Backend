const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({error: "Username and password are required"});
    if (users.find(u => u.username === username)) return res.status(400).json({error: "Username already exists"});
    users.push({username, password});
    return res.json({message: "User registered successfully"});
});
  
public_users.get('/', async (req, res) => {
    try {
        const booksList = await books;
        return res.json(booksList);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if (!book) throw new Error("Book not found");
        return res.json(book);
    } catch (error) {
        return res.status(404).json({error: error.message});
    }
});


public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const filteredBooks = Object.values(books).filter(b => b.author === author);
        if (!filteredBooks.length) throw { status: 404, message: "Books not found" }
        return res.json(filteredBooks);
    } catch (err) {
        return res.status(err.status).json({error: err.message});
    }
});

public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const filteredBooks = Object.values(books).filter(b => b.title === title);
        if (!filteredBooks.length) throw { status: 404, message: "Books not found" }
        return res.json(filteredBooks);
    } catch (err) {
        return res.status(err.status).json({error: err.message});
    }
});


public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) return res.status(404).json({error: "Book not found"});
    return res.json(book.reviews);
});
  
module.exports.general = public_users;
