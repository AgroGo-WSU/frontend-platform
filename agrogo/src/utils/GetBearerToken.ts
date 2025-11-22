import { getAuth } from "firebase/auth";

export async function GetBearerToken() {
    const auth = getAuth();
    const user = auth.currentUser;

    if(!user) {
      throw new Error("No authenticated user found");
    }

    return await user.getIdToken();
  }