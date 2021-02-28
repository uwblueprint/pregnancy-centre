import '../../pages/Modal.scss';
import React, { useState } from 'react';
import { useApolloClient } from "@apollo/client";
import { useDispatch } from "react-redux";

import { Button, Modal } from 'react-bootstrap';

function CommonModal(props: any) {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return ( 
            <Modal show={show} onHide={handleClose} centered={true} className="modal">
                <Modal.Header closeButton>
                </Modal.Header>
                <div className="pc-icon"><img src="TPC_leaf.png"></img></div>
                <Modal.Title>{props.modalTitle}</Modal.Title>
                <Modal.Body>
                    {props.body}
                </Modal.Body>
            </Modal>
    );
  }
  
export default CommonModal;

