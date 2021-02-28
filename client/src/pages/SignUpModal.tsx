import React, { useState } from 'react';
import { useApolloClient } from "@apollo/client";
import { useDispatch } from "react-redux";

import { Button, Modal } from 'react-bootstrap';

function SignUpModal() {
    
    const client = useApolloClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const dispatch = useDispatch();
  
    const handleClick = async (e: React.ChangeEvent<HTMLInputElement>) => { 
        e.preventDefault();
        //dispatch(register(firstName, lastName, email, password, client ));
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onChangeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    };

    const onChangeLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    }

    const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const onChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }
  
    return (
        
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={() => handleClick}>
                <div>
                    <input
                        name="firstName"
                        placeholder="firstName"
                        value={firstName}
                        onChange={onChangeFirstName}
                    />
                </div>
                <div>
                    <input
                        name="lastName"
                        placeholder="lastName"
                        value={lastName}
                        onChange={onChangeLastName}
                    />
                </div>
                <div>
                <input
                    name="email"
                    placeholder="email"
                    value={email}
                    onChange={onChangeEmail}
                />
                </div>
                <div>
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={password}
                    onChange={onChangePass}           
                />

                </div>
                <button role="link">
                    Register
                </button>
            </form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>

         

    );
  }
  
export default SignUpModal;

