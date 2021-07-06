import { gql, useMutation } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import UploadThumbnailService from "../../../client/src/services/upload-thumbnail";

// const UPLOAD = gql`
//   mutation uploadRequestGroupThumbnail($file: Upload!) {
//     uploadRequestGroupThumbnail(file: $file) {
//       url
//     }
//   }
// `;

const FileUploadTest: FunctionComponent = () => {
  const [thumbnail, setThumbNail] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
//   const [uploadFile] = useMutation(UPLOAD, {
//     onCompleted: (data) => console.log(data),
//   });
//   const handleFileChange = (e) => {
//     const file = e.target.file[0];
//     if (!file) return;
//     uploadFile;
//   };

  // updates state with resume pdf file
  const uploadThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files != null) {
      setThumbNail(e.target.files[0]);
    }
  };

  const saveThumbnail = () => {
    UploadThumbnailService.upload(thumbnail, description);
  };
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  return (
    <div>
      <form>
        <input onChange={handleOnChange} />
        <input
          type="file"
          name="request-group-thumbnail"
          onChange={uploadThumbnail}
        />
        <button type="button" onClick={saveThumbnail}>
          submit
        </button>
      </form>
    </div>
  );
};

export default FileUploadTest;
