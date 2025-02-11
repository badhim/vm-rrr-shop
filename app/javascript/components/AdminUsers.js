import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, user, onClose, onSave }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("user");

    useEffect(() => {
    if (user) {
        setFirstName(user.attributes.first_name);
        setLastName(user.attributes.last_name);
        setRole(user.attributes.role && user.attributes.role.trim() !== "" ? user.attributes.role : "user");
    } else {
        setFirstName("");
        setLastName("");
        setRole("user");
    }
    }, [user]);

    const handleCancel = () => {
        onClose();
    };

    const handleSave = () => {
        onSave(firstName, lastName, role);
    };

    if (!isOpen) return null;

    return (
        <>
        <div className="modal-backdrop show"></div>
        <div className="modal fade show" id="modalEditUser" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalEditUserTitle">Edit User</h5>
                    </div>
                    <div className="modal-body">
                        <label htmlFor="first-name">First Name</label>
                        <input
                            name="first-name"
                            className="form-control mb-3"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <label htmlFor='last-name'>Last Name</label>
                        <input
                            name="last-name"
                            className="form-control mb-3"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <label htmlFor="role">Role</label>
                        <select
                            name="role"
                            className="form-control form-select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                        </select>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

const AdminUsers = () => {
    const [csrfToken, setCsrfToken] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const tokenElement = document.querySelector("meta[name='csrf-token']");
        const token = tokenElement ? tokenElement.getAttribute("content") : '';
        setCsrfToken(token);

        const fetchUsers = async () => {
            const response = await fetch(`/api/v1/users`);
            const data = await response.json();
            setUsers(data.data);
        };

        fetchUsers();
    }, []);

    const showAlert = (message) => {
        if (typeof window.showToast === 'function') {
            window.showToast(message);
        } else {
            console.error('showToast is not defined');
        }
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setModalOpen(true);
    };

    const handleCancel = () => {
        setModalOpen(false);
        setCurrentUser(null);
    };

    const handleSave = async (firstName, lastName, role) => {
        try {
            setLoading(true);
            if (currentUser) {
                // Update existing item
                const updatedUser = await updateUserAPI(currentUser.id, firstName, lastName, role);
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === updatedUser.data.id ? updatedUser.data : user
                    )
                );
            }

            setModalOpen(false);
            setCurrentUser(null);
        } catch (err) {
            showAlert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateUserAPI = async (id, firstName, lastName, role) => {
        const response = await fetch(`/api/v1/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify({ first_name: firstName, last_name: lastName, role }),
        });

        const responseJson = await response.json();

        if (!response.ok) {
            const errorMessage = responseJson.errors ? responseJson.errors[0] : 'Failed to update user. Please try again.';
            throw new Error(errorMessage);
        }

        return responseJson;
    };

    return (
    <div className="container-fluid py-3">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Edit Users</span></h2>
        <div className="row px-xl-5">
            <div className="table-responsive mb-5 w-100">
                <table className="table table-light table-borderless table-hover text-center mb-0">
                    <thead className="thead-dark">
                        <tr>
                            <th>Id</th>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Role</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody className="align-middle">
                        {users.map(user => (
                        <tr key={user.id} id={user.id}>
                            <td className="align-left">{user.id}</td>
                            <td className="align-left">{user.attributes.email}</td>
                            <td className="align-left">{user.attributes.first_name}</td>
                            <td className="align-left">{user.attributes.last_name}</td>
                            <td className="align-left">{user.attributes.role || "user"}</td>
                            <td className="align-middle"><button className="btn btn-sm" disabled={loading} onClick={() => handleEdit(user)}><i className="fa fa-pen"></i></button></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <Modal
            user={currentUser}
            isOpen={isModalOpen}
            onClose={handleCancel}
            onSave={handleSave}
        />
    </div>
    );
}

export default AdminUsers;