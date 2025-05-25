
// Import required modules
import express from "express";
import mongoose from "mongoose";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Vendor from "./models/Vendor.js";
import bcrypt from "bcrypt";
import cors from "cors";

import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
 


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer();

const MONGO_URL = "mongodb://127.0.0.1:27017/projects";

mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch(err => console.error(err));

// Middleware setup
app.use(express.static(path.join(__dirname)));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Add session middleware (required for passport sessions)
app.use(session({
  secret: "your-session-secret", // change to a strong secret
  resave: false,
  saveUninitialized: false,
}));

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy setup
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const vendor = await Vendor.findOne({ username });
    if (!vendor) {
      return done(null, false, { message: "Incorrect username." });
    }
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return done(null, false, { message: "Incorrect password." });
    }
    return done(null, vendor);
  } catch (err) {
    return done(err);
  }
}));

// Serialize user id to session
passport.serializeUser((vendor, done) => {
  done(null, vendor.id);
});

// Deserialize user from session by id
passport.deserializeUser(async (id, done) => {
  try {
    const vendor = await Vendor.findById(id);
    done(null, vendor);
  } catch (err) {
    done(err);
  }
});

// Routes

app.get("/register-login", (req, res) => {
  res.sendFile(path.join(__dirname, "/register.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/login.html"));
});

app.get("/vendors", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch vendors." });
  }
});

// Registration route remains mostly the same
app.post("/register", upload.none(), async (req, res) => {
  console.log("Register hit", req.body);

  try {
    const {
      vendorName,
      phone,
      cartType,
      category,
      description,
      photo,
      username,
      password
    } = req.body;

    if (!vendorName || !phone || !cartType || !category || !description || !photo || !username || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const existingVendor = await Vendor.findOne({ username });
    if (existingVendor) {
      return res.status(400).json({ success: false, message: "Username already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new Vendor({
      vendorName,
      phone,
      cartType,
      category,
      description,
      photo,
      username,
      password: hashedPassword,
    });

    await newVendor.save();

    res.status(201).json({ success: true, message: "Vendor registered!" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Registration failed." });
  }
});

// Login route uses passport.authenticate middleware now
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, vendor, info) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    if (!vendor) {
      // Authentication failed
      return res.status(401).json({ success: false, message: info.message || "Invalid credentials" });
    }
    // Login vendor and create session
    req.logIn(vendor, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
      }
      return res.json({ success: true, vendorName: vendor.vendorName });
    });
  })(req, res, next);
});

// Optional: add logout route
app.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ success: true, message: "Logged out" });
  });
});

app.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});
