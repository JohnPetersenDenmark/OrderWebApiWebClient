
import React, { useEffect, useState } from 'react';

import { ProductLabel } from '../../types/ProductLabel';

import AdminProductLabelCreateEdit from './AdminProductLabelCreateEdit';

import { AxiosClientGet, AxiosClientPost, AxiosClientDelete } from '../../types/AxiosClient';

const AdminProductLabels: React.FC = () => {


    const [productLabels, setProductLabels] = useState<ProductLabel[]>([]);
    const [isProductCategoryEmployeeModalOpen, setIsCreateEditProductLabelModalOpen] = useState(false);
    const [productLabelToEdit, setProductLabelToEdit] = useState<ProductLabel | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(0);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {

        const fetchData = async () => {

            try {
                const labelsResponse: any = await AxiosClientGet('/Home/productlabellist', false);

                setProductLabels(labelsResponse);
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

 const handleEdit = (productLabel: ProductLabel) => {
    setProductLabelToEdit(productLabel);
    setIsCreateEditProductLabelModalOpen(true);
  };

  const handleDelete = (productLabel: ProductLabel) => {
    if (productLabel) {
      const deleteProductLabel = async () => {
        try {
          setSubmitting(true);

          await AxiosClientDelete('/Login/removeXXcategory/' + productLabel.id, true)


        } catch (error) {
          setError('Fejl');
          console.error(error);
        } finally {
          setSubmitting(false);
          setReload(prev => prev + 1);
        }
      };
      
      deleteProductLabel();

    }
  };

  const handleNewEmployee = () => {
    setIsCreateEditProductLabelModalOpen(true);
    setProductLabelToEdit(null);

  };

  const handleCloseCreateEditProductCategoryModal = () => {
    setProductLabelToEdit(null);
    setIsCreateEditProductLabelModalOpen(false);
    setReload(prev => prev + 1);
  };


 /*  if ( productLabels.length === 0)
  {
    return (<></>);
  } */

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

      <AdminProductLabelCreateEdit
        isOpen={isProductCategoryEmployeeModalOpen}
        productLabelToEdit={productLabelToEdit}
        onClose={handleCloseCreateEditProductCategoryModal} />

      <div style={{
        fontSize: '2rem',
        fontWeight: 600,
        color: '#22191b',
        margin: '20px',
        textAlign: 'center' as const,
      }}>Mærkninger</div>

      <div style={{ margin: 'auto', padding: '1rem' }}>
        {productLabels && productLabels.map((productLabel) => (
          <div key={productLabel.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', border: '1px solid grey', borderRadius: '5px', background: '#ffffff', }}>
            <div style={{ flex: '2', padding: '0.5rem' }}>{productLabel.labelname}</div>           
            <div style={{ flex: '3', padding: '0.5rem' }}>
              <img
                src="/images/edit-icon.png"
                alt="Edit"
                onClick={() => handleEdit(productLabel)}
                style={{ cursor: 'pointer', width: '28px', height: '28px' }}
              />
            </div>

            <div style={{ flex: '4', padding: '0.5rem' }}>
              <img
                src="/images/delete-icon.png"
                alt="Delete"
                onClick={() => handleDelete(productLabel)}
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

export default AdminProductLabels