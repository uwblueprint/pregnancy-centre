import '../../pages/Modal.scss';
import { Modal } from 'react-bootstrap';
import React from 'react';
import tpcLeaf from '../../assets/tpc-leaf.png';

function CommonModal(props: any) {
  return (
    <Modal show={props.show} onHide={props.handleClose} centered={true} className="modal">
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <div className="pc-icon">
          <img src={tpcLeaf}></img>
        </div>
        <div className="title">
          {props.title}
        </div>
        <div className="subtitle">
          {props.subtitle}
        </div>
        {props.body}
      </Modal.Body>
      <Modal.Footer>
      </Modal.Footer>
    </Modal>
  );
}

export default CommonModal;
