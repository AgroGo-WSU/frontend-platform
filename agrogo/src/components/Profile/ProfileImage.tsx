import "../../stylesheets/ProfileImage.css";

interface ProfileImageProps {
  profileImage?: string;
}

function ProfileImage({ profileImage }: ProfileImageProps) {
  // Use default image if none provided
  const defaultImage = "../../src/assets/icons/profile-icon-549227.svg";
  const imageSrc = profileImage || defaultImage;

  return (
    <div className="profile-image-container">
      <img className="profile-image-display" src={imageSrc} alt="Profile" />
    </div>
  );
}

export default ProfileImage;