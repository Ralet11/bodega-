import { useEffect, useRef } from "react";


export const UploadWidget = ({ setDiscount }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
/* 
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "doyafxwje",
        uploadPreset: "ml_default",
        sources: ["local"], // sources: [ "local", "url"], // restrict the upload sources to URL and local files
        multiple: false,  //restrict upload to a single file
      },
      function (error, result) {
        if (!error && result && result.event === "success") {
          const imageUrl = result.info.secure_url;
          setDiscount((prevUserData) => ({ ...prevUserData, image: imageUrl }));
        } else {
          // console.error("Error al cargar la imagen:", error);
        }
      }
    );
  }, [setDiscount]);

  return (
    <span
      className="h-10 w-fit cursor-pointer shadow shadow-black bg-primaryPink text-black px-9 py-2 rounded-md hover:bg-secondaryColor transition-colors duration-700 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
      onClick={() => widgetRef.current.open()}
    >
      Subir Imagen
    </span>
  ); */
};
