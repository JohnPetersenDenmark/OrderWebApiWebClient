import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Product } from '../../types/Product';
import AdminProductCreateEdit from './AdminProductCreateEdit';
import config from '../../config';
import { AxiosClientGet, AxiosClientPost, AxiosClientDelete } from '../../types/AxiosClient';

import {
  AdminContainer,
  SectionWrapper,
  SectionTitle,
  GridHeaderPizza,
  GridHeaderTopping,
  GridRowPizza,
  GridRowTopping,
  ImageWrapper,
  ActionIcon,
  NewIconWrapper
} from './AdminLayoutStyles';

// ✅ Full-width responsive container
const Container = styled.div`
  width: 100%;
 
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
  font-size: 20px;
  color: #22191b;
  font-weight: 200;
`;

const AdminMenues: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isCreateEditProductModalOpen, setIsCreateEditProductModalOpen] = useState(false);
 
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
   const [reload, setReload] = useState(0); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await AxiosClientGet('/Home/productlist', false);
        setProducts(response);
      } catch {
        setError('Failed to load pizzas');
      }
    };

    

    fetchProducts();
  
  }, [isCreateEditProductModalOpen,  submitting, reload]);

  const handleDeletePizza = async (product: Product) => {
    try {
      setSubmitting(true);
      await AxiosClientDelete('/Admin/removeproduct/' + product.id, true);
      setReload(prev => prev + 1);
    } catch {
      setError('Failed to delete product');
    } finally {
      setSubmitting(false);
    }
  };



  const handleCloseCreateEditPizzaModal = () => { 
    setIsCreateEditProductModalOpen(false);
      setReload(prev => prev + 1);
  };

  


  return (
    <Container>
      <AdminProductCreateEdit
        isOpen={isCreateEditProductModalOpen}
        onClose={() => handleCloseCreateEditPizzaModal()}
        productToEdit={productToEdit}
      />

    

      <div style={{ fontSize: '2rem',
      fontWeight: 600,
      color: '#22191b',
      margin: '20px',
      textAlign: 'center' as const,}}>Produkter</div>

      {/* Pizzas Section */}
      <SectionWrapper bgColor='#ffffff' >
        <GridHeaderPizza>
          <div></div>
          <div>Nr.</div>
          <div>Navn</div>
          <div>Beskrivelse</div>
          {/*  <div>Pris før rabat</div>
          <div>Rabat %</div> */}
          <div>Pris efter rabat</div>
          <div></div>
          <div></div>
        </GridHeaderPizza>

        {products.map((product, index) => (
          <GridRowPizza key={index}>
            <ImageWrapper>
              <img src={`${config.API_BASE_URL}${product.imageurl}`} alt={product.name} />
            </ImageWrapper>
            <div>{product.productnumber}</div>
            <div>{product.name}</div>
            <div>{product.description}</div>
            {/*   <div>{pizza.discountprice.toFixed(2).replace('.', ',')}</div>
            <div>{pizza.discountpercentage}</div> */}
            <div>{product.price.toFixed(2).replace('.', ',')}</div>
            <div>
              <ActionIcon
                src="/images/edit-icon.png"
                alt="Edit"
                onClick={() => {
                  setProductToEdit(product);
                  setIsCreateEditProductModalOpen(true);
                }}
              />
            </div>
            <div>
              <ActionIcon
                src="/images/delete-icon.png"
                alt="Delete"
                onClick={() => handleDeletePizza(product)}
              />
            </div>
          </GridRowPizza>
        ))}


        <NewIconWrapper>
          <ActionIcon src="/images/new-icon.png" alt="Ny" onClick={() => {
            setProductToEdit(null);
            setIsCreateEditProductModalOpen(true);
          }} />
        </NewIconWrapper>



      </SectionWrapper>

      {/* Toppings Section */}
    {/*   <SectionWrapper bgColor="white">
        <GridHeaderTopping>
          <div></div>
          <div>Tilbehør</div>
          <div>Beskrivelse</div>
          <div>Pris</div>

          <div></div>
          <div></div>

        </GridHeaderTopping> */}

       


        

      {/* </SectionWrapper> */}
    </Container>
  );
};

export default AdminMenues;
