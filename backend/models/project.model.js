import mongoose from 'mongoose';


const projectSchema = new mongoose.Schema({

    name:{
        type:String,
        lowercase:true,
        required:true,
        trim:true,
        unique:[true, "Project name already exists"],
    },

    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
        }
    ]
})


const projectModel = mongoose.model("project", projectSchema);

export default projectModel;