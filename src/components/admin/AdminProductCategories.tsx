
import React, { useEffect, useState } from 'react';
import { ProductCategory } from '../../types/ProducCategory';
import AdminProductCategoryCreateEdit from './AdminProductCategoryCreateEdit';

import { AxiosClientGet, AxiosClientPost, AxiosClientDelete } from '../../types/AxiosClient';

const AdminProductCategories: React.FC = () => {


    const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
    const [isProductCategoryEmployeeModalOpen, setIsCreateEditProductCategoryModalOpen] = useState(false);
    const [productCategoryToEdit, setProductCategoryToEdit] = useState<ProductCategory | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(0);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {

        const fetchData = async () => {

            try {
                const categoryResponse: any = await AxiosClientGet('/Home/productcategorylist', false);

                setProductCategories(categoryResponse);
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

 const handleEdit = (productCategory: ProductCategory) => {
    setProductCategoryToEdit(productCategory);
    setIsCreateEditProductCategoryModalOpen(true);
  };

  const handleDelete = (productCategory: ProductCategory) => {
    if (productCategory) {
      const deleteProductCategory = async () => {
        try {
          setSubmitting(true);

          await AxiosClientDelete('/Login/removeproductcategory/' + productCategory.id, true)


        } catch (error) {
          setError('Fejl');
          console.error(error);
        } finally {
          setSubmitting(false);
          setReload(prev => prev + 1);
        }
      };
      
      deleteProductCategory();

    }
  };

  const handleNewEmployee = () => {
    setIsCreateEditProductCategoryModalOpen(true);
    setProductCategoryToEdit(null);

  };

  const handleCloseCreateEditProductCategoryModal = () => {
    setProductCategoryToEdit(null);
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

      <AdminProductCategoryCreateEdit
        isOpen={isProductCategoryEmployeeModalOpen}
        productCategoryToEdit={productCategoryToEdit}
        onClose={handleCloseCreateEditProductCategoryModal} />

      <div style={{
        fontSize: '2rem',
        fontWeight: 600,
        color: '#22191b',
        margin: '20px',
        textAlign: 'center' as const,
      }}>Produktkategorier</div>

      <div style={{ margin: 'auto', padding: '1rem' }}>
        {productCategories && productCategories.map((productCategory) => (
          <div key={productCategory.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', border: '1px solid grey', borderRadius: '5px', background: '#ffffff', }}>
            <div style={{ flex: '2', padding: '0.5rem' }}>{productCategory.categoryname}</div>           
            <div style={{ flex: '3', padding: '0.5rem' }}>
              <img
                src="/images/edit-icon.png"
                alt="Edit"
                onClick={() => handleEdit(productCategory)}
                style={{ cursor: 'pointer', width: '28px', height: '28px' }}
              />
            </div>

            <div style={{ flex: '4', padding: '0.5rem' }}>
              <img
                src="/images/delete-icon.png"
                alt="Delete"
                onClick={() => handleDelete(productCategory)}
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

export default AdminProductCategories