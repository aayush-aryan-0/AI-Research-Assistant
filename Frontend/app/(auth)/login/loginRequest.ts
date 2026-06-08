import { isAxiosError } from "axios";
import api from "../../lib/api/api";
import UserLoginRequest from "./types/UserLoginRequest.type";
import APIResponse from "@/app/types/APIResponse.types";
const loginRequest= async (userLoginRequest:UserLoginRequest):Promise<APIResponse>=>{
    try{ 
        const response=await api.post("/login", userLoginRequest);
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
export default loginRequest;