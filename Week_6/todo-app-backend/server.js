// Importing required modules
const bodyParser = require("body-parser");
const cors = require("cors");

// Creating an instance of Express
const express = require('express');
const app = express();

// Loading environment variables from a .env file into process.env
require("dotenv").config();

// Importing the Firestore database instance from firebase.js
const db = require("./firebase");
// const auth = require("./firebase"); 
// Firebase Admin Authentication Middleware
const auth = (req, res, next) => {
  try {
    const tokenId = req.get("Authorization").split("Bearer ")[1];
    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        req.token = decoded;
        next();
      })
      .catch((error) => res.status(401).send(error));
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

// Middlewares to handle cross-origin requests and to parse the body of incoming requests to JSON
app.use(cors());
app.use(bodyParser.json());

// Your API routes will go here...

// GET: Endpoint to retrieve all tasks
app.get("/tasks", async (req, res) => {
  try {
    // Fetching all documents from the "tasks" collection in Firestore
    const snapshot = await db.collection("tasks").get();
    
    let tasks = [];
    // Looping through each document and collecting data
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,  // Document ID from Firestore
        ...doc.data(),  // Document data
      });
    });
    
    // Sending a successful response with the tasks data
    res.status(200).send(tasks);
  } catch (error) {
    // Sending an error response in case of an exception
    res.status(500).send(error.message);
  }
});

// GET: Endpoint to retrieve all tasks for a user
app.get("/tasks/:user", auth, async (req, res) => {

  try {
    const user = req.params.user;

    // Fetching all documents from the "tasks" collection in Firestore for the specific user
    const snapshot = await db.collection("tasks").where("user", "==", user).get();

    let tasks = [];
    // Looping through each document and collecting data
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,  // Document ID from Firestore
        ...doc.data(),  // Document data
      });
    });

    // Sending a successful response with the tasks data for the specific user
    res.status(200).send(tasks);
  } catch (error) {
    // Sending an error response in case of an exception
    res.status(500).send(error.message);
  }
});


// POST: Endpoint to add a new task
app.post("/tasks", async (req, res) => {
  try {
    const {user, task, finished} = req.body; 
    const data = {
      user, 
      task, 
      finished
    }
    const addedTask = await db.collection("tasks").add(data);    // You can also add validation for the task data here

    // Sending a successful response with the ID of the newly created task
    res.status(201).send({ id: addedTask.id, 
      ... data,});
  } catch (error) {
    // Sending an error response in case of an exception
    res.status(500).send(error.message);
  }
});

// DELETE: Endpoint to remove a task by ID
app.delete("/tasks/:taskId", async (req, res) => {
  const taskId = req.params.taskId;

  try {
    // Deleting the task document with the provided task ID from the "tasks" collection
    await db.collection("tasks").doc(taskId).delete();

    // Sending a successful response
    res.status(204).send();
  } catch (error) {
    // Sending an error response in case of an exception
    res.status(500).send(error.message);
  }
});

// Setting the port for the server to listen on
const PORT = process.env.PORT || 4001;
// Starting the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});