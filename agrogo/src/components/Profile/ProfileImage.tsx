import { getAuth } from "firebase/auth";
import "../../stylesheets/ProfileImage.css"
import axios from "axios";
import { useEffect, useState } from "react";

function ProfileImage() {
    const [profileImage, setProfileImage] = useState("../../src/assets/icons/profile-icon-549227.svg");

    async function getUserProfileImage() {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if(!user) {
                console.error("No authenticated user found");
                return;
            }

            // Get the firebase ID token (used for bearer authentication)
            const token = await user.getIdToken();

            // Call the backend API route that finds the user's profile info
            const res = await axios.get(
                "https://backend.agrogodev.workers.dev/api/user/user",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": 'application/json'
                    }
                }
            );

            console.log(res);

            const profileImage = res.data.data[0].profileImage;

            if(profileImage) setProfileImage(profileImage);

        } catch(err) {
            console.error("Error fetching profile image:", err);
        }
    }

    useEffect(() => {
        getUserProfileImage();
    }, []);

    return (
        <div className="profile-image-container">
            <img className="profile-image-display" src={profileImage}></img>
        </div>
    )
}

export default ProfileImage;