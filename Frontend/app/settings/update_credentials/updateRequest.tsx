import { isAxiosError } from "axios";
import api from "../../lib/api/api";
import userUpdate from "./userUpdate.type";
import APIResponse from "@/app/types/APIResponse.types";
  const userUpdateRequest = async (newUser:userUpdate):Promise<APIResponse>=>{
    try{
      const response=await api.put("/user/update_user", newUser);
      return {
        response:response.data.message,
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

export default  userUpdateRequest