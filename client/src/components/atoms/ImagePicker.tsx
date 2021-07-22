import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { Area } from "react-easy-crop/types";
import Cropper from "react-easy-crop";
import Dropzone from "react-dropzone";
import Slider from "@material-ui/core/Slider";

import ImageList from "./ImageList";
import WarningBox from "./WarningBox";

interface Props {
    onImageChange(url: string): void;
    onUploadImg(data: string): void;
    onCroppedAreaChange(area: Area): void;
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
    const [cropFieldHeight, setCropFieldHeight] = useState(0);
    const [cropFieldWidth, setCropFieldWidth] = useState(0);
    const cropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cropRef.current) {
            setCropFieldHeight(cropRef.current.offsetHeight);
            setCropFieldWidth(cropRef.current.offsetWidth);
        }
    }, [cropRef]);

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
                    props.onUploadImg(imgStr);
                }
            },
            false
        );
        fileReader.readAsDataURL(file);
    };

    const clearImage = () => {
        props.onUploadImg("");
        props.onImageChange("");
    };

    const changeZoom = (amount: number) => {
        if (zoom + amount > 10 || zoom + amount < 1) return;
        setZoom(zoom + amount);
    };
    const onCropComplete = useCallback(async (croppedArea: Area, croppedAreaPixels: Area) => {
        props.onCroppedAreaChange(croppedAreaPixels);
    }, []);
    const triggerWarning = (text: string) => {
        setWarningText(text);
        setTimeout(() => {
            setWarningText("");
        }, 4000);
    };
    const imgInView = props.selected !== "" || props.uploadedImg !== "";
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
                {props.selected.length ? (
                    <img src={props.selected} />
                ) : (
                    <div className={props.isErroneous ? "error" : "unselected"} ref={cropRef} id="cropField">
                        {props.uploadedImg !== "" ? (
                            <Cropper
                                image={props.uploadedImg}
                                crop={crop}
                                zoom={zoom}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                maxZoom={10}
                                cropSize={{
                                    height: cropFieldHeight,
                                    width: cropFieldWidth
                                }}
                                showGrid={false}
                            />
                        ) : (
                            <Dropzone onDrop={handleOnDrop} multiple={false}>
                                {({ getRootProps, getInputProps }) => (
                                    <div className="imagepicker-dropzone" {...getRootProps()}>
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
            <div className={props.uploadedImg === "" ? "imagepicker-hidden" : "imagepicker-crop-controls"}>
                <button className="btn imagepicker-minus" onClick={() => changeZoom(-0.1)}>
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
                <button className="btn imagepicker-plus" onClick={() => changeZoom(0.1)}>
                    <i className="bi bi-plus"></i>
                </button>
            </div>
            {props.images.length > 1 && (
                <ImageList selected={props.selected} images={props.images} onImageChange={props.onImageChange} />
            )}
        </div>
    );
};

export default ImagePicker;
