const fs=require('fs').promises
const uuid=require('uuid')

//display task
exports.displayTask=async(req,res)=>{  
    try{
        const id=req.user.id;
        let data=await fs.readFile("./data/task.json","utf-8")
        data=JSON.parse(data)
        const task = data.filter(t=> t.userId === id);
        if (!task) {
        return res.status(200).json({status:false, message: "tasks not found" });
        }
        res.send(task)
    }
    catch(err)
    {
        res.status(500).json({message:"Server error", error:err.message })
    }

}

//Create Task Controller
exports.createTask=async(req,res)=>{
    try{
        let {title,description,status,priority,dueDate}=req.body;  
        if(!title || !description || !status || !priority || !dueDate)
            return res.status(200).json({status:false,message:'All fields are required.'});

        let data=await fs.readFile("./data/task.json","utf-8")
        data=JSON.parse(data)

        const id=uuid.v4()
        const newTask={
            id,
            userId:req.user.id,
            title, 
            description,
            status ,
            priority ,
            dueDate,
            createdAt:new Date().toISOString(),
        }
        data.push(newTask)
        await fs.writeFile ("./data/task.json",JSON.stringify(data,null,2))
        res.status(201).json({status:true,message:"task created successfully.", id:id})
    }
    catch(err)
    {
        res.status(500).json({sttus:false,message:"Server error", error:err.message })
    }
}

//Search by Id
exports.searchById = async (req, res) => {
  try {
    const id = req.params.id;
    const uId = req.user.id;

    let data = await fs.readFile("./data/task.json", "utf-8");
    data = JSON.parse(data);
    let userTasks = data.filter(t => t.userId === uId);

    if (!userTasks || userTasks.length === 0) {
      return res.status(200).json({ status: false, message: "tasks not found" });
    }

    let task = userTasks.find(t => t.id === id);

    if (!task) {
      return res.status(200).json({ status: false, message: "task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
};

//Update by Id
// exports.updateTask = async (req, res) => {
//     try {
//     const id = req.params.id;
//     const uId = req.user.id
//     let data = await fs.readFile("./data/task.json", "utf-8");
//     data = JSON.parse(data);
//         let userTasks = data.filter( t=> t.userId === uId);
//         if (!userTasks || userTasks.length === 0) {
//             return res.status(200).json({ status: false, message: "task not found" });
//         }
//         let task = userTasks.find(t => t.id === id);
//         if (!task) {
//         }
//         // if (req.body.title) task.title = req.body.title;
//         // if (req.body.description) task.description = req.body.description;
//             if (req.body.status) task.status = req.body.status;
//             if (req.body.priority) task.priority = req.body.priority;
//             if (req.body.dueDate) task.dueDate = req.body.dueDate;
            
//          await fs.writeFile("./data/task.json", JSON.stringify(task, null, 2));
//         return res.json({ status: true, message: "task updated successfully.", id: id });
//     }
    
//     catch (err) {
//     res.status(500).json({ status: false, message: "Server error", error: err.message });
//   }
// }


//Update by Id
exports.updateTask = async (req, res) => {
    try {
    const id = req.params.id;
    const uId = req.user.id;
    let data = await fs.readFile("./data/task.json", "utf-8");
    data = JSON.parse(data);
    // res.send(data)
    let updateIndex=data.findIndex(t=>t.id===id)
    if(updateIndex===-1)
    {
         return res.status(200).json({ status: false, message: "task not found" });
    }
    let task=data[updateIndex]
    if(req.body.status) task.status=req.body.status
    if(req.body.priority) task.priority=req.body.priority
    data[updateIndex]=task
    await fs.writeFile("./data/task.json", JSON.stringify(data, null, 2));
    return res.json({ status: true, message: "task updated successfully.", id: id });

    }
    catch (err) {
        res.status(500).json({ status: false, message: "Server error", error: err.message });
    }

}

//Delete by Id
// exports.deleteTask = async (req, res) => {
//     try {
//     const id = req.params.id
//     const uId = req.user.id
    
//     let data = await fs.readFile("./data/task.json", "utf-8");
//     data=JSON.parse(data)
//     let userTasks = data.filter(t => t.userId === uId);
//     if (!userTasks || userTasks.length === 0) {
//         return res.status(200).json({ status: false, message: "task not found" });
//     }
//     var removeIndex = userTasks.map(function (task) {
//     return task.id;
//     }).indexOf(id);
//     if (removeIndex === -1) {
//     return res.status(200).json({ status: false, message: "task not found" });;
//     } else {
//         userTasks.splice(removeIndex, 1);
//         await fs.writeFile("./data/task.json", JSON.stringify(userTasks, null, 2));
//         return res.json({ status: true, message: "task deleted successfully.", id: id });
//     }
//     }
//     catch (err) {
//         res.status(500).json({ status: false, message: "Server error", error: err.message });
//     }
// }

exports.deleteTask = async (req, res) => {
    try {
    const id = req.params.id
    const uId = req.user.id
    
    let data = await fs.readFile("./data/task.json", "utf-8");
    data=JSON.parse(data)

    let removeIndex=data.findIndex(t=>t.id===id && t.userId===uId)
    if(removeIndex===-1){
    return res.status(200).json({ status: false, message: "task not found" });;
    }
    else{
        data.splice(removeIndex,1)
        await fs.writeFile("./data/task.json", JSON.stringify(data, null, 2));
        return res.status(200).json({ status: true, message: "task deleted successfully.", id: id });
    }

    }
    catch (err) {
        res.status(500).json({ status: false, message: "Server error", error: err.message });
    }
}




