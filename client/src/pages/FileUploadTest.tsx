import React, { FunctionComponent, useState } from "react";
import UploadThumbnailService from "../../../client/src/services/upload-thumbnail";


const FileUploadTest: FunctionComponent = () => {
  const [thumbnail, setThumbNail] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");

  const uploadThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files != null) {
      setThumbNail(e.target.files[0]);
    }
  };

  const saveThumbnail = async () => {
    const img = await UploadThumbnailService.upload(thumbnail, description)
    console.log(img)
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
