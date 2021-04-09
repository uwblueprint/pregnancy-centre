import React, { FunctionComponent } from "react";
import Row from "react-bootstrap/Row";
import ScrollWindow from "./ScrollWindow";

interface Props {
  onImageChange(): void;
  images: string[];
}

const ImageList: FunctionComponent<Props> = (props: Props) => {
  return (
    <div className="imagelist-container">
      <ScrollWindow noBorder>
        <Row noGutters className="imagelist img-grid">
          {props.images.map((url: string) => {
            return (
              <div className="imagelist img-wrapper col-3" key={url}>
                <img
                  onClick={props.onImageChange}
                  className="imagelist img-wrapper img"
                  src={url}
                />
              </div>
            );
          })}
        </Row>
      </ScrollWindow>
    </div>
  );
};

export default ImageList;
