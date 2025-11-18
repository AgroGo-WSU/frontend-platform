import "../../stylesheets/ProfileEdit.css";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../hooks/UseAuth";
import { Collapse } from "react-bootstrap";
import type { AgroGoUserProfile } from "../../types/UserProfile";
import { GetBearerToken } from "../../utils/GetBearerToken";
import { FileToBase64 } from "../../utils/FileToBase64";

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
    setEditingUser(user);
  }, []);

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
      setUser((prev) => ({
        ...prev,
        profileImage: fileString,
      }));

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
        <h5>Profile Data</h5>
        <button
          className="2"
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

        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          value={editingUser.firstName}
          onChange={(e) =>
            setEditingUser({ ...editingUser, firstName: e.target.value })
          }
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          value={editingUser.lastName}
          onChange={(e) =>
            setEditingUser({ ...editingUser, lastName: e.target.value })
          }
        />

        <div className="alert-preferences">
          <h5 className="mt-2">Notification Preferences</h5>
          <label>
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
            Informational
          </label>

          <label>
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
            Task Completion
          </label>

          <label>
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
            Alert
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
