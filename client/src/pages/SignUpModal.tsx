import React, { FunctionComponent, useState } from 'react';
import CommonModal from '../components/organisms/Modal';

const SignUpModal: FunctionComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);

    const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

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
                <p><a href='/' className="no-account">Don<span>&#39;</span>t have an account?</a></p>
            </div>
        </div>}/>
    );
  }

export default SignUpModal;
