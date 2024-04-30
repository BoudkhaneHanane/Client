import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SidBar from './sidbar';
import Nav from './nav';
import './styleadd.css';

const Promotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = async (idPromotion) => {
        if (window.confirm('Are you sure you want to delete this Promotion?')) {
            try {
                await axios.delete(`http://localhost:3002/promotions/${idPromotion}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting promotion:', error);
            }
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3002/promotions');
            setPromotions(response.data);
        } catch (error) {
            console.error('Error fetching promotions:', error);
        }
    };

    const fetchAllProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3002/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    
    

    useEffect(() => {
        fetchData();
        if (showAllProducts) {
            fetchAllProducts();
        }
    }, [showAllProducts]);

    return (
        <div>
            <div className='home'>
                <SidBar />
                <div className='homecontainers'>
                    <Nav />
                    <div className='homecontain'>
                        <div className='add-product'>
                            <div className='search-bar'>
                                <div className="search-container">
                                    <input type="text" placeholder="search a promotion..." onChange={handleSearch} />
                                    <FaSearch className="search-icon" />
                                </div>
                            </div>
                            <div className='add-product'>
                                <button type="button" className="button-add-productg" onClick={() => setShowAllProducts(!showAllProducts)}>
                                    {showAllProducts ? 'Hide Products' : 'Show All Products'}
                                </button>
                            </div>

                            {showAllProducts ? (
                                <div>
                                    <h2 className='titr'>All Products:</h2>
                                    <table className="products-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Category</th>
                                                <th>Subcategory</th>
                                                <th>Brand</th>
                                                <th>Price</th>
                                                <th>Reference</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(product => (
                                                <tr key={product.idProduit}>
                                                    <td>{product.name}</td>
                                                    <td>{product.namecategorie}</td>
                                                    <td>{product.namesubcategorie}</td>
                                                    <td>{product.brand}</td>
                                                    <td>{product.price}</td>
                                                    <td>{product.reference}</td>
                                                    <td>
                                                        <div className='add-product'>
                                                            <Link to={'/promotionformu'}>
                                                                <button className="iconsse" onClick={() => handleAddPromotionClick(product.name)}>
                                                                    <FaPlus className="iconsse" /> promotion
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div>
                                    <h2 className='titr'>Promotions:</h2>
                                    <table className="products-table">
                                        <thead>
                                            <tr>
                                                <th>Produit</th>
                                                <th>Prix Normal</th>
                                                <th>Prix Promotion</th>
                                                <th>Réduction</th>
                                                <th>Fin Promotion</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {promotions.map(promotion => (
                                                <tr key={promotion.idPromotion}>
                                                    <td>{promotion.Produit}</td>
                                                    <td>{promotion.PrixNormal} DA</td>
                                                    <td>{promotion.PrixPromotion} DA</td>
                                                    <td>{promotion.Reduction} %</td>
                                                    <td>{promotion.DateFinPromotion}</td>
                                                    <td>
                                                        <FaTrash className='icon' onClick={() => handleDelete(promotion.idPromotion)} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {selectedProduct && <PromotionForm selectedProduct={selectedProduct} />}
        </div>
    );
};

export default Promotions;
