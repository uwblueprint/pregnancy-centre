import React, { FunctionComponent } from "react";
import ImageList from "./ImageList";

interface Props {
    onImageChange(url: string): void;
    images: string[];
    selected: string;
    isErroneous: boolean;
}

const ImagePicker: FunctionComponent<Props> = (props: Props) => {
    const { selected, images, onImageChange, isErroneous } = props;
    return (
        <div className="imagepicker">
            <div className={`imagepicker-preview`}>
                {selected.length ? (
                    <img src={selected} />
                ) : (
                    <div className={isErroneous ? "error" : "unselected"}>Select an image</div>
                )}
            </div>
            {images.length > 1 && <ImageList selected={selected} images={images} onImageChange={onImageChange} />}
        </div>
    );
};

export default ImagePicker;
