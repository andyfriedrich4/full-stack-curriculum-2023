import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  Grid,
} from "@mui/material";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'

export default function HomePage() {
  const navigate = useNavigate();

  const {currentUser} = useAuth(); 

  useEffect(() => {
    if(!currentUser) {
      //kick out
      navigate("/login");
    }
    apiPromise(); 
  }, [])

  // State to hold the list of tasks.
  const [tasks, setTasks] = useState([
    // Sample tasks to start with.
    { task: "create a todo app", finished: false },
    { task: "wear a mask", finished: false },
    { task: "play roblox", finished: false },
    { task: "be a winner", finished: true },
    { task: "become a tech bro", finished: true },
  ]);

  // State for the task name being entered by the user.
  const [taskName, setTaskName] = useState("");
  // const backend = process.env.REACT_APP_BACKEND;

  // TODO: Support retrieving your todo list from the API.
  // Currently, the tasks are hardcoded. You'll need to make an API call
  // to fetch the list of tasks instead of using the hardcoded data.
  let apiCall = `http://localhost:4001/tasks/${currentUser.username}`;
  // let apiCall = `http://localhost:4001/tasks/Andy`; 
 

  const apiPromise = () => {
    fetch(apiCall)
    .then((response) => response.json())
    .then((data) => {
      console.log(data); 
      setTasks(data); 
    })
    .catch((error) => {
      console.error("Error: ", error); 
    });
  }




  function addTask() {
    // Check if task name is provided and if it doesn't already exist.
    if (taskName && !tasks.some((task) => task.task === taskName)) {

      // TODO: Support adding todo items to your todo list through the API.
      // In addition to updating the state directly, you should send a request
      // to the API to add a new task and then update the state based on the response.

    const url = `http://localhost:4001/tasks/`;
    const data = {
      user: `${currentUser.username}`,
      task: `${taskName}`,
      finished: false,
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('Response from API:', responseData);
        // Handle the API response here
        setTasks([...tasks, responseData]);
        setTaskName("");
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    } else if (tasks.some((task) => task.task === taskName)) {
      alert("Task already exists!");
    }
  }

  // Function to toggle the 'finished' status of a task.
  function updateTask(name) {
    setTasks(
      tasks.map((task) =>
        task.task === name ? { ...task, finished: !task.finished } : task
      )
    );

    // TODO: Support removing/checking off todo items in your todo list through the API.
    // Similar to adding tasks, when checking off a task, you should send a request
    // to the API to update the task's status and then update the state based on the response.
    const del_task = tasks.find((element) => element.task === name); 
    const url = `http://localhost:4001/tasks/${del_task.id}`;

    console.log(del_task.id)

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if(response.status === 200) {
          console.log("successful deletion");
          // Remove the deleted task from the state
          const updatedTasks = tasks.filter((task) => task.id !== del_task.id);
          setTasks(updatedTasks);
        } else {
          console.error("failed deletion"); 
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    } 
  

  // Function to compute a message indicating how many tasks are unfinished.
  function getSummary() {
    const unfinishedTasks = tasks.filter((task) => !task.finished).length;
    return unfinishedTasks === 1
      ? `You have 1 unfinished task`
      : `You have ${unfinishedTasks} tasks left to do`;
  }

  return (
    <>
      <Header />
      <Container component="main" maxWidth="sm">
        {/* Main layout and styling for the ToDo app. */}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Display the unfinished task summary */}
          <Typography variant="h4" component="div" fontWeight="bold">
            {getSummary()}
          </Typography>
          <Box
            sx={{
              width: "100%",
              marginTop: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Input and button to add a new task */}
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small" // makes the textfield smaller
                  value={taskName}
                  placeholder="Type your task here"
                  onChange={(event) => setTaskName(event.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addTask}
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            {/* List of tasks */}
            <List sx={{ marginTop: 3 }}>
              {tasks.map((task) => (
                <ListItem
                  key={task.task}
                  dense
                  onClick={() => updateTask(task.task)}
                >
                  <Checkbox
                    checked={task.finished}
                  />
                  <ListItemText primary={task.task} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Container>
    </>
  );
}
