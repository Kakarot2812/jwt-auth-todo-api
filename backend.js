const express = require("express");
const jwt = require("jsonwebtoken");
const {middleware} = require("./middleware")
const app = express();
app.use(express.json())

let todos_count = 1;
let user_count = 1;

let USER = [];
let TODOS = [];

app.post("/signup", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USER.find(u => u.username === username);
    if(userExists){
        res.status(403).json({
            message: "User with this username already exists"
        })
        return;
    }

    USER.push({
        id: user_count++,
        username,
        password
    })
    res.json({
        id: user_count - 1
    })
})

app.post("/signin", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USER.find(u => u.username === username && u.password === password);
    if(!userExists){
        res.status(403).json({
            message: "Incorrect credentials"
        })
        return;
    }

    const token = jwt.sign({
        userId: userExists.id
    },"Nitesh123")
    res.json({
        token
    })
})

app.post("/todo", middleware,(req,res) => {
   const userId = req.userId;
   const title = req.body.title;
   const description = req.body.description;

   TODOS.push({
    id: todos_count++,
    title,
    description,
    userId
   })

   res.json({
    message: "Todo made"
   })
   //console.log(req.headers);
})

app.delete("/todo/:todoId" ,middleware ,(req,res) => {
    const userId = req.userId;
    const todoId = parseInt(req.params.todoId);

    const doesUserOwnTodo = TODOS.find(t => t.id === todoId && t.userId === userId );

    if(doesUserOwnTodo){
        TODOS = TODOS.filter(t => t.id === todoId);
        res.json({
         message: "Deleted"
        })
    }
    else{
        res.json({
            message : "Either todo doesn't exist or this is not your todo"
        })
    }
})

app.get("/todos", middleware, (req,res) => {
    const userId = req.userId;
    const userTodos = TODOS.filter(t => t.userId === userId);
    res.json({
        todos: userTodos
    })
})
app.listen(3000);