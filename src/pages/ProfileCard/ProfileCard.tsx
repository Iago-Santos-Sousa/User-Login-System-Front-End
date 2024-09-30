import { useState } from "react";
import userImg from "../assets/example-user.jpeg";
import PhotoUpload from "../../components/PhotoUpload";
import { useLogin } from "../../context/AppProvider";
import { userApi } from "../../integrations/user";

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

  //função para converter a imagem em base64
  const blobToBase64 = (blob: Blob): Promise<string | null> => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result.split(",")[1]);
        } else {
          console.error("Unexpected result type:", reader.result);
          resolve(null);
          // Handle ArrayBuffer case (if needed)
        }
      };
      reader.readAsDataURL(blob);
    });
  };

  //função para converter base64 em imagem
  const base64ToBlob = async (b64Data: string): Promise<Blob> => {
    const contentType: string = "image/jpeg";
    const sliceSize: number = 512;

    const byteCharacters = atob(b64Data);
    const byteArrays: BlobPart[] = []; // Change to BlobPart[]

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers: number[] = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

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
    <div className="relative flex flex-col justify-center items-center max-w-[min(80%,450px)] mt-6 mx-auto border-2 border-x-gray-100 rounded-md pb-6">
      <div className="w-full background-element bg-prymaryBlueDark h-[150px] rounded-t-md"></div>
      <div className="user-profile-img absolute z-10 top-6 overflow-visible p-2 bg-white border-2 border-prymaryBlueDark rounded-full w-[180px] h-[180px] shadow-2xl right-[50%] translate-x-[50%]">
        {imageBlob !== null ? (
          <img
            src={window.URL.createObjectURL(imageBlob)}
            alt="img-user"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <PhotoUpload handleUpload={handleUpload} clearImage={clearImage} />
        )}
      </div>

      <h3 className="w-full user-name text-center mt-20 text-lg font-bold">
        {user.name}
      </h3>

      <div className="w-full text-center mt-6">
        <button
          className="view-more-btn bg-prymaryBlue rounded-full text-white py-2 px-12 text-base"
          onClick={async () => {
            const result: UserInfos = await userApi().getUser(user.email);
            setUserInfo(result);
          }}
        >
          Ver mais
        </button>
      </div>

      {userInfo && userInfo.name && <p>{userInfo.name}</p>}
    </div>
  );
};

export default ProfileCard;
