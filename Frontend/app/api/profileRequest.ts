import api from "@/app/lib/api/api";
import { isAxiosError } from "axios";
import ProfileResponse from "../types/ProfileResponse.type";
const profileRequest= async ():Promise<ProfileResponse>=>{
    try{
      const response=await api.get("/user/profile/");
      
      return {
        profile:response.data,
        success:true
      }
    }
    catch(error:unknown){
      if(isAxiosError(error)){
        return {
        response:error.response?.data?.detail,
        success:false
      }
      }
      return {
        response:String(error),
        success:false
      }
    
    }
  
  }
export default profileRequest