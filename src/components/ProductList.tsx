import React from 'react';
import { Product } from '../types/Product';
import config from '../config';

interface ProductListProps {
  productsA: Product[] | undefined;
}

const ProductList: React.FC<ProductListProps> = ({ productsA = [] }) => {
  if (productsA.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
      }}
    >
      {productsA.map((product) => (
        <div
          key={product.id}
          style={{
            fontSize: '14px',
            background: '#8d4a5b',
            color: '#ffffff',
            padding: '1rem',
            borderRadius: '0.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '320px',
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            {product.pizzanumber} {product.name}
          </h3>

          <div
            style={{
              width: '100%',
              height: '250px',
              overflow: 'hidden',
              borderRadius: '4px',
              marginBottom: '0.5rem',
            }}
          >
            <img
              src={config.API_BASE_URL + product.imageurl}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>

          <p style={{ flexGrow: 1 }}>{product.description}</p>

          <p style={{ fontWeight: 600 }}>
            {product.price.toFixed(2).replace('.', ',')} kr
          </p>
        </div>
      ))}
    </div>
  );
};
export default ProductList;
