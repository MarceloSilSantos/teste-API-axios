import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/orcamentos';

function OrcamentoCRUD() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [orcamentoForm, setOrcamentoForm] = useState({
    valor: '',
    dataEntrega: '',
    formaPagamento: '',
    status: '',
    idUsuario: '',  // Assume these are required fields for creating or updating an orcamento
    idProjeto: ''
  });
  const [editOrcamentoId, setEditOrcamentoId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrcamentos();
  }, []);

  // Fetch all orcamentos
  const fetchOrcamentos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/listar`);
      setOrcamentos(response.data);
    } catch (error) {
      console.error('Error fetching orcamentos:', error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrcamentoForm({
      ...orcamentoForm,
      [name]: value,
    });
  };

  // Handle form submission for creating or updating an orcamento
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editOrcamentoId) {
      await updateOrcamento(editOrcamentoId);
    } else {
      await createOrcamento();
    }
  };

  // Create a new orcamento
  const createOrcamento = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/criar`, orcamentoForm);
      setMessage(`Orçamento criado com ID: ${response.data.id}`);
      fetchOrcamentos();
      setOrcamentoForm({});
    } catch (error) {
      setMessage(error.response ? error.response.data : 'An error occurred');
    }
  };

  // Update an existing orcamento
  const updateOrcamento = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/atualizar/${id}`, orcamentoForm);
      setMessage(`Orçamento atualizado com ID: ${response.data.id}`);
      fetchOrcamentos();
      setEditOrcamentoId(null);
      setOrcamentoForm({});
    } catch (error) {
      setMessage(error.response ? error.response.data : 'An error occurred');
    }
  };

  // Edit a selected orcamento
  const editOrcamento = (orcamento) => {
    setEditOrcamentoId(orcamento.id);
    setOrcamentoForm({
      valor: orcamento.valor,
      dataEntrega: orcamento.dataEntrega,
      formaPagamento: orcamento.formaPagamento,
      status: orcamento.status,
      idUsuario: orcamento.usuario.id,
      idProjeto: orcamento.projeto.id,
    });
  };

  // Delete an orcamento
  const deleteOrcamento = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/remover/${id}`);
      setMessage('Orçamento removido com sucesso');
      fetchOrcamentos();
    } catch (error) {
      setMessage(error.response ? error.response.data : 'An error occurred');
    }
  };

  return (
    <div>
      <h2>Orçamento CRUD Operations</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="valor" placeholder="Valor" onChange={handleChange} value={orcamentoForm.valor || ''} required />
        <input type="date" name="dataEntrega" placeholder="Data de Entrega" onChange={handleChange} value={orcamentoForm.dataEntrega || ''} required />
        <input type="text" name="formaPagamento" placeholder="Forma de Pagamento" onChange={handleChange} value={orcamentoForm.formaPagamento || ''} required />
        <input type="text" name="status" placeholder="Status" onChange={handleChange} value={orcamentoForm.status || ''} required />
        <input type="number" name="idUsuario" placeholder="ID do Usuário" onChange={handleChange} value={orcamentoForm.idUsuario || ''} required />
        <input type="number" name="idProjeto" placeholder="ID do Projeto" onChange={handleChange} value={orcamentoForm.idProjeto || ''} required />
        <button type="submit">{editOrcamentoId ? 'Atualizar Orçamento' : 'Criar Orçamento'}</button>
      </form>

      {message && <p>{message}</p>}

      <h3>Lista de Orçamentos</h3>
      <ul>
        {orcamentos.map((orcamento) => (
          <li key={orcamento.id}>
            <p>{orcamento.valor} - {orcamento.formaPagamento}</p>
            <button onClick={() => editOrcamento(orcamento)}>Editar</button>
            <button onClick={() => deleteOrcamento(orcamento.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrcamentoCRUD;
