import "../../stylesheets/ProfileCreation.css"
import SmallTitle from "../SmallTitle";
import { useState } from 'react';
import axios from "axios";
import { getAuth } from "firebase/auth";

interface ProfileCreationProps {
    onProfileCreated: () => void;
}

function ProfileCreation({ onProfileCreated}: ProfileCreationProps) {

    // saving form data in state to use 
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        location: 'Detroit',
        photoBase64: "",
    });

    // The backend expects a text object, this converts
    // files to the expected format
    const fileToBase64 = async (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    async function syncUserToBackend() {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if(!user) {
                console.error("No authenticated user found");
                return;
            }

            // Get the firebase ID token (used for Bearer authentication)
            const token = await user.getIdToken();
            
            // Call the backend API route this syncs the Firebase
            // data to our D1 database
            const res = await axios.post(
                "https://backend.agrogodev.workers.dev/api/auth/login",
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    location: formData.location,
                    profileImage: formData.photoBase64
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": 'application/json'
                    }
                }
            );

            console.log("Sent user to backend", res.data);

            // Trigger to re-check in the parent
            onProfileCreated();
        } catch(err) {
            console.log("Error syncing user to backend", err)
        }
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // this will sort the form data by the field name, extract the value (user input) and the file (only for photo upload)
        const { name, value, files } = e.target;

        // handling file input separately since it cant use the "value" attribute
        if (name === 'photo' && files && files[0]) {
            const base64String = await fileToBase64(files[0]);
            setFormData(prev => ({
                // this is the "Rest Operator" in js if you want to look up what this means - here, it's allowing us to just submit aany amount of params we want
                ...prev,
                photoBase64: base64String,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // here, we're using FormData object called submissionData for file and text uploads and appending the different fields from user submission
        const submissionData = new FormData();

        submissionData.append('firstName', formData.firstName);
        submissionData.append('lastName', formData.lastName);
        submissionData.append('location', formData.location);
        if (formData.photoBase64) {
            submissionData.append('photo', formData.photoBase64);
        }

        syncUserToBackend();
    };

    return(
        <div className="profile-creation-container">
            <div className="smaller-title"><SmallTitle title="Create your profile"/></div>
            <div className="profile-form-container">
             <form id="profile-form" className="flex-form" onSubmit={handleSubmit}>
                <div className="field"><label htmlFor="firstName">First name:</label>
                <input 
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}>
                </input></div>
                <div className="field"><label htmlFor="lastName">Last name:</label>
                <input 
                    type="text" 
                    id="lastName" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}>
                </input></div>
                <div className="field"><label htmlFor="location">Location:</label>
                <input 
                    type="text" 
                    id="location" 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    readOnly>
                </input></div>
                <div className="field"><label id="image-label" htmlFor="photo">Upload a profile picture:</label>
                <input 
                    type="file" 
                    id="photo" 
                    name="photo"
                    accept="image/*"
                    onChange={handleChange}>
                </input></div>
                <div className="field"><input type="submit" value="Submit"/></div>
            </form>
            </div> 
        </div>
        )
}

export default ProfileCreation;