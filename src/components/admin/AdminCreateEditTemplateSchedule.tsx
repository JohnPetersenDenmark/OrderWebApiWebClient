import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import { SaleLocation } from '../../types/SaleLocation';
import { TemplateSchedule } from '../../types/TemplateSchedule';
import config from '../../config';
import { AxiosClientGet, AxiosClientPost } from '../../types/AxiosClient';
import { FishShop } from '../../types/FishShop';


interface LocationModalProps {
    isOpen: boolean;
    templateScheduleToEdit: TemplateSchedule | null;
    onClose: () => void;
}

const AdminCreateEditTemplateSchedule: React.FC<LocationModalProps> = ({ isOpen, onClose, templateScheduleToEdit }) => {

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [templateScheduleName, setTemplateScheduleName] = useState<string>('');
    const [templateScheduleNameTouched, setTemplateScheduleNameTouched] = useState(false);

    const [saleLocationList, setSaleLocationList] = useState<SaleLocation[]>([]);
    const [fishShopList, setFishShopList] = useState<FishShop[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [dayOfWeek, setDayOfWeek] = useState(1);
    const [locationId, setLocationId] = useState("");
     const [fishShopId, setFishShopId] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("10:00");

    const isTemplateScheduleNameValid = templateScheduleName.length > 0;
    const isFormValid = isTemplateScheduleNameValid

    //const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) return;

        if (templateScheduleToEdit !== null) {
            setTemplateScheduleName(templateScheduleToEdit.name);
        }
        else {
            setTemplateScheduleName('');
        }

        setTemplateScheduleNameTouched(false);


        setSubmitting(false);

        const fetchData = async () => {

            try {
                const saleLocationsResponse: any = await AxiosClientGet('/Home/locationlist', true);

                setSaleLocationList(saleLocationsResponse);
                setLoading(false);

            } catch (err) {
                setError('Failed to load locations');
                setLoading(false);
                console.error(err);
            } finally {
                setLoading(false);
            }

            try {
                const fishShopResponse: any = await AxiosClientGet('/Admin/fishshoplist', true);

                setFishShopList(fishShopResponse);
                setLoading(false);

            } catch (err) {
                setError('Failed to load fish shops');
                setLoading(false);
                console.error(err);
            } finally {
                setLoading(false);
            }


        }

        fetchData();

    }, [isOpen]);



    const handleSubmit = async () => {

        const placeData = {
            id: templateScheduleToEdit !== null ? templateScheduleToEdit.id : 0,
            name: templateScheduleName.trim(),
            /*   address: address,
              latitude : latitude,
              longitude : longitude */
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
                    backgroundColor: '#c7a6ac',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    width: '90%',
                    maxWidth: '500px', // stays smaller on desktop
                }}
            >
                <h2
                    style={{
                        backgroundColor: '#8d4a5b',
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
                        id="templateschedulename"
                        type="text"
                        value={templateScheduleName}
                        onChange={(e) => setTemplateScheduleName(e.target.value)}
                        onBlur={() => setTemplateScheduleNameTouched(true)}
                        placeholder="Indtast pladsnavn"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderColor:
                                !isTemplateScheduleNameValid && templateScheduleNameTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                        }}
                        disabled={submitting}
                    />
                </div>

                {/*  <div style={{ marginBottom: '1rem' }}>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={() => setAddressTouched(true)}
            placeholder="Indtast pladsnavn"
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
            placeholder="Indtast pladsnavn"
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
            placeholder="Indtast pladsnavn"
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
        </div> */}

                <div style={{ marginBottom: '1rem' }}>
                    <h3 className="font-semibold mb-2">Add Schedule</h3>
                    <div className="flex gap-2 mb-2">
                        <select value={dayOfWeek} onChange={e => setDayOfWeek(Number(e.target.value))} className="border p-2 rounded">
                            <option value={1}>Mandag</option>
                            <option value={2}>Tirsdag</option>
                            <option value={3}>Onsdag</option>
                            <option value={4}>Torsdag</option>
                            <option value={5}>Friday</option>
                            <option value={6}>Lørdag</option>
                            <option value={7}>Søndag</option>
                        </select>

                        <select value={locationId} onChange={e => setLocationId((e.target.value))} className="border p-2 rounded">
                            <option value="">Select Location</option>
                            {saleLocationList.map(saleLocation => (
                                <option key={saleLocation.id} value={saleLocation.id}>{saleLocation.locationname}</option>
                            ))}
                        </select>


                        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="border p-2 rounded" />
                        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="border p-2 rounded" />


                        <select value={fishShopId} onChange={e => setFishShopId((e.target.value))} className="border p-2 rounded">
                            <option value="">Vælg fiskebil</option>
                            {fishShopList.map(fishShop => (
                                <option key={fishShop.id} value={fishShop.id}>{fishShop.name}</option>
                            ))}
                        </select>

                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || submitting}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor:
                                isFormValid && !submitting ? '#8d4a5b' : 'grey',
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
                            backgroundColor: !submitting ? '#8d4a5b' : 'grey',
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

export default AdminCreateEditTemplateSchedule;