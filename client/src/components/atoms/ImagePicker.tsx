import React, { FunctionComponent } from "react";
import ImageList from "./ImageList";
import Row from "react-bootstrap/Row";

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
      <Row className="toprow">
        <div className="imagepicker-title">Image</div>
        {isErroneous && !selected.length && (
          <div className="text-error">Please select an image</div>
        )}
      </Row>
      {isErroneous && <i className="bi bi-exclamation-circle alert-icon"></i>}
      <div className={`imagepicker-preview`}>
        {selected.length ? (
          <img src={selected} />
        ) : (
          <div className={isErroneous ? "error" : "unselected"}>
            Select an image
          </div>
        )}
      </div>
      <ImageList
        selected={selected}
        images={images}
        onImageChange={onImageChange}
      />
    </div>
  );
};

export default ImagePicker;
