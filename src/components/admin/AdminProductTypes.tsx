
import React, { useEffect, useState } from 'react';
import { ProductType } from '../../types/ProductType';
import AdminProductTypeCreateEdit from './AdminProductTypeCreateEdit';

import { AxiosClientGet, AxiosClientPost, AxiosClientDelete } from '../../types/AxiosClient';

const AdminProductTypes: React.FC = () => {


    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [isProductCategoryEmployeeModalOpen, setIsCreateEditProductCategoryModalOpen] = useState(false);
    const [productTypeToEdit, setProductTypeToEdit] = useState<ProductType | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(0);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {

        const fetchData = async () => {

            try {
                const productTypeResponse: any = await AxiosClientGet('/Home/producttypelist', false);

                setProductTypes(productTypeResponse);
                setLoading(false);

            } catch (err) {
                setError('Failed to load locations');
                setLoading(false);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();


    }, [submitting]);

 const handleEdit = (productCategory: ProductType) => {
    setProductTypeToEdit(productCategory);
    setIsCreateEditProductCategoryModalOpen(true);
  };

  const handleDelete = (productCategory: ProductType) => {
    if (productCategory) {
      const deleteProductType = async () => {
        try {
          setSubmitting(true);

          await AxiosClientDelete('/Login/removeerwwerewrwerwerw SSSSSSS   AAAAAA ctcategory/' + productCategory.id, true)


        } catch (error) {
          setError('Fejl');
          console.error(error);
        } finally {
          setSubmitting(false);
          setReload(prev => prev + 1);
        }
      };
      
      deleteProductType();

    }
  };

  const handleNewEmployee = () => {
    setIsCreateEditProductCategoryModalOpen(true);
    setProductTypeToEdit(null);

  };

  const handleCloseCreateEditProductCategoryModal = () => {
    setProductTypeToEdit(null);
    setIsCreateEditProductCategoryModalOpen(false);
    setReload(prev => prev + 1);
  };



    return (
         <div
      className="location-frame"
      style={{
        border: '1px solid grey',
        borderRadius: '5px',
        fontSize: '20px',
        color: '#22191b',
        fontWeight: 200,

        margin: 'auto',
      }}
    >

      <AdminProductTypeCreateEdit
        isOpen={isProductCategoryEmployeeModalOpen}
        productTypeToEdit={productTypeToEdit}
        onClose={handleCloseCreateEditProductCategoryModal} />

      <div style={{
        fontSize: '2rem',
        fontWeight: 600,
        color: '#22191b',
        margin: '20px',
        textAlign: 'center' as const,
      }}>Medarbejdere</div>

      <div style={{ margin: 'auto', padding: '1rem' }}>
        {productTypes && productTypes.map((productType) => (
          <div key={productType.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', border: '1px solid grey', borderRadius: '5px', background: '#ffffff', }}>
            <div style={{ flex: '2', padding: '0.5rem' }}>{productType.name}</div>           
            <div style={{ flex: '3', padding: '0.5rem' }}>
              <img
                src="/images/edit-icon.png"
                alt="Edit"
                onClick={() => handleEdit(productType)}
                style={{ cursor: 'pointer', width: '28px', height: '28px' }}
              />
            </div>

            <div style={{ flex: '4', padding: '0.5rem' }}>
              <img
                src="/images/delete-icon.png"
                alt="Delete"
                onClick={() => handleDelete(productType)}
                style={{ cursor: 'pointer', width: '28px', height: '28px' }}
              />
            </div>

          </div>
        ))}
      </div>
      <style>
        {`
          @media (max-width: 768px) {    
          .location-frame {
                      background-color: #8d4a5b;
      }
    }
  `}
      </style>
      <div
        style={{
          border: '1px dashed #ccc',
          padding: '1rem',
          borderRadius: '8px',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={handleNewEmployee}
      >
        <img
          src="/images/new-icon.png"
          alt="Ny"
          style={{ width: '28px', height: '28px' }}
        />
      </div>
    </div>

    );
}

export default AdminProductTypes