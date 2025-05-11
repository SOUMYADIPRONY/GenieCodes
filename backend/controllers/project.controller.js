import projectModel from "../models/project.model.js"
import User from "../models/user.model.js"
import * as project from "../services/project.service.js"
import {validationResult} from "express-validator"

export const createProject = async (req, res) => {


    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()})
    }

    try{

        const {name} = req.body
        const loggedInUser = await User.findOne({email: req.user.email})
        
        const userId = loggedInUser._id

        const newProject = await project.createProject({
            name,
            userId
        })

        res.status(201).json({
            message: "Project created successfully",
            project: newProject
        })
    }catch(err){
        console.log(err)
        res.status(400).json({
            message: "Error creating project",
            error: err.message
        })
    }  

 }


export const getAllProject = async(req, res)=>{
    try{
        const loggedIUser = await User.findOne({
            email: req.user.email
        })
        const allUserProjects = await project.getAllProjectByUserId({
            userId: loggedIUser._id
        })

        return res.status(200).json({
            message: "All projects fetched successfully",
            projects: allUserProjects
        })

    }
    catch(err){
        console.log(err)
        res.status(400).json({
            message: "Error fetching projects",
            error: err.message
        })
    }
}

export const addUserToProject = async(req, res)=>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()})
    }

    try{
        const {projectId, users} = req.body

        const loggedInUser = await User.findOne({email: req.user.email})
        
        const updatedProject = await project.addUserToProject({
            projectId,
            users,
            userId: loggedInUser._id
        })

        return res.status(200).json({
            message: "Users added to project successfully",
            project: updatedProject
        })

    }catch(err){
        console.log(err)
        res.status(400).json({
            message: "Error adding user to project",
            error: err.message
        })
    }
}

export const getProjectById = async(req,res)=>{

    const {projectId} = req.params;

    try{
        const project = await projectService.getProjectById({
            projectId
        });
        return res.status(200).json({
            message: "Project fetched successfully",
            project
        })
    }
    catch(err){
        console.log(err)
        res.status(400).json({
            message: "Error fetching project",
            error: err.message
        })
    }
}