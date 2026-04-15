import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', image: '', stock: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const { data } = await api.get('/products');
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setEditingId(null);
      } else {
        await api.post('/products', payload);
      }
      setForm({ name: '', description: '', price: '', category: '', image: '', stock: '' });
      fetchProducts();
    } catch {
      alert('Erro ao salvar produto');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      image: product.image || '',
      stock: product.stock || 0,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: '', description: '', price: '', category: '', image: '', stock: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deletar produto?')) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="admin">
      <h2>Painel Admin</h2>
      <div className="admin-form">
        <h3>{editingId ? '✏️ Editar Produto' : 'Adicionar Produto'}</h3>
        <form onSubmit={handleSubmit}>
          <input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          <input type="number" placeholder="Preço" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
            <option value="">Categoria</option>
            <option value="eletronicos">Eletrônicos</option>
            <option value="roupas">Roupas</option>
            <option value="livros">Livros</option>
            <option value="outros">Outros</option>
          </select>
          <input placeholder="URL da imagem" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          <input type="number" placeholder="Estoque" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
          <button type="submit">{editingId ? 'Salvar alterações' : 'Adicionar'}</button>
          {editingId && (
            <button type="button" onClick={handleCancel} style={{ background: '#888' }}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="admin-products">
        <h3>Produtos cadastrados</h3>
        {products.map(product => (
          <div key={product._id} className="admin-product-item">
            <span>{product.name}</span>
            <span>R$ {product.price.toFixed(2)}</span>
            <span>{product.category}</span>
            <button className="edit" onClick={() => handleEdit(product)}>Editar</button>
            <button className="delete" onClick={() => handleDelete(product._id)}>Deletar</button>
          </div>
        ))}
      </div>
    </div>
  );
}