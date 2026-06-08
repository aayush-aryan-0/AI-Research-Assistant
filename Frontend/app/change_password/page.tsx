import UpdatePasswordForm from "./UpdatePasswordForm";
import SkipToDashboardButton from "./SkipToDashboardButton";
export default function UpdatePasswordPage() {
   
    return (
        <div className="flex flex-col items-center justify-center mt-28">
        <UpdatePasswordForm/>
        <SkipToDashboardButton/>
        </div>
    )
}