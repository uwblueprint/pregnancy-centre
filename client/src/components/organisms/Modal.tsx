import React, { FunctionComponent } from 'react';
import { Modal } from 'react-bootstrap';
interface Props {
  show: boolean;
  handleClose(): void;
  children: React.ReactNode;
  class: string;
  header?: React.ReactNode;
  customClose?: boolean;
  size: "small" | "medium" | "large" | "default";
}



const CommonModal: FunctionComponent<Props> = (props: Props) => {
  let modalSize: "xl" | "sm" | "lg" = "xl"
  switch (props.size) {
    case "small":
      modalSize = "sm";
      break;
    case "medium":
      modalSize = "lg";
      break;
  }

  return (
    <Modal show={props.show} onHide={props.handleClose} centered={true} className={props.class} size={props.size === "default" ? undefined : modalSize} dialogClassName="border-radius-12">
      <Modal.Header closeButton={!props.customClose} className={`${props.class}-header` + (props.size === "default" ? "" : `-${props.size}`)} >{props.header}{props.customClose && <i onClick={props.handleClose} className={`bi bi-x ${props.class}-header close` + (props.size === "default" ? "" : ` ${props.size}`)}></i>}</Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

export default CommonModal;
