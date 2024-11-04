import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/usuario';

function UserCRUD() {
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    nome: '',
    cpf_cnpj: '',
    telefone: '',
    tipo: '',
    cep: '',
    endereco: '',
    numero: '',
    descricaoPerfil: '',
    fotoPerfil: '',
    senha: '',
  });
  const [editUserId, setEditUserId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/listar`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value,
    });
  };

  // Create or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editUserId) {
      // Update user
      await updateUser(editUserId);
    } else {
      // Create new user
      await createUser();
    }
  };

  const createUser = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/criar`, userForm);
      setMessage(`User created: ${response.data.id}`);
      fetchUsers(); // Refresh list
      setUserForm({}); // Clear form
    } catch (error) {
      handleError(error);
    }
  };

  const updateUser = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/atualizar/${id}`, userForm);
      setMessage(`User updated: ${response.data.id}`);
      fetchUsers();
      setEditUserId(null); // Exit edit mode
      setUserForm({});
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response && error.response.data) {
      setMessage(`Error: ${error.response.data}`);
    } else {
      setMessage('An error occurred.');
    }
  };

  // Select user to edit
  const editUser = (user) => {
    setEditUserId(user.id);
    setUserForm({ ...user });
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/remover/${id}`);
      setMessage('User deleted');
      fetchUsers(); // Refresh list
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      <h2>User CRUD Operations</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} value={userForm.username} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} value={userForm.email} required />
        <input type="text" name="nome" placeholder="Full Name" onChange={handleChange} value={userForm.nome} required />
        <input type="text" name="cpf_cnpj" placeholder="CPF/CNPJ" onChange={handleChange} value={userForm.cpf_cnpj} required />
        <input type="text" name="telefone" placeholder="Phone" onChange={handleChange} value={userForm.telefone} />
        <input type="text" name="tipo" placeholder="Type" onChange={handleChange} value={userForm.tipo} />
        <input type="text" name="cep" placeholder="Postal Code" onChange={handleChange} value={userForm.cep} />
        <input type="text" name="endereco" placeholder="Address" onChange={handleChange} value={userForm.endereco} />
        <input type="text" name="numero" placeholder="Address Number" onChange={handleChange} value={userForm.numero} />
        <input type="text" name="descricaoPerfil" placeholder="Profile Description" onChange={handleChange} value={userForm.descricaoPerfil} />
        <input type="text" name="fotoPerfil" placeholder="Profile Photo URL" onChange={handleChange} value={userForm.fotoPerfil} />
        <input type="password" name="senha" placeholder="Password" onChange={handleChange} value={userForm.senha} required />
        <button type="submit">{editUserId ? 'Update User' : 'Create User'}</button>
      </form>

      {message && <p>{message}</p>}

      <h3>All Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <p>{user.nome} - {user.email}</p>
            <button onClick={() => editUser(user)}>Edit</button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserCRUD;
