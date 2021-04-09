import React, { FunctionComponent } from "react";
import Row from "react-bootstrap/Row";
import ScrollWindow from "./ScrollWindow";

interface Props {
  onImageChange(url: string): void;
  images: string[];
  selected: string;
}

const ImageList: FunctionComponent<Props> = (props: Props) => {
  return (
    <div className="imagelist-container">
      <ScrollWindow noBorder>
        <Row noGutters className="imagelist img-grid">
          {props.images.map((url: string) => {
            return (
              <div className="imagelist img-wrapper col-3" key={url}>
                <div className={"imagelist img-wrapper-overlay"}>
                  <img
                    onClick={() => props.onImageChange(url)}
                    className={
                      "imagelist img-wrapper img" +
                      (props.selected === url && " selected")
                    }
                    src={url}
                  />
                  {props.selected === url && (
                    <div className={"imagelist check"}>
                      <i className="bi bi-check"></i>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </Row>
      </ScrollWindow>
    </div>
  );
};

export default ImageList;
