import React, {useContext, useState, useEffect } from 'react';
import { Context } from "../store/appContext"
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {

	const [click, setClick] = useState(false);
    // const [button, setButton] = useState(true);
    const {isLoggedIn, setIsLoggedIn} = useState(false);
    const navigate = useNavigate();
    const [isMounted, setIsMounted] = useState(false);
    const { store, actions } = useContext(Context);

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<button type="button" className="btn btn-primary" onClick={() => navigate('/customer-signup')}>
						SIGN UP
					</button>
				</div>
			</div>
		</nav>
	);
};
