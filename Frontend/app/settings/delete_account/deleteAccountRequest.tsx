import { isAxiosError } from "axios";
import api from "../../lib/api/api";
import deleteUser from "./deleteUser.type"; 
import APIResponse from "@/app/types/APIResponse.types";
  const deleteAccountRequest = async (payload:deleteUser):Promise<APIResponse>=>{
    try{
      const response=await api.delete("/user/delete_user", {data:payload});
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

export default  deleteAccountRequest