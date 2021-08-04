import React, { useEffect, useState } from 'react';
import { Route, withRouter } from 'react-router-dom';
import ShopPanelLogo from './ShopPanelLogo';

import { LogInButton } from './Inputs';

import { APIRespondError, getUser, setCredidentials } from './api'
import { TextInput } from './TextInput';

const LoginPanel = (props) => {
    
    const [ fields, setFields ] = useState({ email: "", password: "" });
    const [ error, setError ] = useState();
    const [ waiting, setWaiting ] = useState(false);

    const handleChange = ({target}) => {
        const _fields = fields;
        _fields[target.id] = target.value;
        setFields(_fields);
    }

    const onLogInBtnClick = async () => {
        setWaiting(true);

        const { email, password } = fields;
        setCredidentials(email, password);
        const user = await getUser();

        if(user instanceof Error) {
            setError("Wrong email or password");
        } else if (user === APIRespondError) {
            setError("API does not respond");
        } else {
            props.history.push('/products');
        }

        setWaiting(false);
    }

    const checkIfUserAlreadyLoggedIn = async () => {
        const user = await getUser();
    
        if(!(user instanceof Error) && user !== APIRespondError) {
            props.history.push('/products');
        }
    }

    useEffect(() => {
        checkIfUserAlreadyLoggedIn();
    })

    return (
        <div className="container">
            <div className="d-flex">
                <ShopPanelLogo/>
            </div>
            <hr></hr>
            <div className="form-row">
                <div className="form-group col">
                    <TextInput id="email" text="Email" handleChange={handleChange} placeholder="Email"/>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col">
                    <TextInput id="password" text="Password" handleChange={handleChange} placeholder="Password" password/>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col">
                    <LogInButton waiting={waiting} onLogInBtnClick={onLogInBtnClick}/>
                    <div className="text-danger mt-2">{error}</div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(LoginPanel);