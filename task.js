const express = require("express");
const app = express();

const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Custom logging middleware
app.use((req, res, next) => {
  const currentTime = new Date().toLocaleString();
  console.log(`Request received at: ${currentTime}`);
  console.log(`${req.method} ${req.url}`);
  next();
});

// In-memory users array
let users = [];
let idCounter = 1;

// Helper function for response format
const createResponse = (message, data = null) => {
  return {
    message,
    time: new Date().toLocaleString(),
    ...(data && { data })
  };
};

// Root route
app.get("/", (req, res) => {
  res.json(createResponse("Server Running"));
});


// ================= USERS ROUTES ================= //

// GET all users
app.get("/users", (req, res) => {
  res.json(createResponse("Users fetched successfully", users));
});

// GET user by ID (BONUS)
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json(createResponse("User not found"));
  }

  res.json(createResponse("User fetched successfully", user));
});

// POST add new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json(createResponse("Name and email are required"));
  }

  // Check duplicate email
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json(createResponse("Email already exists"));
  }

  const newUser = {
    id: idCounter++,
    name,
    email
  };

  users.push(newUser);

  res.status(201).json(createResponse("User added successfully", newUser));
});

// DELETE user by ID
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json(createResponse("User not found"));
  }

  users.splice(index, 1);

  res.json(createResponse("User deleted successfully"));
});


// ================= LOGIN ROUTE ================= //

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {    
    return res.status(400).json(createResponse("All fields required"));
  }

  if (email === "admin@gmail.com" && password === "1234") {
    return res.json(createResponse("Login Success"));
  }

  res.status(401).json(createResponse("Invalid Credentials"));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
