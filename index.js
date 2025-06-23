const path = require('path');
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;

// parse options
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({limit: '10mb'}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
const allowedOrigin = "https://crpit-frontend.vercel.app";
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

app.options('*', cors({
  origin: allowedOrigin,
  credentials: true,
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://crpit-frontend.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


//routes
const blogRoutes = require("./src/routes/blog.route");
const commentRoutes = require("./src/routes/comment.route");
const userRoutes = require("./src/routes/auth.user.route");

app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", userRoutes);

app.get('/', (req, res) => {
  res.send('Inn-Tech blog server is running...!');
});

app.use((req, res) => {
  res.status(404).json({ message: "Ruta nije pronađena." });
});

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Mongodb connected successfully!");
}

main().catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})