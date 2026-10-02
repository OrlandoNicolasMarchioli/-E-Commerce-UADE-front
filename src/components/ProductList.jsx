import React from 'react';
import products from '../data/products.json';
import ProductCard from './ProductCard';
import './ProductList.css';

// Componente "padre": lee los productos del JSON y por cada uno
// renderiza un ProductCard. Lo que va entre las etiquetas es el children.
const ProductList = () => {
  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Catálogo de Productos</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            category={product.category?.name}
          >
            {/* && -> solo se muestra si es true */}
            {product.freeShipping && (
              <span className="badge badge--free-shipping">🚚 Envío gratis</span>
            )}

            {/* ternario -> muestra una cosa u otra */}
            {product.international ? (
              <span className="badge badge--international">🌎 Compra internacional</span>
            ) : (
              <span className="badge badge--local">🇦🇷 Compra nacional</span>
            )}

            {/* condicionales extra con los datos del back (type y stock) */}
            {product.type === 'SERVICE' && (
              <span className="badge badge--service">🎓 Servicio</span>
            )}
            {product.type === 'PHYSICAL' && product.stock === 0 && (
              <span className="badge badge--no-stock">Sin stock</span>
            )}
          </ProductCard>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
