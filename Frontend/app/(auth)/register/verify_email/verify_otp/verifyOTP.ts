import api from "@/app/lib/api/api";
import APIResponse from "@/app/types/APIResponse.types";
import { isAxiosError } from "axios";
const verifyOTP = async (email: string, otp: string): Promise<APIResponse> => {
    try {
        const response = await api.post("/verify_new_mail", { email:email, otp:otp });
        return { response: response.data, success: true };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            return {
                response: String(error.response?.data?.detail ?? error.response?.data ?? "Request failed"),
                success: false,
            };
        }
        return { response: String(error), success: false };
    }
};
    

export default verifyOTP;