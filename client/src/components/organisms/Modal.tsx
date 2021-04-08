import React, { FunctionComponent } from 'react';
import { Modal } from 'react-bootstrap';
interface Props {
  show: boolean;
  handleClose(): void;
  children: React.ReactNode;
  class: string;
  header?: React.ReactNode;
  customClose?: boolean;
}

const CommonModal: FunctionComponent<Props> = (props: Props) => {
  return (
    <Modal show={props.show} onHide={props.handleClose} centered={true} className={props.class} dialogClassName="border-radius-12">
      <Modal.Header closeButton={!props.customClose} className={`${props.class}-header`} >{props.header}{props.customClose && <i onClick={props.handleClose} className={`bi bi-x ${props.class}-header close`}></i>}</Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

export default CommonModal;
