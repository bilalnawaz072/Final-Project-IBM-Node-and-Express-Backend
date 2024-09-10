const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.find(user => user.username === username);
  }
  
const authenticatedUser = (username, password) => {
    return users.find(user => user.username === username && user.password === password);
}
  


regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({error: "Username and password are required"});
    if (!authenticatedUser(username, password)) return res.status(401).json({error: "Invalid username or password"});
    const token = jwt.sign({username}, "S68SAG32KI");
    req.session.token = token;
    return res.json({message: "Logged in successfully", token});
});
  


regd_users.put("/auth/review/:isbn", (req, res) => {
    const { review } = req.body;
    const isbn = req.params.isbn;
    const token = req.session.token;
    if (!token) return res.status(401).json({error: "Unauthorized"});
    try {
      const decoded = jwt.verify(token, "S68SAG32KI");
      const { username } = decoded;
      if (!books[isbn].reviews[username]) {
        books[isbn].reviews[username] = review;
      } else {
        books[isbn].reviews[username] = review;
      }
      return res.json({message: "Review added/modified successfully"});
    } catch(err) {
      return res.status(401).json({error: "Unauthorized"});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const token = req.session.token;
    if (!token) return res.status(401).json({error: "Unauthorized"});
    try {
      const decoded = jwt.verify(token, "S68SAG32KI");
      const { username } = decoded;
      if(!books[isbn]) return res.status(404).json({error: "isbn not found"});
      if(!books[isbn].reviews[username]) return res.status(404).json({error: "review not found"});
      delete books[isbn].reviews[username];
      return res.json({message: "Review deleted successfully"});
    } catch(err) {
      return res.status(401).json({error: "Unauthorized"});
    }
});
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
