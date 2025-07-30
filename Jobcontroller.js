import jobmodel from "../models/jobsmodel.js";
import usermodel from "../models/usermodel.js";

export const postjob=async(req,res)=>{
    try {
        const adminid=req.params.adminid;
        if(!adminid){
            return res.status(400).json({error:'admin id is required'});
        }

        const {title,description,location,type,minsalaryrange,maxsalaryrange,requiredexperience,company,shifts}=req.body;
        if(!title,!description,!location,!type,!minsalaryrange,!maxsalaryrange,!requiredexperience,!company,!shifts){
            return res.status(400).json({error:'all fields are required'});
        }

        const adminuser=await usermodel.findById(adminid);
        if(!adminuser){
            return res.status(404).json({error:'admin user not found'});
        }
        if(adminuser.isadmin!==true){
            return res.status(400).json({error:'only admin can post jobs'});
        }
        const newjob=new jobmodel({...req.body,userid:adminid});
        await newjob.save();
        return res.status(200).json({message:"job posted successfully",job:newjob});

    } catch (error) {
        return res.status(500).json({error:'internal server error'+error.message});
    }
}

export const getalljobs=async(req,res)=>{
    try {
        const jobs=await jobmodel.find();
        return res.status(200).json({message:"jobs fetched successfully",jobs:jobs})
    } catch (error) {
         return res.status(500).json({error:'internal server error'+error.message});
    }
}

export const getjobbyid=async(req,res)=>{
    try {
        const id=req.params.id;
        if(!id){
            return res.status(400).json({error:"id missing in params"})
        }
        let job=await jobmodel.findById(id)
        if(!job){
            return res.status(404).json({error:"job not found"})
        }
        return res.status(200).json({message:"job fetched",job:job})
    } catch (error) {
         return res.status(500).json({error:'internal server error'+error.message});
    }
}