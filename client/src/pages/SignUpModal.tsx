import './Modal.scss';
import React, { useState } from 'react';
import CommonModal from '../components/organisms/CommonModal';
import { useApolloClient } from "@apollo/client";
import { useDispatch } from "react-redux";


function SignUpModal() {
    const client = useApolloClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const dispatch = useDispatch();
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClick = async (e:any) => { 
        e.preventDefault();
    };

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
    const modalTitle = "Welcome to Employee Login";
    return (
        <CommonModal title={modalTitle} show={show} handleClose={handleClose} body={
            <div>
                <form onSubmit={handleClick}>
                
                <div>
                    <div className="text signup">
                        Email address
                    </div>
                    <input
                        name="email"
                        placeholder="Enter your company email"
                        value={email}
                        className="input-field"
                        onChange={onChangeEmail}
                    />
                </div>
                <div>
                    <div className="text signup">
                        Password
                    </div>
                    <input
                        type="password"
                        name="password"
                        className="input-field"
                        placeholder="Enter your password"
                        value={password}
                        onChange={onChangePass}           
                    />

                </div>
                <button role="link" className="button">
                    Sign In
                </button>
            </form>
            <div>
                <p><a href='http://localhost:3000/' className="no-account">Don<span>&#39;</span>t have an account?</a></p>
            </div>
        </div>}/>
    );
  }
  
export default SignUpModal;

