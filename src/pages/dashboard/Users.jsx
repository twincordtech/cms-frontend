import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Card from '../../components/elements/Card';
import api from '../../services/api';

const UserForm = ({ user, onClose, onSubmit, isOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'viewer',
    company: '',
    designation: '',
    department: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      // Ensure all fields are populated from user data
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        role: user.role || 'viewer',
        company: user.company || '',
        designation: user.designation || '',
        department: user.department || ''
      });
    } else {
      // Reset form when creating new user
      setFormData({
        name: '',
        email: '',
        mobile: '',
        role: 'viewer',
        company: '',
        designation: '',
        department: ''
      });
    }
  }, [user]); // This effect runs when user prop changes

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    if (!formData.mobile?.trim()) newErrors.mobile = 'Mobile number is required';
    if (!formData.role) newErrors.role = 'Role is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Mobile validation (basic)
    const mobileRegex = /^\+?[\d\s-]{8,}$/;
    if (formData.mobile && !mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Invalid mobile number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Ensure all fields are properly formatted before submission
      const submissionData = {
        ...formData,
        company: formData.company?.trim() || '',
        designation: formData.designation?.trim() || '',
        department: formData.department?.trim() || '',
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        role: formData.role
      };

      await onSubmit(submissionData);
      setFormData({
        name: '',
        email: '',
        mobile: '',
        role: 'viewer',
        company: '',
        designation: '',
        department: ''
      });
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      if (errorMessage.includes('Email already registered')) {
        setErrors(prev => ({
          ...prev,
          email: 'Email is already registered'
        }));
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClasses = (error) => `
    w-full px-4 py-2 border rounded-lg transition-colors
    ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}
    focus:outline-none focus:ring-2 
    ${error ? 'focus:ring-red-200' : 'focus:ring-blue-200'}
    disabled:bg-gray-100
  `;

  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {user ? 'Edit User' : 'Create New User'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className={labelClasses}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClasses(errors.name)}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className={labelClasses}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={user}
                  className={inputClasses(errors.email)}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className={labelClasses}>
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={inputClasses(errors.mobile)}
                  placeholder="+1234567890"
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className={labelClasses}>
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={inputClasses(errors.role)}
                >
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>

              {/* Company */}
              <div>
                <label className={labelClasses}>
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={inputClasses()}
                  placeholder="Company Name"
                />
              </div>

              {/* Designation */}
              <div>
                <label className={labelClasses}>
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className={inputClasses()}
                  placeholder="Job Title"
                />
              </div>

              {/* Department */}
              <div className="md:col-span-2">
                <label className={labelClasses}>
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={inputClasses()}
                  placeholder="Department"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>{user ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <span>{user ? 'Update User' : 'Create User'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/auth/users');
      if (response.data.users) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.response?.data?.message || 'Failed to fetch users');
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (formData) => {
    try {
      const response = await api.post('/auth/register-user', formData);
      if (response.data.success) {
        toast.success('User created successfully! Password setup email sent.');
        fetchUsers();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create user';
      toast.error(message);
      throw error;
    }
  };

  const handleUpdateUser = async (formData) => {
    try {
      const response = await api.put(`/auth/users/${selectedUser._id}`, {
        ...formData,
        isActive: selectedUser.isActive
      });
      if (response.data.success) {
        toast.success('User updated successfully!');
        fetchUsers();
        setIsFormOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user';
      toast.error(message);
      throw error;
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await api.delete(`/auth/users/${userId._id}`);
      if (response.data.success) {
        toast.success('User deleted successfully!');
        fetchUsers();
        setDeleteConfirm(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const openCreateForm = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const openEditForm = (user) => {
    // Ensure we have all the necessary user data
    const userToEdit = {
      _id: user._id,
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      role: user.role || 'viewer',
      company: user.company || '',
      designation: user.designation || '',
      department: user.department || '',
      isActive: user.isActive
    };
    setSelectedUser(userToEdit);
    setIsFormOpen(true);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchUsers}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Retry
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-full mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <button
          onClick={openCreateForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
        >
          <FaUserPlus />
          <span>Add User</span>
        </button>
      </div>

      {loading ? (
        <Card>
          <div className="p-8 text-center">
            <FaSpinner className="animate-spin h-8 w-8 text-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        </Card>
      ) : users.length === 0 ? (
        <Card>
          <div className="p-8 text-center">
            <p className="text-gray-600 mb-4">No users found</p>
            <button
              onClick={openCreateForm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center space-x-2 transition-colors"
            >
              <FaUserPlus />
              <span>Create First User</span>
            </button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-medium">
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-medium">
                            {user.name || user.email.split('@')[0]}
                          </span>
                          <span className="text-sm text-gray-500">
                            {user.mobile || 'No mobile added'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-900">{user.email}</span>
                        <span className={`text-xs mt-1 ${user.isVerified ? 'text-green-600' : 'text-amber-600'}`}>
                          {user.isVerified ? '✓ Verified' : '⚠ Pending Verification'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-gray-900">{user.company || 'Not specified'}</span>
                        {(user.designation || user.department) && (
                          <span className="text-sm text-gray-500">
                            {[user.designation, user.department].filter(Boolean).join(' • ')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openEditForm(user)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit user"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(user)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete user"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <UserForm
        user={selectedUser}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
      />

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(deleteConfirm)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Users; 