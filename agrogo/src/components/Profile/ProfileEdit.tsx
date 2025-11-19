import "../../stylesheets/ProfileEdit.css";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../hooks/UseAuth";
import { Collapse } from "react-bootstrap";
import type { AgroGoUserProfile } from "../../types/UserProfile";
import { GetBearerToken } from "../../utils/GetBearerToken";
import { FileToBase64 } from "../../utils/FileToBase64";
import ProfileImage from "./ProfileImage";

interface ProfileEditProps {
  user: AgroGoUserProfile;
  setUser: React.Dispatch<React.SetStateAction<AgroGoUserProfile>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

function ProfileEdit({ user, setUser, isEditing, setIsEditing }: ProfileEditProps) {
  const { currentUser } = useContext(AuthContext);

  // Holds all the updated user info before submission
  const [editingUser, setEditingUser] = useState({
    firstName: "",
    lastName: "",
    createdAt: "",
    profileImage: "",
    notificationsForBlueAlerts: "",
    notificationsForGreenAlerts: "",
    notificationsForRedAlerts: "",
  });

  useEffect(() => {
    console.log("user data:", user)
    setEditingUser(user);
  }, [user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileString = await FileToBase64(file);

      // Update editingUser immediately with the new image
      setEditingUser((prev) => ({
        ...prev,
        profileImage: fileString, // keep full Data URL
      }));

      // Optional: show it on-screen immediately
      // setUser((prev) => ({
      //   ...prev,
      //   profileImage: fileString,
      // }));

    } catch (err) {
      console.error("Error converting file to base64:", err);
    }
  };

  async function syncUserDataToBackend() {
    try {
      const token = await GetBearerToken();

      const payload = {
        id: currentUser?.uid,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        notificationsForGreenAlerts: user.notificationsForGreenAlerts,
        notificationsForBlueAlerts: user.notificationsForBlueAlerts,
        notificationsForRedAlerts: user.notificationsForRedAlerts,
      };

      await axios.patch(
        "https://backend.agrogodev.workers.dev/api/data/user",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.log("Error syncing user data to the backend:", err);
    }
  }

  return (
    <Collapse in={isEditing}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setUser(editingUser);
          syncUserDataToBackend();
          setIsEditing(false);
        }}
      >
        <h4>Profile Data</h4>

        <div className="profile-image">
          <div id="profile-image-sm"><ProfileImage profileImage={editingUser.profileImage} /></div>

          <div>
            <button
              className="profile-image-upload"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("profileImageInput")!.click();
              }}
            >
              Upload Image
            </button>
            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>
        </div>

        <label htmlFor="firstName" className="mt-5">First Name</label>
        <input
          className="name-input"
          type="text"
          id="firstName"
          value={editingUser.firstName}
          onChange={(e) =>
            setEditingUser({ ...editingUser, firstName: e.target.value })
          }
        />

        <label htmlFor="lastName" className="mt-2">Last Name</label>
        <input
          className="name-input"
          type="text"
          id="lastName"
          value={editingUser.lastName}
          onChange={(e) =>
            setEditingUser({ ...editingUser, lastName: e.target.value })
          }
        />

        <h5 className="mt-5">Notification Preferences</h5>
        <div className="alert-preferences">
          <label className="alert-checkbox">
            <span>Informational</span>
            <input
              type="checkbox"
              checked={editingUser.notificationsForBlueAlerts === "Y"}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  notificationsForBlueAlerts: e.target.checked ? "Y" : "N",
                })
              }
            />
          </label>

          <label className="alert-checkbox">
            <span>Task Completion</span>
            <input
              type="checkbox"
              checked={editingUser.notificationsForGreenAlerts === "Y"}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  notificationsForGreenAlerts: e.target.checked ? "Y" : "N",
                })
              }
            />
          </label>

          <label className="alert-checkbox">
            <span>Alert</span>
            <input
              type="checkbox"
              checked={editingUser.notificationsForRedAlerts === "Y"}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  notificationsForRedAlerts: e.target.checked ? "Y" : "N",
                })
              }
            />
          </label>
        </div>

        <button type="submit">Submit</button>
        <button
          onClick={() => {
            setEditingUser(user);
            setIsEditing(false);
          }}
        >
          Cancel
        </button>
      </form>
    </Collapse>
  );
}

export default ProfileEdit;
