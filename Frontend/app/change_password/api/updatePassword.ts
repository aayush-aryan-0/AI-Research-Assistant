import { isAxiosError } from "axios";
import api from "../../lib/api/api";
import updatePasswordType from "../types/updatePassword.type";
import APIResponse from "@/app/types/APIResponse.types";
  const updatePassword = async (newPassword:updatePasswordType):Promise<APIResponse>=>{
    try{
      const response=await api.patch("/reset_password", newPassword);
      return {
        response:String(response.data.message),
        success:true
      };
    }
    catch(error:unknown){
      if(isAxiosError(error)){
        return {
          response:error.response?.data?.detail,
          success:false
        };
      }
      return {
          response:String(error),
          success:false
        };
    }
  }

export default  updatePassword