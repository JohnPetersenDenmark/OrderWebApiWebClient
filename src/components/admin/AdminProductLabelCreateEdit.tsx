import React, { useEffect, useState } from 'react';
import { ProductLabel } from '../../types/ProductLabel';
import { AxiosClientGet, AxiosClientPost } from '../../types/AxiosClient';
import FileInput from "../FileInput"
import config from '../../config';
import axios from 'axios';

interface ProductLabelModalProps {
    isOpen: boolean;
    productLabelToEdit: ProductLabel | null;
    onClose: () => void;
}

const AdminProductLabelCreateEdit: React.FC<ProductLabelModalProps> = ({ isOpen, onClose, productLabelToEdit }) => {

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [productLabelName, setProductLabelName] = useState<string>('');
    const [productLabelNameTouched, setProductLabelNameTouched] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [labelImageurl, setLabelImageurl] = useState<string>('');

    const isProductCategoryNameValid = productLabelName.length > 0;
    const isFormValid = isProductCategoryNameValid


    useEffect(() => {
        if (!isOpen) return;

        if (productLabelToEdit !== null) {
            setProductLabelName(productLabelToEdit.labelname);
            setLabelImageurl(productLabelToEdit.imageurl)
        }
        else {
            setProductLabelName('');
            setLabelImageurl('');
        }

        setProductLabelNameTouched(false);


        setSubmitting(false);

    }, [isOpen]);

    const handleUpload = async () => {
        if (!selectedFile) {
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        const url = config.API_BASE_URL + '/Admin/upload'
        try {
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (typeof response.data.imageUrl === 'string') {
                setLabelImageurl(response.data.imageUrl)
                setProductLabelNameTouched(true);
            }

            else {
                setLabelImageurl('/Uploads/dummy.png')
                setProductLabelNameTouched(true);
            }

            console.log('Upload success:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };


    const handleFileSelect = (file: File) => {
        console.log("Parent got file:", file);
        setSelectedFile(file);
        setLabelImageurl('/Uploads/' + file.name)
    };

    const handleSubmit = async () => {

        const productLabelData = {
            id: productLabelToEdit !== null ? productLabelToEdit.id : 0,
            labelname: productLabelName.trim(),
            imageurl: labelImageurl
        }

        if (selectedFile) {
            await handleUpload();
        }
        try {
            const response = await AxiosClientPost('/Admin/addorupdateproductlabel', productLabelData, false);
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
                    Produktmærkning
                </h2>

                <div style={{ marginBottom: '1rem' }}>
                    <input
                        id="productlabel"
                        type="text"
                        value={productLabelName}
                        onChange={(e) => setProductLabelName(e.target.value)}
                        onBlur={() => setProductLabelNameTouched(true)}
                        placeholder="Indtast Produktmærkning"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderColor:
                                !isProductCategoryNameValid && productLabelNameTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                        }}
                        disabled={submitting}
                    />
                </div>

                <div
                    style={{
                        marginTop: "1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1rem",
                    }}
                >
                    <img
                        src={config.API_BASE_URL + labelImageurl}
                        style={{
                            width: "200px",
                            maxWidth: "200px",
                            height: "auto",
                            marginTop: "5px",
                        }}
                    />
                    <FileInput onFileSelect={handleFileSelect} />
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

export default AdminProductLabelCreateEdit;