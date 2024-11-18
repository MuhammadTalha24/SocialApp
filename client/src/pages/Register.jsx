import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/authSlice.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        name: '',
        password: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, user } = useSelector((state) => state.user);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(formData));
        setFormData({
            username: '',
            email: '',
            name: '',
            password: '',
        });
    };

    useEffect(() => {
        if (user && user.success) {
            toast.success(user.message);
            navigate('/login');
        }
        if (error) {
            toast.error(error);
        }
    }, [user, error, navigate]);

    return (
        <div className="container">
            <h1 className="text-center mt-4">SocialApp</h1>
            <div className="row justify-content-center pt-5">
                <div className="col-md-4">
                    <div className="card bg-dark text-white">
                        <div className="card-body">
                            <h3 className="text-center">Register</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label className="form-label" htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        id="username"
                                        placeholder="Enter username"
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label" htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        id="name"
                                        placeholder="Enter Name"
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label" htmlFor="email">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        id="email"
                                        placeholder="Enter email"
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        id="password"
                                        placeholder="Enter password"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? 'Registering...' : 'Register'}
                                </button>
                                <p className='text-white text-center mt-2'>Dont Have An Account?<Link to={'/login'} className='text-decoration-none ms-1 text-info'>Login</Link></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
