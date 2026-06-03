import ProfileForm from "./ProfileForm";
import BackButton from "@/app/components/Backbutton";
export default function ProfilePage(){

    return(<div className="flex flex-col items-center justify-center gap-5">
            <h1 className="font-bold text-5xl my-5 mb-1 text-shadow-lg text-black dark:text-white">User Profile</h1>
            <ProfileForm/>
            <BackButton/>
        </div> 
        )
}