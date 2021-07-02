import React, { FunctionComponent, useState } from "react";
import Cropper from "react-easy-crop";
import Dropzone from "react-dropzone";
import ImageList from "./ImageList";
import Slider from "@material-ui/core/Slider";

interface Props {
    onImageChange(url: string): void;
    onUploadImg(data: string): void;
    images: string[];
    selected: string;
    isErroneous: boolean;
    uploadedImg: string;
}

const ImagePicker: FunctionComponent<Props> = (props: Props) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const { selected, images, onImageChange, isErroneous, onUploadImg, uploadedImg } = props;

    const handleOnDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const fileReader = new FileReader();
        fileReader.addEventListener(
            "load",
            () => {
                const res = fileReader.result;
                let imgStr;
                if (res === null) imgStr = "";
                else if (typeof res === "string") {
                    imgStr = res;
                } else {
                    imgStr = res.toString();
                    console.log(imgStr);
                }
                onUploadImg(imgStr);
                console.log(res);
            },
            false
        );
        fileReader.readAsDataURL(file);
    };

    const clearImage = () => {
        onUploadImg("");
        onImageChange("");
    };

    const changeZoom = (increment: boolean) => {
        if (increment) {
            if (zoom >= 10) return;
            setZoom(zoom + 0.1);
        } else {
            if (zoom <= 1) return;
            setZoom(zoom - 0.1);
        }
    };
    const imgInView = selected !== "" || uploadedImg !== "";
    return (
        <div className="imagepicker">
            <div className={`imagepicker-preview`}>
                {selected.length ? (
                    <img src={selected} />
                ) : (
                    <div className={isErroneous ? "error" : "unselected"} id="cropField">
                        {uploadedImg !== "" ? (
                            <Cropper
                                image={uploadedImg}
                                crop={crop}
                                zoom={zoom}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                maxZoom={10}
                                cropSize={{
                                    height: document.getElementById("cropField")!.offsetHeight,
                                    width: document.getElementById("cropField")!.offsetWidth
                                }}
                                showGrid={false}
                            />
                        ) : (
                            <Dropzone onDrop={handleOnDrop}>
                                {({ getRootProps, getInputProps }) => (
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p>Select an image or upload your own</p>
                                    </div>
                                )}
                            </Dropzone>
                        )}
                    </div>
                )}
            </div>
            <div className={uploadedImg === "" ? "imagepicker-hidden" : "imagepicker-crop-controls"}>
                <button className="btn imagepicker-minus" onClick={() => changeZoom(false)}>
                    <i className="bi bi-dash"></i>
                </button>
                <div className="imagepicker-slider">
                    <Slider
                        value={zoom}
                        aria-labelledby="continuous-slider"
                        min={1}
                        max={10}
                        step={0.1}
                        onChange={(e: React.ChangeEvent<Record<string, unknown>>, zoom: number | number[]) => {
                            if (typeof zoom === "number") setZoom(zoom);
                        }}
                    />
                </div>
                <button className="btn imagepicker-plus" onClick={() => changeZoom(true)}>
                    <i className="bi bi-plus"></i>
                </button>
            </div>
            <button
                className={imgInView ? "btn btn-light imagepicker-trash" : "imagepicker-hidden"}
                onClick={clearImage}
            >
                <i className="bi bi-trash"></i>
            </button>
            {images.length > 1 && <ImageList selected={selected} images={images} onImageChange={onImageChange} />}
        </div>
    );
};

export default ImagePicker;
