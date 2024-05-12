import React, { Component } from "react";
import { Link, useNavigate } from 'react-router-dom';

export const Footer = () => {

	const navigate = useNavigate();
	
	return (


		<footer className="footer mt-auto py-3">
		<div className="container d-flex justify-content-center justify-content-lg-between align-items-center">
		<p className="mb-0">
			Made with <i className="fa fa-heart text-danger" /> by{" "}
			<a href="http://www.4geeksacademy.com">Michael Mirisciotta</a>
		</p>

		<button
			type="button"
			className="btn btn-primary px-2 "
			onClick={() => navigate("/user-log-in")}
		>
			Owner Login
		</button>
		</div>
	</footer>
	);
};