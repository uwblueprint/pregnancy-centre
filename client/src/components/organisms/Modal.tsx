import React, { FunctionComponent } from 'react';
import { Modal } from 'react-bootstrap';
interface Props {
  show: boolean;
  handleClose(): void;
  children: React.ReactNode;
}

const CommonModal: FunctionComponent<Props> = (props: Props) => {
  return (
    <Modal show={props.show} onHide={props.handleClose} centered={true} className="modal" dialogClassName="border-radius-12">
      <Modal.Header closeButton />
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

export default CommonModal;
