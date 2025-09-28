import React, { useEffect, useState } from 'react';

import { ProductCategory } from '../../types/ProducCategory';


import { AxiosClientGet, AxiosClientPost } from '../../types/AxiosClient';


interface ProductCategoryModalProps {
  isOpen: boolean;
  productCategoryToEdit: ProductCategory | null;
  onClose: () => void;
}

const AdminProductCategoryCreateEdit: React.FC<ProductCategoryModalProps> = ({ isOpen, onClose, productCategoryToEdit }) => {

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [productCategoryName, setProductCategoryName] = useState<string>('');
  const [productCategoryNameTouched, setProductCategoryNameTouched] = useState(false);

  

  const isProductCategoryNameValid = productCategoryName.length > 0;
  const isFormValid = isProductCategoryNameValid

  //const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    if (productCategoryToEdit !== null) {
      setProductCategoryName(productCategoryToEdit.categoryname);
    }
    else {
      setProductCategoryName('');
    }

    setProductCategoryNameTouched(false);


    setSubmitting(false);

  }, [isOpen]);

  const handleSubmit = async () => {

    const productCategoryData = {
      id: productCategoryToEdit !== null ? productCategoryToEdit.id : 0,
      categoryname: productCategoryName.trim(),
     
    }



    try {
      const response = await AxiosClientPost('/Admin/addorupdateproductcategory', productCategoryData, false);
      onClose();
    } catch (error) {
      setSubmitError('Fejl');
      console.error(error);
    } finally {
      setSubmitting(false);
    }

  };


  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // optional backdrop
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '1rem', // allow some breathing space on small screens
      }}
    >
      <div
        style={{
          backgroundColor: '#5470a9',
          padding: '1.5rem',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '500px', // stays smaller on desktop
        }}
      >
        <h2
          style={{
            backgroundColor: '#5470a9',
            padding: '1rem',
            color: 'white',
            borderRadius: '8px',
            fontSize: '1.25rem',
            textAlign: 'center',
            margin: 0,
            marginBottom: '1rem',
          }}
        >
          Produktkategori
        </h2>

        <div style={{ marginBottom: '1rem' }}>
          <input
            id="productcategory"
            type="text"
            value={productCategoryName}
            onChange={(e) => setProductCategoryName(e.target.value)}
            onBlur={() => setProductCategoryNameTouched(true)}
            placeholder="Indtast Produktkategori"
            style={{
              width: '100%',
              padding: '0.5rem',
              borderColor:
                !isProductCategoryNameValid && productCategoryNameTouched ? 'red' : undefined,
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
            disabled={submitting}
          />
        </div>

        

        

         

        <div className="flex gap-4">
                    <div className="flex-1">
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid || submitting}
                            className="w-full px-4 py-2 rounded bg-white text-black hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Ok
                        </button>
                    </div>
                    <div className="flex-1">
                        <button
                            onClick={onClose}
                            disabled={submitting}
                            className="w-full px-4 py-2 rounded bg-white text-black hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
      </div>
    </div>
  );

};

export default AdminProductCategoryCreateEdit;