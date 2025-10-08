import "../../stylesheets/ProfileCreation.css"
import SmallTitle from "../SmallTitle";
import { useState } from 'react';
import axios from "axios";

function ProfileCreation() {

    // saving form data in state to use 
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        location: '',
        photo: null as File | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // this will sort the form data by the field name, extract the value (user input) and the file (only for photo upload)
        const { name, value, files } = e.target;

        // handling file input separately since it cant use the "value" attribute
        if (name === 'photo' && files) {
            setFormData(prev => ({
                // thi sis the "Rest Operator" in js if you want to look up what this means - here, it's allowing us to just submit aany amount of params we want
                ...prev,
                photo: files[0],
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
            if (formData.photo) {
                submissionData.append('photo', formData.photo);
            }

        // actual post request
        axios.post('https://example/api/for/user', submissionData)
            .then(response => {
                console.log('Submitted!', response.data);
            })
            .catch(err => {
                console.error('Error, womp womp :( ', err);
            });
        };

    return(
        <div className="profile-creation-container">
            <SmallTitle title="Create your profile"/>
            <div className="profile-form-container">
             <form id="profile-form" className="flex-form" onSubmit={handleSubmit}>
                <div className="field"><label htmlFor="first-name">First name:</label>
                <input 
                    type="text"
                    id="first-name"
                    name="first-name"
                    value={formData.firstName}
                    onChange={handleChange}>
                </input></div>
                <div className="field"><label htmlFor="last-name">Last name:</label>
                <input 
                    type="text" 
                    id="last-name" 
                    name="last-name"
                    value={formData.lastName}
                    onChange={handleChange}>
                </input></div>
                <div className="field"><label htmlFor="location">Location:</label>
                <input 
                    type="text" 
                    id="location" 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}>
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