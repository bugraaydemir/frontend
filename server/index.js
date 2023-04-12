import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import multer from 'multer';
import morgan from 'morgan';
import path from "path";
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Import required controllers and routes
import {register} from "./controllers/auth.js";

import authRoutes from "./routes/auth.js"


import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import notificationsRoutes from "./routes/notifications.js"
import settingsRoutes from "./routes/settings.js"
import {createPost} from "./controllers/posts.js";
import { verifyToken } from './middleware/auth.js';

// Import required functions for creating a socket.io server
import { createServer } from "http";
import { Server } from "socket.io";

/* Configurations */

// Set up file path and dotenv configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// Create express app instance
const app = express();
app.get("/", (req,res)=>{
  res.send('APP IS Running')
})
// Set up middleware for app
app.use(express.json());
app.use(express.static(__dirname + '/public'))

app.use(cookieParser())
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:10000000, extended:true}));
app.use(bodyParser.urlencoded({limit: 1000000,extended:true}));

// Set up CORS for specific origins
app.use(function(req, res, next) {
  const allowedOrigins = ["https://sociallobbystack.herokuapp.com"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Create a http server for socket.io and set up socket.io with CORS options
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { 
    origin: ["https://sociallobbystack.herokuapp.com"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
  }
});

// Set up the io instance as a property on the app instance
app.set('io', io);

// Set up the connection event for socket.io
io.on("connection", (socket) => {
  // ...
});

// Start the socket.io server on port 3002
httpServer.listen(3002, () => {
  console.log('Socket.io server is listening on port 3002');
});

// Serve static files in public/assets directory
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination:function (req, file ,cb){
        cb(null, path.join(__dirname, 'public/assets'));    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
})
/*LIMIT FILE SIZE*/
const upload = multer ({storage:storage,
  limits: {
    fileSize: 500 * 1920 * 1080}
  });


/*ROUTES WITH FILES*/
app.post("/auth/register", upload.single("picture"),register); 
app.post("/posts/picture", verifyToken, upload.single("picture"), async (req, res) => {
    try {
    await createPost(req, res);
  } catch (err) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).send({ error: `Unexpected field: ${err.field}` });
    } else {
      console.error(err);
      res.status(500).send({ error: "Failed to create post." });
    }
  }
}); 
app.post("/posts/video", verifyToken, upload.single("video"), async (req, res) => {
  try {
    await createPost(req, res);
  } catch (err) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).send({ error: `Unexpected field: ${err.field}` });
    } else {
      console.error(err);
      res.status(500).send({ error: "Failed to create post." });
    }
  }
});
app.post("/posts/audio", verifyToken, upload.single("audio"), async (req, res) => {
  try {
    await createPost(req, res);
  } catch (err) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).send({ error: `Unexpected field: ${err.field}` });
    } else {
      console.error(err);
      res.status(500).send({ error: "Failed to create post." });
    }
  }
});
app.post("/posts/text", verifyToken, async (req, res) => {
  try {
    await createPost(req, res);
  } catch (err) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).send({ error: `Unexpected field: ${err.field}` });
    } else {
      console.error(err);
      res.status(500).send({ error: "Failed to create post." });
    }
  }
});


/*ROUTES*/
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/settings",settingsRoutes);
app.use("/notifications",notificationsRoutes);

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "https://sociallobbystack.herokuapp.com", );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


/*Mongoose Setup */
const PORT = process.env.PORT || 6001;
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    app.listen(PORT ,()=> console.log(`Server Listening on PORT: ${PORT}`));
}).catch((error)=> console.log(`${error} did not connect`));


