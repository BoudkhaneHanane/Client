import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaPlus, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SidBar from './sidbar';
import NavAdmin from './navadmin';
import './products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editIdProduit, setEditIdProduit] = useState(-1);

    const handleDelete = (idProduit) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
          deleteProduct(idProduit);
        }
    };
    const deleteProduct = async (idProduit) => {
        try {
          await axios.delete(`http://localhost:3002/produits/${idProduit}`);
          fetchData();
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      };
    const handleEdit = (idProduit) => {
        // Rediriger l'utilisateur vers le formulaire avec l'ID du produit à modifier
        history.push(`/formulaireproduit/${idProduit}`);
    };

    const handleAdd = () => {
        // Logique pour ajouter un nouveau produit
        console.log('Ajout d\'un nouveau produit');
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3002/produits');
            setProducts(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }
    }; 

    return (
       <div>
            <div className='home'>
                <SidBar/>
                <div className='homecontainer'>
                    <NavAdmin/>
                    <div className='add-product'>
                        <Link to={'/formulaireproduit'}>
                            <button className="button-add-product" onClick={handleAdd}>
                                <FaPlus className="icon" /> Add product
                            </button>
                        </Link>
                    </div>
                    <div className="search-container">
                        <input type="text" placeholder="search a product..." onChange={handleSearch} />
                        <FaSearch className="search-icon" />
                    </div>
                    <h2 className='titre'>Liste des produits</h2>
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Id</th>
                                <th>Nom</th>
                                <th>Catégorie</th>
                                <th>Sous-catégorie</th>
                                <th>Marque</th>
                                <th>Prix</th>
                                <th>Référence</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.idProduit}>
                                    <td>
                                        <img src={product.imageUrl1}  style={{ width: '50px', height: '50px' }} />
                                    </td>
                                    <td>{product.idProduit}</td>
                                    <td>{product.name}</td>
                                    <td>{product.idCategorie}</td>
                                    <td>{product.idSubCategorie}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.price} DA</td>
                                    <td>{product.reference}</td>
                                    <td>
                                        <FaTrash className='icon' onClick={() => handleDelete(product.idProduit)} />
                                        <FaEdit  className='icons' onClick={() => handleEdit(product.idProduit)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div> 
        </div>
    );
};

export default Products;