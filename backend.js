const express = require("express");
const jwt = require("jsonwebtoken");
const {middleware} = require("./middleware")
const {todoModel,userModel} = require("./model")

const app = express();
app.use(express.json())

//let todos_count = 1;
//let user_count = 1;


app.post("/signup",async (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // const userExists = USER.find(u => u.username === username);
    const existingUser = await userModel.findOne({
        username: username,
    })
    if(existingUser){
        res.status(403).json({
            message: "User with this username already exists"
        })
        return;
    }
    const newUser = await userModel.create({
        username: username,
        password: password
    })
    res.json({
        id: newUser._id
    })
})

app.post("/signin",async (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    //const userExists = USER.find(u => u.username === username && u.password === password);
    const userExists = await userModel.findOne({
        username: username,
        password: password
    });
    if(!userExists){
        res.status(403).json({
            message: "Incorrect credentials"
        })
        return;
    }

    const token = jwt.sign({
        userId: userExists._id
    },"Nitesh123");

    res.json({
        token
    })
})

app.post("/todo", middleware,async (req,res) => {
   const userId = req.userId;
   const title = req.body.title;
   const description = req.body.description;

   const newTodo = await todoModel.create({
        title: title,
        description: description,
        userId: userId
    })

   res.json({
    message: "Todo made"
   })
   //console.log(req.headers);
})

app.delete("/todo/:todoId" ,middleware ,async(req,res) => {
    const userId = req.userId;
    const todoId = req.params.todoId;

    //const doesUserOwnTodo = TODOS.find(t => t.id === todoId && t.userId === userId );

    const deleted = await todoModel.findOneAndDelete({
        _id: todoId,
        userId: userId
    })

    if(deleted){
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

app.get("/todos", middleware,async (req,res) => {
    const userId = req.userId;
    const userTodos = await todoModel.find({
      userId: userId
    });
    res.json({
        todos: userTodos
    })
})
app.listen(3000);