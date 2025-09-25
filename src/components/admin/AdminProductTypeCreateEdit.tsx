
import React, { useEffect, useState } from 'react';
import { ProductType } from '../../types/ProductType';
import {  AxiosClientPost } from '../../types/AxiosClient';


interface ProductTypeModalProps {
  isOpen: boolean;
  productTypeToEdit: ProductType | null;
  onClose: () => void;
}

const AdminProductTypeCreateEdit: React.FC<ProductTypeModalProps> = ({ isOpen, onClose, productTypeToEdit }) => {

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [productTypeName, setProductTypeName] = useState<string>('');
  const [productTypeNameTouched, setProductTypeNameTouched] = useState(false);

  

  const isProductTypeNameValid = productTypeName.length > 0;
  const isFormValid = isProductTypeNameValid

  //const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    if (productTypeToEdit !== null) {
      setProductTypeName(productTypeToEdit.name);
    }
    else {
      setProductTypeName('');
    }

    setProductTypeNameTouched(false);


    setSubmitting(false);

  }, [isOpen]);

  const handleSubmit = async () => {

    const productTypeData = {
      id: productTypeToEdit !== null ? productTypeToEdit.id : 0,
      name: productTypeName.trim(),
     
    }



    try {
      const response = await AxiosClientPost('/Admin/addorupdateproducttype', productTypeData, false);
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
          Produkttype
        </h2>

        <div style={{ marginBottom: '1rem' }}>
          <input
            id="type"
            type="text"
            value={productTypeName}
            onChange={(e) => setProductTypeName(e.target.value)}
            onBlur={() => setProductTypeNameTouched(true)}
            placeholder="Indtast Produktkategori"
            style={{
              width: '100%',
              padding: '0.5rem',
              borderColor:
                !isProductTypeNameValid && productTypeNameTouched ? 'red' : undefined,
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
            disabled={submitting}
          />
        </div>

        

        

         

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || submitting}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor:
                isFormValid && !submitting ? '#ffb84d' : 'grey',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor:
                isFormValid && !submitting ? 'pointer' : 'not-allowed',
              marginRight: '0.5rem',
            }}
          >
            Ok 
          </button>

          <button
            onClick={onClose}
            disabled={submitting}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: !submitting ? '#ffb84d' : 'grey',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !submitting ? 'pointer' : 'not-allowed',
            }}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );

};

export default AdminProductTypeCreateEdit;