import api from "@/app/lib/api/api";
import APIResponse from "@/app/types/APIResponse.types";
import { isAxiosError } from "axios";
const sendEmailOTP=async(email:string):Promise<APIResponse>=>{
    try{
        const response=await api.post("/send_mail",{email:email});
        console.log(response)
            console.log(response?.data)
            console.log(response?.data?.message)

        return{
            response:response.data.message,
            success:true
        }
    }
    catch(error:unknown){
        console.error("raw error"+error)
        if(isAxiosError(error)){
            console.error("not raw error"+error.response?.data?.detail)
            return{
                response: error.response?.data?.detail,
                success:false
            }
        }
        else{
            return{
                response:String(error),
                success:false
            }
        }
    }
}
    

export default sendEmailOTP;