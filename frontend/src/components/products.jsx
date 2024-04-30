import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaPlus, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import SidBar from './sidbar';
import Nav from './nav';
import './styleadd.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const navigate = useNavigate();

    const handleDelete = async (idProduit) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(idProduit);
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
        navigate(`/formulaireproduit/${idProduit}`);
    };

    const handleAdd = () => {
        navigate('/formulaireproduit');
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3002/produits');
            const productsWithImageUrl = response.data.map(product => ({
                ...product,
                imageUrl: product.image_path1 ? `/uploads/${product.image_path1}` : null
            }));
            setProducts(productsWithImageUrl);
            setFilteredProducts(productsWithImageUrl); // Initialize filtered products with all products
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }
    };

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.namecategorie.toLowerCase().includes(searchTerm) ||
            product.namesubcategorie.toLowerCase().includes(searchTerm) ||
            product.namesubsubcategorie.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.price.toLowerCase().includes(searchTerm) ||
            product.reference.toLowerCase().includes(searchTerm)
        );
        setFilteredProducts(filteredProducts);
    };

    return (
        <div className='home'>
            <SidBar />
            <div className='homecontainers'>
                <Nav/>
                <div className='homecontain'>
                    <div className='add-product'>
                        <div className='search-bar'>
                            <div className="search-container">
                                <input type="text" placeholder="Search a product..." onChange={handleSearch} />
                                <FaSearch className="search-icon" />
                            </div>
                        </div>
                        <div className='add-product'>
                            <button type="button" className="button-add-productg" onClick={handleAdd}>
                                <FaPlus className="icon" /> Add product
                            </button>
                        </div>
                        <h2 className='titr'>Liste des produits</h2>
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Nom</th>
                                    <th>Catégorie</th>
                                    <th>Sous-catégorie</th>
                                    <th>Sub-sous-catégorie</th>
                                    <th>Marque</th>
                                    <th>Prix</th>
                                    <th>Référence</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.idProduit}>
                                        <td>
                                            {product.imageUrl && (
                                                <img src={product.imageUrl} className="product-image" style={{ height: '50px', width: '50px' }} />
                                            )}
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.namecategorie}</td>
                                        <td>{product.namesubcategorie}</td>
                                        <td>{product.namesubsubcategorie}</td>
                                        <td>{product.brand}</td>
                                        <td>{product.price} DA</td>
                                        <td>{product.reference}</td>
                                        <td>
                                            <FaTrash className='icon' onClick={() => handleDelete(product.idProduit)} />
                                            <FaEdit className='icons' onClick={() => handleEdit(product.idProduit)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
