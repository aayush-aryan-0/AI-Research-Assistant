import api from "../lib/api/api";
import { signOut } from "next-auth/react";
const logoutRequest = async () => {
    try {
      await api.post("/logout");
      signOut()
    } catch(error) {
      alert(error)
      console.error(error);
      
    }
   

  }
export default logoutRequest