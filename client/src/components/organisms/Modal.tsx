import React, { FunctionComponent } from 'react';
import { Modal } from 'react-bootstrap';
interface Props {
  show: boolean;
  handleClose(): void;
  children?: React.ReactNode;
  className?: string;
  body?: React.ReactNode;
  header?: React.ReactNode;
  headerText?: string;
  customClose?: boolean;
  size?: "small" | "medium" | "large" | "default";
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
    // <Modal show={props.show} onHide={props.handleClose} centered={true} className={"common-modal " + props.class} size={props.size === "default" ? undefined : modalSize} >
    //     <Modal.Header closeButton={!props.customClose} className={`${props.class}-header` + (props.size === "default" ? "" : `-${props.size}`)} >{props.header}{props.customClose && <i onClick={props.handleClose} className={`bi bi-x ${props.class}-header close` + (props.size === "default" ? "" : ` ${props.size}`)}></i>}</Modal.Header>
    //     <Modal.Body className={`${props.class}-body`} >{props.children}</Modal.Body>
    //     <Modal.Footer />
    // </Modal>
    <Modal className={"common-modal " + props.className} show={props.show} onHide={props.handleClose} centered={true} >
      <div >
        {/* <Modal.Header closeButton={!props.customClose} className='common-modal-header' > */}
        <Modal.Header closeButton className='common-modal-header'>
          {/* {props.header}{props.customClose && <i onClick={props.handleClose} className="bi bi-x"></i>} */}
          
          {props.header}
          {/* <i onClick={props.handleClose} className="bi bi-x close-button"></i> */}
        </Modal.Header>
        <Modal.Body className="common-modal-body" >{props.children}</Modal.Body>
        {/* <Modal.Footer /> */}
      </div>
    </Modal>
  );
}

export default CommonModal;
