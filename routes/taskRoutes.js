const express=require('express')
const router=express.Router();
const taskController=require('../controllers/taskController')

//
router.get('/displayTask',taskController.displayTask)
router.post('/createTask',taskController.createTask) 

//CURD by id
//GET by id 
router.get('/displayTask/:id',taskController.searchById)
//PUT by id
router.put('/updateTask/:id',taskController.updateTask)
//DELETE by id
router.delete('/deleteTask/:id',taskController.deleteTask)


module.exports=router;
