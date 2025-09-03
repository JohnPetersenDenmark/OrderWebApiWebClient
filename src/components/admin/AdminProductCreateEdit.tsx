import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Product } from '../../types/Product';
import FileInput from "../FileInput"
import config from '../../config';
import RichtextEditorQuill from "../RichtextEditorQuill"


import { AxiosClientGet, AxiosClientPost } from '../../types/AxiosClient';


interface ProductModalProps {
    isOpen: boolean;
    productToEdit: Product | null;
    onClose: () => void;
}

const AdminProductCreateEdit: React.FC<ProductModalProps> = ({ isOpen, onClose, productToEdit }) => {


    const [submitting, setSubmitting] = useState(false);

    const [productName, setProductName] = useState<string>('');

    const [productNameTouched, setProductNameTouched] = useState(false);

    const [productNumber, setProductNumber] = useState<string>('');
    const [productNumberTouched, setProductNumberTouched] = useState(false);

    const [productDescription, setProductDescription] = useState<string>('');

    const [productDescriptionTouched, setProductDescriptionTouched] = useState(false);

     const [productDetails, setProductDetails] = useState<string>('');
       const [productDetailsTouched, setProductDetailsTouched] = useState<boolean>(false);

    const [productPriceBeforeDiscount, setProductPriceBeforeDiscount] = useState<string>('');

    const [productPriceBeforeDiscountTouched, setProductPriceBeforeDiscountTouched] = useState(false);

    const [productDiscountPercentage, setProductDiscountPercentage] = useState<string>('');

    const [productDiscountPercentageTouched, setProductDiscountPercentageTouched] = useState(false);

    const [productPriceAfterDiscount, setProductPriceAfterDiscount] = useState<string>('');

    const [productaPriceAfterDiscountTouched, setProductPriceAfterDiscountTouched] = useState(false);

    const [productImageurl, setProductImageurl] = useState<string>('');

    const [productImageurlTouched, setProductImageurlTouched] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [submitError, setSubmitError] = useState<string>('');

    const [editorHtml, setEditorHtml] = useState("");



    const isProductNameValid = productName.length > 0;
    const isProductNumberValid = productNumber.length > 0;
    const isProductDescriptionValid = setProductDescription.length > 0;
    const isPriceBeforeDiscountValid = true;
    const isProductDiscountValid = true;
    const isPriceAfterDiscountValid = true;
    const isProductDetailsValid = true;
    const isImageurlValid = productImageurl.length > 0;
    const isFormValid = isProductNameValid && isProductNumberValid && isProductDescriptionValid && isPriceBeforeDiscountValid && isProductDiscountValid && isPriceAfterDiscountValid


    useEffect(() => {
        if (!isOpen) return;

        if (productToEdit !== null) {
            setProductName(productToEdit.name);
            setProductNumber(productToEdit.productnumber)
            setProductDescription(productToEdit.description)
            setProductDetails(productToEdit.details)
            setProductPriceBeforeDiscount(productToEdit.discountprice.toFixed(2))
            setProductDiscountPercentage(productToEdit.discountpercentage.toFixed(1))
            setProductPriceAfterDiscount(productToEdit.price.toFixed(2))
            setProductImageurl(productToEdit.imageurl)

        }
        else {
            setProductName('');
            setProductNumber('')
            setProductDescription('')
            setProductDetails('');
            setProductPriceBeforeDiscount('')
            setProductDiscountPercentage('')
            setProductPriceAfterDiscount('')
            setProductImageurl('')
            setSelectedFile(null)


        }

        setProductNameTouched(false)
        setProductNumberTouched(false)
        setProductDescriptionTouched(false)
        setProductPriceBeforeDiscountTouched(false)
        setProductDiscountPercentageTouched(false)
        setProductPriceAfterDiscountTouched(false)
        setProductImageurlTouched(false)
        setProductDetailsTouched(false)

        setSubmitting(false);

    }, [isOpen]);



    const handleSubmit = async () => {

        if (!isFormValid) {
            return;
        }

        const productData = {
            id: productToEdit !== null ? productToEdit.id : 0,
            name: productName,
           
            productnumber: productNumber, 
            description: productDescription,
            details : productDetails,
            imageurl: productImageurl,
            price: productPriceAfterDiscount.replaceAll(',', '.'),
            discountpercentage: productDiscountPercentage.replaceAll(',', '.'),
            discountprice: productPriceBeforeDiscount.replaceAll(',', '.'),
            producttype: 0
        }

        if (selectedFile) {
            await handleUpload();
        }

        try {
            await AxiosClientPost('/Admin/addorupdateproduct', productData, false);
            onClose();
        } catch (error) {
            setSubmitError('Fejl');
            console.error(error);
        } finally {
            setSubmitting(false);
        }

    };

    const handlePriceBeforeDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replaceAll(',', '.');
        if (newValue === '') {
            setProductPriceBeforeDiscount('');
        } else {

            let newValueAsNumber = Number(newValue);
            if (isNaN(newValueAsNumber)) {
                return;
            }
            setProductPriceBeforeDiscount(newValue);
            setProductPriceBeforeDiscountTouched(true);
        }
    };

    const handleOnBlurPriceBeforeDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {

        const newValue = e.target.value.replaceAll(',', '.');

        if (newValue === '') {
            setProductPriceBeforeDiscount('');
        } else {
            let newValueAsNumber = Number(newValue);
            if (isNaN(newValueAsNumber)) {
                setProductPriceBeforeDiscount('0,00');
                return;
            }

            let newValueAsString = newValueAsNumber.toFixed(2);
            newValueAsString = newValueAsString.replaceAll('.', ',');

            setProductPriceBeforeDiscount(newValueAsString);


            let priceAfterDiscountString = productPriceAfterDiscount;
            priceAfterDiscountString = priceAfterDiscountString.replaceAll(',', '.')

            let priceAfterDiscount = Number(priceAfterDiscountString);
            if (isNaN(priceAfterDiscount)) {
                setProductDiscountPercentage("0,00");
                return;
            }

            if (priceAfterDiscount > newValueAsNumber) {
                setProductDiscountPercentage("0,00");
                return;
            }
            let percentageNumber = ((newValueAsNumber - priceAfterDiscount) / newValueAsNumber) * 100
            let percentageAsString = percentageNumber.toFixed(1);
            percentageAsString = percentageAsString.replaceAll('.', ',');
            setProductDiscountPercentage(percentageAsString);

        }
    };



    const handleOnBlurDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {

        const newValue = e.target.value.replaceAll(',', '.');

        if (newValue === '') {
            setProductDiscountPercentage('');
        } else {
            let newValueAsNumber = Number(newValue);
            if (isNaN(newValueAsNumber)) {
                setProductPriceAfterDiscount('0,00');
                setProductPriceBeforeDiscount(productPriceAfterDiscount)
                return;
            }

            let newValueAsString = newValueAsNumber.toFixed(1);
            newValueAsString = newValueAsString.replaceAll('.', ',');


            let productPriceAfterDiscountNumber = 0;
            if (productPriceAfterDiscount) {
                productPriceAfterDiscountNumber = Number(productPriceAfterDiscount.replaceAll(',', '.'))
            }

            if (productDiscountPercentage) {
                let productDiscountPercentageNumber = 0;
                productDiscountPercentageNumber = Number(productDiscountPercentage.replaceAll(',', '.'))

                let tmp = (1 - (productDiscountPercentageNumber / 100))
                let x = productPriceAfterDiscountNumber / tmp

                let PriceBeforeDiscountAsString = x.toFixed(2).replaceAll('.', ',');;
                setProductPriceBeforeDiscount(PriceBeforeDiscountAsString);
                return;
            }


            let PriceBeforeDiscountAsString = newValueAsNumber.toFixed(2).replaceAll('.', ',');;
            setProductPriceBeforeDiscount(PriceBeforeDiscountAsString);
            setProductDiscountPercentage(newValueAsString);


        }
    };

    const handlePriceAfterDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value.replaceAll(',', '.');
        if (newValue === '') {
            setProductPriceAfterDiscount('');
        } else {

            let newValueAsNumber = Number(newValue);
            if (isNaN(newValueAsNumber)) {
                return;
            }


            setProductPriceAfterDiscount(newValue);
            setProductPriceAfterDiscountTouched(true);
        }
    };

    const handleOnBlurPriceAfterDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {

        const newValue = e.target.value.replaceAll(',', '.');

        if (newValue === '') {
            setProductPriceAfterDiscount('');
        } else {
            let newValueAsNumber = Number(newValue);
            if (isNaN(newValueAsNumber)) {
                setProductPriceAfterDiscount('0,00');
                return;
            }
            let newValueAsString = newValueAsNumber.toFixed(2);
            newValueAsString = newValueAsString.replaceAll('.', ',');
            setProductPriceAfterDiscount(newValueAsString);


            let priceBeforeDiscountString = productPriceBeforeDiscount;
            priceBeforeDiscountString = priceBeforeDiscountString.replaceAll(',', '.');

            let priceBeforeDiscount = Number(priceBeforeDiscountString);

            if (isNaN(priceBeforeDiscount)) {
                setProductDiscountPercentage("0,00");
                return;
            }

            if (newValueAsNumber > priceBeforeDiscount) {
                setProductDiscountPercentage("0,00");
                return;
            }
            let percentageNumber = ((priceBeforeDiscount - newValueAsNumber) / priceBeforeDiscount) * 100
            let percentageAsString = percentageNumber.toFixed(1);
            percentageAsString = percentageAsString.replaceAll('.', ',');
            setProductDiscountPercentage(percentageAsString);

        }
    };

     const handleRichTextEditorChange = (editorHtml : string) => {
        setProductDetails(editorHtml)
        //setEditorHtml(editorHtml);
     }

      

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
                setProductImageurl(response.data.imageUrl)
                setProductImageurlTouched(true);
            }

            else {
                setProductImageurl('/Uploads/dummy.png')
                setProductImageurlTouched(true);
            }

            console.log('Upload success:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleFileSelect = (file: File) => {
        console.log("Parent got file:", file);
        setSelectedFile(file);
        setProductImageurl('/Uploads/' + file.name)
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
                backgroundColor: '#8d4a5b',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
        >

            <div
                style={{
                    backgroundColor: '#c7a6ac',
                    padding: '2rem',
                    borderRadius: '8px',
                    minWidth: '300px',
                    width: '90%',
                    maxWidth: '500px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                <h2 style={{ backgroundColor: '#8d4a5b', padding: '2rem', color: 'white', borderRadius: '8px', fontSize: '1.5rem' }}>Product</h2>

                <div style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '200' }}>
                    <label htmlFor="productnumber">Productnummer:</label><br />
                    <input
                        id="productnumber"
                        type="text"
                        value={productNumber}
                        onChange={(e) => setProductNumber(e.target.value)}
                        onBlur={() => setProductNumberTouched(true)}
                        placeholder="Productnummer"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isProductNumberValid && productNumberTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                        }}
                        disabled={submitting}
                    />
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 200 }}>
                    <label htmlFor="productname">Produkt:</label><br />
                    <input
                        id="productname"
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        onBlur={() => setProductNameTouched(true)}
                        placeholder="Produktnavn"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isProductNameValid && productNameTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                        }}
                        disabled={submitting}
                    />
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 200 }}>
                    <label htmlFor="productdescription">Beskrivelse:</label><br />
                    <input
                        id="productdescription"
                        type="text"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        onBlur={() => setProductDescriptionTouched(true)}
                        placeholder="Beskrivelse"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isProductDescriptionValid && productDescriptionTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                        }}
                        disabled={submitting}
                    />
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 200 }}>
                    <label htmlFor="pricebeforediscount">Pris før rabat:</label><br />
                    <input
                        id="pricebeforediscount"
                        type="text"
                        value={productPriceBeforeDiscount.replaceAll('.', ',')}
                        onChange={handlePriceBeforeDiscount}
                        onBlur={handleOnBlurPriceBeforeDiscount}
                        placeholder="Vejl. udsalgspris"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isPriceBeforeDiscountValid && productPriceBeforeDiscountTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                        }}
                        disabled={submitting}
                    />
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 200 }}>
                    <label htmlFor="xyz">Rabat i %:</label><br />
                    <input
                        id="xyz"
                        type="text"
                        readOnly
                        value={productDiscountPercentage}
                        /*  onChange={handleDiscountPercentage}
                         onBlur={handleOnBlurDiscount} */
                        placeholder="Rabat i %"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isProductDiscountValid && productDiscountPercentageTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                        }}
                        disabled={submitting}
                    />
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 200 }}>
                    <label htmlFor="priceafterdiscount">Pris efter rabat:</label><br />
                    <input
                        id="priceafterdiscount"
                        type="text"
                        value={productPriceAfterDiscount.replaceAll('.', ',')}
                        onChange={handlePriceAfterDiscount}
                        onBlur={handleOnBlurPriceAfterDiscount}
                        placeholder="Vejl. udsalgspris"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isPriceAfterDiscountValid && productPriceAfterDiscount ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                        }}
                        disabled={submitting}
                    />
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 200 }}>
                    <label htmlFor="details">Lang beskrivelse:</label><br />
                    {/* <input
                        id="details"
                        type="text"
                        value={productDetails}
                        onChange={(e) => setProductDetails(e.target.value)}
                          onBlur={() => setProductDetailsTouched(true)}
                        placeholder="Vejl. udsalgspris"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isProductDetailsValid && productDetailsTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                        }}
                        disabled={submitting}
                    /> */}
                      <RichtextEditorQuill 
                    initialValue={productDetails}
                    onChange={(html) => handleRichTextEditorChange(html)} // get final value here
                    />
                </div>
               
             
                <div
                    style={{
                        marginBottom: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem'
                    }}
                >
                    <div>
                        <img
                            src={config.API_BASE_URL + productImageurl}
                            style={{
                                maxWidth: '200px',
                                height: 'auto',
                                marginTop: '5px'
                            }}
                        />
                    </div>

                    <div>
                        <FileInput onFileSelect={handleFileSelect} />
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || submitting}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: isFormValid && !submitting ? '#8d4a5b' : 'grey',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isFormValid && !submitting ? 'pointer' : 'not-allowed',
                        marginRight: '0.5rem',
                    }}
                > Ok</button>

                <button
                    onClick={onClose}
                    disabled={submitting}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: !submitting ? '#8d4a5b' : 'grey',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: !submitting ? 'pointer' : 'not-allowed',
                        marginRight: '0.5rem',
                    }}
                > Annuler</button>
            </div>
        </div>
    )


}

export default AdminProductCreateEdit