import ProfileForm from "./ProfileForm";

export default function ProfilePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 sm:p-8 bg-gray-50 dark:bg-gray-950">
            <div className="w-full max-w-md mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    User Profile
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    View your account information.
                </p>
            </div>
            
            <ProfileForm />
        </div>
    )
}