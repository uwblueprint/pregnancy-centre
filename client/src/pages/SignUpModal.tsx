import './Modal.scss';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import React, { useState } from 'react';
import CommonModal from '../components/organisms/CommonModal';
import { createNewAccount } from '../services/auth';
import { Redirect } from 'react-router-dom';
import { useApolloClient } from "@apollo/client";
import { useDispatch } from "react-redux";

function SignUpModal() {
    const client = useApolloClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [hasOneLowerCase, setHasOneLowerCase] = useState(false);
    const [hasOneUpperCase, setHasOneUpperCase] = useState(false);
    const [hasOneNumber, setHasOneNumber] = useState(false);
    const [hasOneSymbol, setHasOneSymbol] = useState(false);
    const [hasTwelveCharacterMin, setHasTwelveCharacterMin] = useState(false);
    const oneLowerCase= /^(?=.*[a-z])/;
    const oneUpperCase=/^(?=.*[A-Z])/;
    const oneNumber=/^(?=.*[0-9])/;
    const oneSymbol=/^(?=.*[*!@#$%^&(){}[\]:;<>,.?/~_+\-=|\\])/;
    const twelveCharacterMin=/^(?=.{12,})/;
    const initialReq : string[] = ["at least 1 lowercase letter", "at least 1 uppercase letter","at least 1 number","at least 1 symbol","12 characters minimum" ]
    const [requirements, setRequirements] = useState(initialReq);
    const [show, setShow] = useState(true);
    const [redirectToHome, setRedirectToHome] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClick = async (e:any) => { 
        e.preventDefault();
        createNewAccount(email, password);
        setRedirectToHome(true);
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
        const password = e.target.value;
        const copy:string[]= requirements;
        // checks each of the password requirements and updates the array
        if (!oneLowerCase.test(password)) {
            setHasOneLowerCase(false);
            if (!copy.includes("at least 1 lowercase letter")){
                copy.push("at least 1 lowercase letter");    
            }
            setRequirements(copy);
        }else{
            setHasOneLowerCase(true);
            if (copy.includes("at least 1 lowercase letter")){
                const index = copy.indexOf("at least 1 lowercase letter");
                copy.splice(index, 1);  
            }
            setRequirements(copy);
        }

        if (!oneUpperCase.test(password)){
            setHasOneUpperCase(false);
            if (!copy.includes("at least 1 uppercase letter")){
                copy.push("at least 1 uppercase letter");    
            }
            setRequirements(copy);
        }else{
            setHasOneUpperCase(true);
            if (copy.includes("at least 1 uppercase letter")){
                const index = copy.indexOf("at least 1 uppercase letter");
                copy.splice(index, 1);  
            }
            setRequirements(copy);
        }

        if (!oneNumber.test(password)) {
            setHasOneNumber(false);
            if (!copy.includes("at least 1 number")){
                copy.push("at least 1 number");    
            }
            setRequirements(copy);
        }else{
            setHasOneNumber(true);
            if (copy.includes("at least 1 number")){
                const index = copy.indexOf("at least 1 number");
                copy.splice(index, 1);  
            }
            setRequirements(copy);
        }
     
        if (!oneSymbol.test(password)){
            setHasOneSymbol(false);
            if (!copy.includes("at least 1 symbol")){
                copy.push("at least 1 symbol");    
            }
            setRequirements(copy);
        }else{
            setHasOneSymbol(true);
            if (copy.includes("at least 1 symbol")){
                const index = copy.indexOf("at least 1 symbol");
                copy.splice(index, 1);  
            }
            setRequirements(copy);
        }

        if (!twelveCharacterMin.test(password)){
            setHasTwelveCharacterMin(false);
            if (!copy.includes("12 characters minimum")){
                copy.push("12 characters minimum");    
            }
            setRequirements(copy);
        }else{
            setHasTwelveCharacterMin(true);
            if (copy.includes("12 characters minimum")){
                const index = copy.indexOf("12 characters minimum");
                copy.splice(index, 1);  
            }
            setRequirements(copy);
        }
        setPassword(e.target.value);
    }

    const modalTitle = "Create Your Account";
    const subtitle = "Register your email and create a password";

    const popover = (
        <Popover id="popover-basic" show={!hasOneLowerCase || !hasOneUpperCase || !hasOneNumber || !hasOneSymbol || !hasTwelveCharacterMin}>
            <Popover.Title as="h3">Password Requirements</Popover.Title>
            <Popover.Content>
                {
                    requirements.length > 0 ?  
                    <ul>
                        {
                        requirements.map((i) => <li key={i}>{i}</li>)
                        }
                    </ul>
                    :
                    <div className="text signup">Your password meets the requirements!</div>   
                }
            </Popover.Content>
        </Popover>
    );
    if (redirectToHome){
        return (<Redirect to="/test"/>)
    }
    return (
        <CommonModal title={modalTitle} subtitle={subtitle} show={show} body={
            <div>
                <form onSubmit={handleClick}>
                
                <div>
                    <div className="text signup">
                        Email address
                    </div>
                    <input
                        name="email"
                        placeholder="Enter your company email"
                        type="text"
                        value={email}
                        className="input-field"
                        onChange={onChangeEmail}
                    />
                </div>
                <div>
                    <div className="text signup">
                        Password
                    </div>
                
                    <div className="pass-req">
                        <OverlayTrigger placement="bottom" overlay={popover}>
                            <input
                                type="password"
                                name="password"
                                className="input-field"
                                placeholder="Enter your password"
                                value={password}
                                onChange={onChangePass}           
                            />
                        </OverlayTrigger>
                    </div>
                </div>
                <button role="link" className="button" disabled={!hasOneLowerCase || !hasOneUpperCase || !hasOneNumber || !hasOneSymbol || !hasTwelveCharacterMin}>
                    Sign Up
                </button>
            </form>
        </div>}/>
    );
  }
  
export default SignUpModal;

