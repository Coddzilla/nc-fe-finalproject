/* eslint-disable complexity */
import React, { Component } from 'react';
import { Link } from '@reach/router';
import { navigate } from '@reach/router';
import { getLoginDetails, addUser } from './api';
import { Alert } from 'react-bootstrap';

function validate( username, password ) {
    return {
        username: username.length === 0,
        password: password.length === 0
    };
}

export default class Home extends Component {
    state = {
        showRegistration: false,
        userSignedIn: false,
        username: '',
        password: '',
        registerUsername: '',
        registerPassword: '',
        users: [],
        signInError: '',
        newUserError: ''
    };

    render() {
        const errors = validate( this.state.username, this.state.password );
        const isDisabled = Object.keys( errors ).some( x => errors[ x ] );
        const errors1 = validate(
            this.state.registerUsername,
            this.state.registerPassword
        );
        const isDisabled1 = Object.keys( errors1 ).some( x => errors1[ x ] );
        return (
            <div className="font">
                {!this.state.userSignedIn && (
                    <form onSubmit={this.handleSubmit} className="container">
                        <input
                            type="text"
                            placeholder="Username"
                            value={this.state.username}
                            onChange={this.handleUsernameChange}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            required
                        />
                        <button disabled={isDisabled}>Login</button>
                        <p>
                            Haven't got an account? Register
                            <Link to={'/'} onClick={this.handleRegister}>
                                {' '}
                                here.
                            </Link>
                        </p>
                    </form>
                )}
                {this.state.signInError !== '' && (
                    <Alert variant="danger">{this.state.signInError}</Alert>
                )}
                {this.state.showRegistration && !this.state.userSignedIn && (
                    <form
                        onSubmit={this.handleSubmit1}
                        className="modal-content animate"
                    >
                        <input
                            type="text"
                            placeholder="Username"
                            value={this.state.registerUsername}
                            onChange={this.handleUsernameRChange}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={this.state.registerPassword}
                            onChange={this.handlePasswordRChange}
                            required
                        />
                        <button disabled={isDisabled1}>Register</button>
                    </form>
                )}
                {this.state.newUserError !== '' && (
                    <Alert variant="danger">{this.state.newUserError}</Alert>
                )}
            </div>
        );
    }

    handleUsernameChange = event => {
        this.setState( { username: event.target.value, signInError: '' } );
    };

    handlePasswordChange = event => {
        this.setState( { password: event.target.value, signInError: '' } );
    };

    handleUsernameRChange = event => {
        this.setState( {
            registerUsername: event.target.value,
            newUserError: ''
        } );
    };

    handlePasswordRChange = event => {
        this.setState( {
            registerPassword: event.target.value,
            newUserError: ''
        } );
    };

    handleRegister = () => {
        this.setState( { showRegistration: true } );
    };

    handleSubmit = event => {
        if ( !this.canBeSubmitted() ) {
            event.preventDefault();
            return;
        } else {
            event.preventDefault();
            getLoginDetails( {
                username: this.state.username,
                password: this.state.password
            } )
                .then( () => {
                    this.setState( { userSignedIn: true } );
                    navigate( '/dashboard' );
                } )
                .catch( () => {
                    this.setState( {
                        signInError: 'Invalid username and/or password'
                    } );
                } );
        }
    };

    canBeSubmitted() {
        const errors = validate( this.state.username, this.state.password );
        const isDisabled = Object.keys( errors ).some( x => errors[ x ] );
        return !isDisabled;
    }

    handleSubmit1 = event => {
        if ( !this.canBeSubmitted1() ) {
            event.preventDefault();
            return;
        } else {
            event.preventDefault();
            addUser( {
                username: this.state.registerUsername,
                password: this.state.registerPassword
            } )
                .then( () => {
                    this.setState( { userSignedIn: true } );
                    navigate( '/dashboard' );
                } )
                .catch( () => {
                    this.setState( {
                        newUserError: 'Username already exists, please sign in'
                    } );
                } );
        }
    };

    canBeSubmitted1() {
        const errors1 = validate(
            this.state.registerUsername,
            this.state.registerPassword
        );
        const isDisabled1 = Object.keys( errors1 ).some( x => errors1[ x ] );
        return !isDisabled1;
    }
}