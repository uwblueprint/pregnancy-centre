import './style/Modal.scss';
import React, { FunctionComponent } from 'react';
import { Modal } from 'react-bootstrap';

import tpcLeaf from '../../assets/tpc-leaf.png';

interface Props {
  title: string;
  show: boolean;
  handleClose(): void;
  body: React.ReactElement<any>;
}

const CommonModal: FunctionComponent<Props> = (props: Props) => {
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
        {props.body}
      </Modal.Body>
      <Modal.Footer>
      </Modal.Footer>
    </Modal>
  );
}

export default CommonModal;
