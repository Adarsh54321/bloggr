require("dotenv").config();

const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/user");
const Post = require("./models/post");


const JWT_SECRET = process.env.JWT_SECRET;
const app = express();

app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGODB_URI)


.then(() => {
  console.log("MongoDB Connected!");
})
.catch((err) => {
  console.error(err);
});

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("BlogX Backend is running!");
});

app.post("/register", async (req, res) => {
  try {
    const { username,email,password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
    username,
    email,
    password: hashedPassword
  });

    await newUser.save();

    res.json({
      message: "User registered successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});



app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
  {
    id: user._id,
    username: user.username
  },
  JWT_SECRET,
  {
    expiresIn: "1h"
  }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

app.get("/profile", async (req, res) => {  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

try {
  const decoded = jwt.verify(token, JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password");

  res.json({
    message: "Profile accessed",
    user
  });

} catch (error) {
  res.status(401).json({
    message: "Invalid token"
  });
}

});



app.post("/posts", async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const { title, content } = req.body;

    const newPost = new Post({
      title,
      content,
      author: decoded.id
    });

    await newPost.save();

    res.json({
      message: "Post created successfully",
      post: newPost
    });

  } catch (error) {
    res.status(401).json({
      message: "Invalid token"
    });
  }
});


app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});