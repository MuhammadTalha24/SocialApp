import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
    const { user, token, error, loading } = useSelector((state) => state.user);
    const [formdata, setFormData] = useState({
        email: '',
        password: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formdata, [e.target.name]: e.target.value });
    };

    const formSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formdata)); // Dispatch the login action
    };

    useEffect(() => {
        if (user && user.success) {
            toast.success(user.message); // Show success toast
            navigate('/'); // Redirect to homepage after successful login
        } else if (error) {
            toast.error(error.message || error); // Display error message (check for nested message)
        }
    }, [user, error, navigate]); // Removed token from dependency array

    return (
        <div className="container">
            <div className="row justify-content-center py-5">
                <div className="col-md-6">
                    <div className="card bg-dark">
                        <div className="card-body">
                            <div className="row">
                                <h1 className="text-center text-white">Login</h1>
                                <form onSubmit={formSubmit}>
                                    <div className="col-12">
                                        <div className="form-group mb-3">
                                            <label className="form-label text-white" htmlFor="email">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formdata.email}
                                                onChange={handleChange}
                                                name="email"
                                                id="email"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className="form-label text-white" htmlFor="password">Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={formdata.password}
                                                onChange={handleChange}
                                                name="password"
                                                id="password"
                                                placeholder="Enter your password"
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary rounded-3 w-100" disabled={loading}>
                                        {loading ? 'Logging in...' : 'Login'}
                                    </button>
                                    <p className="text-white text-center mt-2">
                                        Dont Have An Account?
                                        <Link to="/register" className="text-decoration-none ms-1 text-info">Register</Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
