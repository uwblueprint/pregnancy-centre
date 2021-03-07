import '../../pages/Modal.scss';
import React, { useState } from 'react';
import { useApolloClient } from "@apollo/client";
import { useDispatch } from "react-redux";

import { Button, Modal } from 'react-bootstrap';

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
        {props.body}
      </Modal.Body>
      <Modal.Footer>
      </Modal.Footer>
    </Modal>
  );
}

export default CommonModal;
