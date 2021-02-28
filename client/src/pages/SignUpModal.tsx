import React, { useState } from 'react';
import { useApolloClient } from "@apollo/client";
import { useDispatch } from "react-redux";

import CommonModal from '../components/organisms/CommonModal';

function SignUpModal() {
    
    const client = useApolloClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const dispatch = useDispatch();
  
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
    const modalTitle = "Modal Title";
    return (
        <CommonModal modalTitle={modalTitle} body={
            <form onSubmit={handleClick}>
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
        </form>}/>
    );
  }
  
export default SignUpModal;

