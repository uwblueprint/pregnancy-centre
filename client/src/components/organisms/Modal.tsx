import React, { FunctionComponent } from 'react';
import { Modal } from 'react-bootstrap';
interface Props {
  show: boolean;
  handleClose(): void;
  children?: React.ReactNode;
  className?: string;
  body?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const CommonModal: FunctionComponent<Props> = (props: Props) => {
  return (
    <Modal className={"common-modal " + props.className} show={props.show} onHide={props.handleClose} centered={true} >
      <div >
        <Modal.Header closeButton className='common-modal-header'>
          {props.header}
        </Modal.Header>
        <Modal.Body className="common-modal-body" >{props.children}</Modal.Body>
        {props.footer && <Modal.Footer >{props.footer}</Modal.Footer>}
      </div>
    </Modal>
  );
}

export default CommonModal;
