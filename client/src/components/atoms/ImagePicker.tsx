import React, { FunctionComponent, useState } from "react";
import ImageList from "./ImageList";

import Cropper from "react-easy-crop"

import Dropzone from 'react-dropzone';

interface Props {
  onImageChange(url: string): void;
  images: string[];
  selected: string;
  isErroneous: boolean;
}

const ImagePicker: FunctionComponent<Props> = (props: Props) => {
  const [imgSrc, setImageSrc] = useState<any>(null);
  const [crop, setCrop] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(2);
  const { selected, images, onImageChange, isErroneous } = props;

  const handleOnDrop = (acceptedFiles: any) => {
    // console.log(acceptedFiles);

    const file = acceptedFiles[0];
    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      const res = fileReader.result;
      setImageSrc(res);
      console.log(res);

    }, false);
    fileReader.readAsDataURL(file);
  }

  return (
    <div className="imagepicker">
      <div className={`imagepicker-preview`}>
        {selected.length ? (
          <img src={selected} />
        ) : (
          <div className={isErroneous ? "error" : "unselected"}>
            {imgSrc !== null ?
             <Cropper 
                image={imgSrc}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onZoomChange={setZoom}
              />
            :
            <Dropzone onDrop={handleOnDrop}>
              {({getRootProps, getInputProps}) => (
                  <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>Select an image or upload your own</p>
                  </div>
              )}
            </Dropzone>
            }
          </div>
        )}
      </div>
      <button>reset</button>
      {images.length > 1 && (
        <ImageList
          selected={selected}
          images={images}
          onImageChange={onImageChange}
        />
      )}
    </div>
  );
};

export default ImagePicker;
