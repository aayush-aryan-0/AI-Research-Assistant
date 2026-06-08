import UserProfileProp from "./User.type"

type ProfileResponse=
    | {
          success: true;
          profile: UserProfileProp;
      }
    | {
         success: false;
          response: string;
    }
export default ProfileResponse