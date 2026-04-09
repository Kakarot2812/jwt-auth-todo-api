const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://Nitesh_db:Nitesh2812@nitesh1.r9vifji.mongodb.net/todo")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));
// mongoose Schema and model object for evey collection

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    userId: mongoose.Types.ObjectId
});

const userModel = mongoose.model("User", UserSchema);
const todoModel = mongoose.model("Todo", todoSchema);

module.exports = {
    userModel: userModel,
    todoModel: todoModel
}