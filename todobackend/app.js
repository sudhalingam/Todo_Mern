const express =require("express");
const mongoose =require("mongoose");
const app = express();
app.use(express.json())
//sample in memory storage for todo
// let toDos =[];

//connecting mongo DB
mongoose.connect('mongodb://localhost:27017/todo-app')
.then(()=>{
    console.log("DB Connected");
}).catch((err)=>{
 console.log(err);
})
//creating schema

const todoSchema = new mongoose.Schema({
    title :{
        required:true,
        type : String
    },
    description : String
})
const todModel = mongoose.model('Todo',todoSchema);
//create new todo item
app.post('/todos',async(req,res) =>{
  const { title ,description } =req.body;
//   const newTodos ={
//    id : toDos.length + 1,
//    title,
//    description
//   };
//   toDos.push(newTodos);
//   console.log(toDos)
//   toDos.push(newTodos);
    try{
        const newTodo = new todModel({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo)
    }catch(err){
        console.log(err);
        res.status(500).json({message:error.message})
    } 
})
//get All ITems
app.get('/todos',async(req,res) =>{
    try{
       const todoDatas = await todModel.find();
       res.status(201).json(todoDatas);

    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message})
    }
    })

//Update a todo items
app.put('/todos/:id',async(req,res) =>{
    try{
    const { title ,description} =req.body;
    const id = req.params.id;
    const updatedTodo = await todModel.findByIdAndUpdate(
        id,
        {title,description}
    )
    if(!updatedTodo){
        return res.status(404).json({message:"todo not found"})
    }
    res.json(updatedTodo)
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

//delete items

app.delete('/todos/:id',async(req,res)=>{
try{
    const id = req.params.id
     await todModel.findByIdAndDelete(id);

res.status(200).end();
}catch(err){
    res.status(500).json({message:err.message})
}

})
//server create
const port = 8000;
app.listen(port,()=>{
    console.log(`server Running ${port}`)
})

// app.get('/',(req,res) =>{
//     console.log("hi")
//     res.send("hi")
// })