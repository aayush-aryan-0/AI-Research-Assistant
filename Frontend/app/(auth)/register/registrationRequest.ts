import { isAxiosError } from "axios";
import api from "../../lib/api/api";
import UserRegisterRequest from "./types/UserRegisterRequest.type";
import APIResponse from "@/app/types/APIResponse.types";
  const registrationRequest = async (userRegisterRequest:UserRegisterRequest):Promise<APIResponse>=>{
    try{
      const response=await api.post("/register", userRegisterRequest);
      return {
        response:response.data.message,
        success:true
      };
    }
    catch(error:any){
      if(isAxiosError(error)){
        return {
          response:error.response?.data?.detail,
          success:false
        };
      }
      return {
          response:error,
          success:false
        };
    }
  }

export default  registrationRequest