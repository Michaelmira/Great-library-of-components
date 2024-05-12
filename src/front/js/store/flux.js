const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
            isLoggedIn: false,
			customers: [],
            customerId: undefined,
			token: undefined,
            sessionStorageChecked: !!sessionStorage.getItem("token")
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			checkIfTokenInSessionStorage: () => {
				if (sessionStorage.getItem("token")) {
					setStore({
						token: sessionStorage.getItem("token")
					});
				};
				setStore({
					sessionStorageChecked: true
				});
			},

            logInUser: async (user) => {
                const response = await fetch(
                    process.env.BACKEND_URL + "/api/user/login", {
                    method: "POST",
                    body: JSON.stringify({ email: user.email, password: user.password }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
                );
                if (response.status !== 201) return false;
                const responseBody = await response.json();
                setStore({
                    token: responseBody.access_token,
                    isLoggedIn: true
                });
                sessionStorage.setItem("token", responseBody.access_token);

                return true;
            },

            logUserOut: () => {
                setStore({
                    token: undefined,
                    customerId: undefined
                });
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("customerId");
                setStore({ isLoggedIn: false });

                console.log("Logged out:", getStore().token)
            },

            logInCustomer: async (customerCredentials) => {
                const response = await fetch(`${process.env.BACKEND_URL}/api/customer/login`, {
                    method: "POST",
                    body: JSON.stringify(customerCredentials),
                    headers: { "Content-Type": "application/json" }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStore({
                        token: data.access_token,
                        customerId: data.customer_id,
                        isLoggedIn: true
                    });
                    sessionStorage.setItem("token", data.access_token);
                    sessionStorage.setItem("customerId", data.customer_id);
                    return true;
                } else {
                    console.error("Login failed with status:", response.status);
                    return false;
                }
            },

            verifyCustomer: ({ access_token, customer_id, ...args }) => {
                setStore({
                    token: access_token,
                    customerId: customer_id
                });
                sessionStorage.setItem("token", access_token);
                sessionStorage.setItem("customerId", customer_id);
            },

            checkStorage: () => {
                const token = sessionStorage.getItem("token", undefined)  
                const customer_id = sessionStorage.getItem("customerId", undefined)
                setStore({
                    token: token,
                    customerId: customer_id
                });
            },



            signUpCustomer: async (customer) => {
                const response = await fetch(
                    process.env.BACKEND_URL + "/api/customer/signup", {
                    method: "POST",
                    body: JSON.stringify({ first_name: customer.first_name, email: customer.email, password: customer.password, last_name: customer.last_name, address: customer.address, phone: customer.phone }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
                );
                if (response.status !== 201) return false;
                const responseBody = await response.json();
                console.log(responseBody)

                return true;
            },

            // getCustomers: async (custId) => {
            getCustomers: async () => {

                const response = await fetch(process.env.BACKEND_URL + "/api/customers", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + sessionStorage.token
                    },
                })
                if (response.status !== 200) return false;
                const responseBody = await response.json();
                // setStore({ customers: responseBody.customers })
                console.log(responseBody)
                setStore({ customers: responseBody })
                return true;
            },

            getCustomerById: async (custId) => {
                if (!custId) {
                    console.error("Customer ID is undefined.");
                    return false;
                }
                // const response = await fetch(`${process.env.BACKEND_URL}/api/customer/${custId}`, {
                const response = await fetch(`${process.env.BACKEND_URL}/api/user/get-customer/${custId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    },
                });

                if (!response.ok) {
                    console.error('Failed to fetch customer data:', response.status);
                    return false;
                }

                const responseBody = await response.json();


                // return true
                return responseBody
            },


            getCurrentCustomer: async () => {
                const response = await fetch(`${process.env.BACKEND_URL}/api/current-customer`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    },
                });

                if (!response.ok) {
                    console.error('Failed to fetch customer data:', response.status);
                    return false;
                }

                const responseBody = await response.json();

                return responseBody
            },

            editCustomer: async (customer) => {
                const response = await fetch(
                    process.env.BACKEND_URL + "/api/customer/edit/" + customer.id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`

                    },
                    body: JSON.stringify({ first_name: customer.first_name, email: customer.email, last_name: customer.last_name, address: customer.address, phone: customer.phone })

                }
                );
                if (response.status !== 201) return false;
                const responseBody = await response.json();
                console.log(responseBody)

                return true;
            },

            editCustomerbyCustomer: async (customer) => {
                const response = await fetch(
                    process.env.BACKEND_URL + "/api/customer/edit-by-customer", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ first_name: customer.first_name, email: customer.email, last_name: customer.last_name, address: customer.address, phone: customer.phone })

                }
                );
                if (response.status !== 201) return false;
                const responseBody = await response.json();
                console.log(responseBody)

                return true;
            },

            deleteCustomer: async (custId) => {
                const response = await fetch(process.env.BACKEND_URL + "/api/customer/delete/" + custId, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + sessionStorage.getItem("token")
                    }
                })
                if (response.status !== 200) return false;
                const responseBody = await response.json();
                console.log(responseBody)
                return true;
            },

            sendPasswordResetEmail: async (email, role) => {
                const response = await fetch(process.env.BACKEND_URL + "/api/forgotpassword", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, role })
                });
                if (!response.ok) {
                    console.error("Failed to send password reset email with status:", response.status);
                    return false;
                }
                const data = await response.json();
                console.log("Password reset email sent:", data.msg);
                return true;
            },

            resetPassword: async (token, newPassword) => {
                const url = `${process.env.BACKEND_URL}/api/reset-password?token=${encodeURIComponent(token)}`;
                try {
                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ new_password: newPassword })
                    });
                    const data = await response.json(); // Always parse the JSON to handle the response correctly
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}, message: ${data.message}`);
                    }
                    console.log("Password reset successful:", data.message);
                    return { status: true, role: data.role };
                } catch (error) {
                    console.error("Failed to reset password:", error.message || error);
                    return { status: false, role: data.role };
                }
            },

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
