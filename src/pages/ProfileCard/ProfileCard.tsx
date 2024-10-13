import { useState } from "react";
import { Link } from "react-router-dom";
import userImg from "../assets/example-user.jpeg";
import userAvatar from "../../assets/user-avatar.svg";
import PhotoUpload from "../../components/PhotoUpload";
import { useLogin } from "../../context/AppProvider";
import { userApi } from "../../integrations/user";
import { blobToBase64, base64ToBlob } from "../../utils/otherUtils";

interface UserInfos {
  email: string;
  name: string;
  userId: number;
}

const ProfileCard = () => {
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [image64, setImage64] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfos>({
    email: "",
    name: "",
    userId: 0,
  });
  const { user } = useLogin();

  const handleUpload = async (blob: Blob) => {
    const photo = await blobToBase64(blob);
    setImageBlob(blob);
    setImage64(photo);
  };

  const clearImage = () => {
    setImageBlob(null);
  };

  // console.log(imageBlob);
  // console.log(image64);

  return (
    <div className="profile-card relative flex flex-col justify-center items-center max-w-[min(80%,450px)] mx-auto border-2 border-x-gray-100 rounded-md pb-6">
      <div className="w-full background-element bg-prymaryBlueDark h-[150px] rounded-t-md"></div>
      <div className="user-profile-img absolute z-10 top-6 overflow-visible p-2 bg-white border-2 border-prymaryBlueDark rounded-full w-[180px] h-[180px] shadow-2xl right-[50%] translate-x-[50%]">
        {/* {imageBlob !== null ? (
          <img
            src={window.URL.createObjectURL(imageBlob)}
            alt="img-user"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <PhotoUpload handleUpload={handleUpload} clearImage={clearImage} />
        )} */}

        <img
          src={userAvatar}
          alt="img-user"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <h3 className="w-full user-name text-center mt-20 text-lg font-bold">
        {user.name}
      </h3>

      <div className="w-full text-center mt-6">
        <Link to={"user-details"}>
          <button
            className="view-more-btn bg-prymaryBlue rounded-full text-white py-2 px-12 text-base"
            onClick={async () => {
              const result: UserInfos = await userApi().getUser(user.email);
              setUserInfo(result);
            }}
          >
            Ver mais
          </button>
        </Link>
      </div>

      {userInfo && userInfo.name && <p>{userInfo.name}</p>}
    </div>
  );
};

export default ProfileCard;
