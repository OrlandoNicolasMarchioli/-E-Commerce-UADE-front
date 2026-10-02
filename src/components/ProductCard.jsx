import React from 'react';
import './ProductCard.css';

// Componente "hijo": solo muestra los datos que recibe por props.
// En children viene lo que el padre (ProductList) pone entre las etiquetas
// <ProductCard> ... </ProductCard> (en este caso, los badges condicionales).
const ProductCard = ({ name, description, price, category, children }) => {
  // Formato de moneda argentino: $ 38.999,99
  const formattedPrice = price.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });

  return (
    <div className="product-card">
      {category && <span className="product-card__category">{category}</span>}
      <h3 className="product-card__name">{name}</h3>
      <p className="product-card__description">{description ? description : "Sin descripción"}</p>
      <div className="product-card__price">{formattedPrice}</div>
      <div className="product-card__extras">{children}</div>
    </div>
  );
};

export default ProductCard;
