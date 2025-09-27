import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import { SaleLocation } from '../../types/SaleLocation';
import config from '../../config';
import { AxiosClientGet, AxiosClientPost } from '../../types/AxiosClient';


interface LocationModalProps {
  isOpen: boolean;
  locationToEdit: SaleLocation | null;
  onClose: () => void;
}

const AdminPlaceCreateEdit: React.FC<LocationModalProps> = ({ isOpen, onClose, locationToEdit }) => {

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [placeName, setPlaceName] = useState<string>('');
  const [placeNameTouched, setPlaceNameTouched] = useState(false);

  const [address, setAddress] = useState<string>('');
    const [addressTouched, setAddressTouched] = useState(false);

      const [latitude, setLatitude] = useState<string>('');
    const [latitudeTouched, setLatitudeTouched] = useState(false);

        const [longitude, setLongitude] = useState<string>('');
    const [longitudeTouched, setLongitudeTouched] = useState(false);

  const isPlaceNameValid = placeName.length > 0;
  const isFormValid = isPlaceNameValid

  //const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    if (locationToEdit !== null) {
      setPlaceName(locationToEdit.locationname);
    }
    else {
      setPlaceName('');
    }

    setPlaceNameTouched(false);


    setSubmitting(false);

  }, [isOpen]);

  const handleSubmit = async () => {

    const placeData = {
      id: locationToEdit !== null ? locationToEdit.id : 0,
      locationname: placeName.trim(),
      address: address,
      latitude : latitude,
      longitude : longitude
    }



    try {
      const response = await AxiosClientPost('/Admin/addorupdatelocation', placeData, false);
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
          Pladsnavn
        </h2>

        <div style={{ marginBottom: '1rem' }}>
          <input
            id="placename"
            type="text"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            onBlur={() => setPlaceNameTouched(true)}
            placeholder="Indtast pladsnavn"
            style={{
              width: '100%',
              padding: '0.5rem',
              borderColor:
                !isPlaceNameValid && placeNameTouched ? 'red' : undefined,
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
            disabled={submitting}
          />
        </div>

         <div style={{ marginBottom: '1rem' }}>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={() => setAddressTouched(true)}
            placeholder="Indtast adresse"
            style={{
              width: '100%',
              padding: '0.5rem',              
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
            disabled={submitting}
          />
        </div>

         <div style={{ marginBottom: '1rem' }}>
          <input
            id="latitude"
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            onBlur={() => setLatitudeTouched(true)}
            placeholder="Indtast breddegrad"
            style={{
              width: '100%',
              padding: '0.5rem',              
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
            disabled={submitting}
          />
        </div>

         <div style={{ marginBottom: '1rem' }}>
          <input
            id="longitude"
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            onBlur={() => setLongitudeTouched(true)}
            placeholder="Indtast længdegrad"
            style={{
              width: '100%',
              padding: '0.5rem',              
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
                            padding: "0.5rem 1rem",
                            backgroundColor: isFormValid && !submitting ? "white" : "grey",
                            color: "black",
                            border: "none",
                            borderRadius: "4px",
                            cursor: isFormValid && !submitting ? "pointer" : "not-allowed",
                        }}
                    >
                        Ok
                    </button>

         <button
                        onClick={onClose}
                        disabled={submitting}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: !submitting ? 'white' : 'grey',
                            color: 'black',
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

export default AdminPlaceCreateEdit;