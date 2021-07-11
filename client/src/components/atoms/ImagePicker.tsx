import React, { FunctionComponent, useState } from "react";
import Cropper from "react-easy-crop";
import Dropzone from "react-dropzone";
import ImageList from "./ImageList";
import Slider from "@material-ui/core/Slider";

import WarningBox from "./WarningBox";

interface Props {
    onImageChange(url: string): void;
    onUploadImg(data: string): void;
    images: string[];
    selected: string;
    isErroneous: boolean;
    uploadedImg: string;
}

interface Dimensions {
    width: number;
    height: number;
}

const ImagePicker: FunctionComponent<Props> = (props: Props) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [warningText, setWarningText] = useState("");
    const { selected, images, onImageChange, isErroneous, onUploadImg, uploadedImg } = props;

    const getImageDimensions = async (file: string): Promise<Dimensions> => {
        return new Promise((resolved) => {
            const i = new Image();
            i.onload = () => {
                resolved({ width: i.width, height: i.height });
            };
            i.src = file;
        });
    };
    const handleOnDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file.size > 6000000) {
            triggerWarning("Images must be less than 5MB");
            return;
        }
        if (file.type !== "image/png" && file.type !== "image/jpeg") {
            triggerWarning("Images must be in either JPEG or PNG format");
            return;
        }
        const fileReader = new FileReader();
        fileReader.addEventListener(
            "load",
            async () => {
                const res = fileReader.result;
                let imgStr;
                if (res == null) {
                    imgStr = "";
                } else if (typeof res === "string") {
                    imgStr = res;
                } else {
                    imgStr = res.toString();
                }
                const dimensions = await getImageDimensions(imgStr);
                if (dimensions.width < 600 || dimensions.height < 430) {
                    triggerWarning("Images must be at least 600 x 430 pixels");
                } else {
                    setWarningText("");
                    onUploadImg(imgStr);
                }
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
    const triggerWarning = (text: string) => {
        setWarningText(text);
        setTimeout(() => {
            setWarningText("");
        }, 4000);
    };
    const imgInView = selected !== "" || uploadedImg !== "";
    return (
        <div className="imagepicker">
            {warningText !== "" && <WarningBox text={warningText} />}
            <div className={"imagepicker-preview"}>
                <button
                    className={imgInView ? "btn btn-light imagepicker-trash" : "imagepicker-hidden"}
                    onClick={clearImage}
                >
                    <i className="bi bi-trash"></i>
                </button>
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
                                        <div className="imagepicker-upload-icon">
                                            <i className="bi bi-upload"></i>
                                        </div>
                                        <p className="imagepicker-upload-top-text">Select an image</p>
                                        <p className="imagepicker-upload-bottom-text">or upload your own</p>
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
            {images.length > 1 && <ImageList selected={selected} images={images} onImageChange={onImageChange} />}
        </div>
    );
};

export default ImagePicker;
