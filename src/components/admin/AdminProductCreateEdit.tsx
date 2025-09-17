import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Product } from '../../types/Product';
import { ProductCategory } from '../../types/ProducCategory';
import { ProductType } from '../../types/ProductType';
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

    const [badge, setBadge] = useState<string>('');
    const [badgeTouched, setBadgeTouched] = useState(false);

    const [weight, setWeight] = useState<string>('');
    const [weightTouched, setWeightTouched] = useState(false);

    const [shelflife, setShelflife] = useState<string>('');
    const [shelflifeTouched, setShelflifeTouched] = useState(false);

    const [pricePerKilo, setPricePerKilo] = useState<string>('');
    const [pricePerKiloTouched, setPricePerKiloTouched] = useState(false);

    // const [selectedProductCategories, setSelectedProductCategories] = useState<ProductCategory[]>([]);

    const [selectedProductCategories, setSelectedProductCategories] = React.useState<ProductCategory[]>([]);

     const [selectedProductTypes, setSelectedProductTypes] = React.useState<ProductType[]>([]);
     const [allProductTypes, setAllProductTypes] = useState<ProductType[]>([]);

    const [allProductCategories, setAllProductCategories] = useState<ProductCategory[]>([]);

    const [productDescriptionTouched, setProductDescriptionTouched] = useState(false);

    const [productDetails, setProductDetails] = useState<string>('');
    const [productDetailsTouched, setProductDetailsTouched] = useState<boolean>(false);

    const [productPriceBeforeDiscount, setProductPriceBeforeDiscount] = useState<string>('');

    const [productPriceBeforeDiscountTouched, setProductPriceBeforeDiscountTouched] = useState(false);

    const [productDiscountPercentage, setProductDiscountPercentage] = useState<string>('');

    const [productDiscountPercentageTouched, setProductDiscountPercentageTouched] = useState(false);

    const [productPriceAfterDiscount, setProductPriceAfterDiscount] = useState<string>('');

    const [productaPriceAfterDiscountTouched, setProductPriceAfterDiscountTouched] = useState(false);

    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const [productImageurl, setProductImageurl] = useState<string>('');

    const [productImageurlTouched, setProductImageurlTouched] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [submitError, setSubmitError] = useState<string>('');

    const [editorHtml, setEditorHtml] = useState("");



    const isProductNameValid = productName.length > 0;
    const isProductNumberValid = productNumber.length > 0;
    const isProductDescriptionValid = productDescription.length > 0;
    /*  const isBadgeValid = badge.length > 0;
     const isWeightValid = weight.length > 0;
     const isShelflifeValid = shelflife.length > 0; */

    const isBadgeValid = true;
    const isWeightValid = true;
    const isShelflifeValid = true;

    const isPricePerKiloValid = true;
    const isPriceBeforeDiscountValid = true;
    const isProductDiscountValid = true;
    const isPriceAfterDiscountValid = true;
    const isProductDetailsValid = true;
    const isImageurlValid = productImageurl.length > 0;
    const isFormValid = isProductNameValid && isProductNumberValid && isProductDescriptionValid && isPriceBeforeDiscountValid
        && isProductDiscountValid && isPriceAfterDiscountValid && isBadgeValid && isWeightValid && isShelflifeValid && isPricePerKiloValid


    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {

            try {
                const categoryResponse: any = await AxiosClientGet('/Home/productcategorylist', false);

                setAllProductCategories(categoryResponse);
                setLoading(false);

            } catch (err) {
                setError('Failed to load locations');
                setLoading(false);
                console.error(err);
            } finally {
                setLoading(false);
            }

             try {
                const typesResponse: any = await AxiosClientGet('/Home/producttypelist', false);

                setAllProductTypes(typesResponse);
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

        if (productToEdit !== null) {
            setProductName(productToEdit.name);
            setProductNumber(productToEdit.productnumber)
            setBadge(productToEdit.badge)
            setWeight(productToEdit.weight)
            setShelflife(productToEdit.shelflife)
            setPricePerKilo(productToEdit.priceperkilo.toString())
            setProductDescription(productToEdit.description)
            setProductDetails(productToEdit.details)
            setProductPriceBeforeDiscount(productToEdit.discountprice.toFixed(2))
            setProductDiscountPercentage(productToEdit.discountpercentage.toFixed(1))
            setProductPriceAfterDiscount(productToEdit.price.toFixed(2))
            setProductImageurl(productToEdit.imageurl)
            setSelectedProductCategories(productToEdit.productcategories)

        }
        else {
            setProductName('');
            setProductNumber('')
            setBadge('');
            setWeight('');
            setShelflife('');
            setPricePerKilo('')
            setProductDescription('')
            setProductDetails('');
            setProductPriceBeforeDiscount('')
            setProductDiscountPercentage('')
            setProductPriceAfterDiscount('')
            setProductImageurl('')
            setSelectedFile(null)
            setSelectedProductCategories([])


        }

        setProductNameTouched(false)
        setProductNumberTouched(false)
        setProductDescriptionTouched(false)
        setBadgeTouched(false);
        setWeightTouched(false)
        setShelflifeTouched(false)
        setPricePerKiloTouched(false)
        setProductPriceBeforeDiscountTouched(false)
        setProductDiscountPercentageTouched(false)
        setProductPriceAfterDiscountTouched(false)
        setProductImageurlTouched(false)
        setProductDetailsTouched(false)

        setSubmitting(false);

    }, [isOpen]);

    const handleChangeProductCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIds = Array.from(e.target.selectedOptions, opt => opt.value);
        if (selectedProductCategories) {

        }

        const selectedObjects = allProductCategories.filter(c => selectedIds.includes(c.id.toString()));
        setSelectedProductCategories(selectedObjects);

    };

    const handleChangeProductType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIds = Array.from(e.target.selectedOptions, opt => opt.value);
        if (selectedProductCategories) {

        }

        const selectedObjects = allProductTypes.filter(c => selectedIds.includes(c.id.toString()));
        setSelectedProductTypes(selectedObjects);

    };

    const handleSubmit = async () => {

        if (!isFormValid) {
            return;
        }

        const productData = {
            id: productToEdit !== null ? productToEdit.id : 0,
            name: productName,

            productnumber: productNumber,
            description: productDescription,
            details: productDetails,
            imageurl: productImageurl,
            price: productPriceAfterDiscount.replaceAll(',', '.'),
            discountpercentage: productDiscountPercentage.replaceAll(',', '.'),
            discountprice: productPriceBeforeDiscount.replaceAll(',', '.'),
            producttype: 0,
            badge: badge,
            weight: weight,
            shelfLife: shelflife,
            priceperkilo: pricePerKilo,
            productcategoryIds: selectedProductCategories.map(cat => cat.id),
           producttypeids: selectedProductTypes.map(productType => productType.id)
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

    const handleRichTextEditorChange = (editorHtml: string) => {
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
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#ccd4e5",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: "#5470a9",
                    padding: "2rem",
                    borderRadius: "8px",
                    minWidth: "300px",
                    width: "95%",
                    maxWidth: "1400px", // bigger to fit 3 cols nicely
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                <h2
                    style={{
                        backgroundColor: "#5470a9",
                        padding: "2rem",
                        color: "white",
                        borderRadius: "8px",
                        fontSize: "1.5rem",
                    }}
                >
                    Product
                </h2>

                {/* === 2-COLUMN GRID FOR INPUTS === */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)", // changed to 2 columns
                        gap: "1rem",
                        marginTop: "1rem",
                    }}
                >
                    {/* Product number */}
                    <div>
                        <label htmlFor="productnumber">Productnummer:</label>
                        <input
                            id="productnumber"
                            type="text"
                            value={productNumber}
                            onChange={(e) => setProductNumber(e.target.value)}
                            onBlur={() => setProductNumberTouched(true)}
                            placeholder="Productnummer"
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginTop: "0.25rem",
                                borderColor:
                                    !isProductNumberValid && productNumberTouched ? "red" : undefined,
                                borderWidth: "1.5px",
                                borderStyle: "solid",
                                borderRadius: "4px",
                            }}
                            disabled={submitting}
                        />
                    </div>

                    {/* Product name */}
                    <div>
                        <label htmlFor="productname">Produkt:</label>
                        <input
                            id="productname"
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            onBlur={() => setProductNameTouched(true)}
                            placeholder="Produktnavn"
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginTop: "0.25rem",
                                borderColor:
                                    !isProductNameValid && productNameTouched ? "red" : undefined,
                                borderWidth: "1.5px",
                                borderStyle: "solid",
                                borderRadius: "4px",
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
                            src={config.API_BASE_URL + productImageurl}
                            style={{
                                maxWidth: "200px",
                                height: "auto",
                                marginTop: "5px",
                            }}
                        />
                        <FileInput onFileSelect={handleFileSelect} />
                    </div>

                    {/* Product category - spans full width */}
                    <div >
                        <label htmlFor="productcategory" style={{ fontWeight: "bold" , color : 'white'}}>
                            Vælg produktkategori:
                        </label>
                        <select
                            multiple
                            value={selectedProductCategories?.map((c) => c.id.toString())}
                            onChange={handleChangeProductCategory}
                            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
                        >
                            {allProductCategories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.categoryname}
                                </option>
                            ))}
                        </select>
                    </div>

                     {/* Product category - spans full width */}
                    <div >
                        <label htmlFor="producttype" style={{ fontWeight: "bold" , color : 'white'}}>
                            Vælg produkttype:
                        </label>
                        <select
                            multiple
                            value={selectedProductTypes?.map((productType) => productType.id.toString())}
                            onChange={handleChangeProductType}
                            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
                        >
                            {allProductTypes.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                     {/* Product description */}
                    <div>
                        <label htmlFor="productdescription">Beskrivelse:</label>
                        <input
                            id="productdescription"
                            type="text"
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            onBlur={() => setProductDescriptionTouched(true)}
                            placeholder="Beskrivelse"
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginTop: "0.25rem",
                                borderColor:
                                    !isProductDescriptionValid && productDescriptionTouched
                                        ? "red"
                                        : undefined,
                                borderWidth: "1.5px",
                                borderStyle: "solid",
                                borderRadius: "4px",
                            }}
                            disabled={submitting}
                        />
                    </div>

                    {/* Badge */}
                    <div>
                        <label htmlFor="badge">Mærkat:</label>
                        <input
                            id="badge"
                            type="text"
                            value={badge}
                            onChange={(e) => setBadge(e.target.value)}
                            onBlur={() => setBadgeTouched(true)}
                            placeholder="Mærkat"
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginTop: "0.25rem",
                                borderColor: !isBadgeValid && badgeTouched ? "red" : undefined,
                                borderWidth: "1.5px",
                                borderStyle: "solid",
                                borderRadius: "4px",
                            }}
                            disabled={submitting}
                        />
                    </div>

                    {/* Weight */}
                    <div>
                        <label htmlFor="weight">Vægt</label>
                        <input
                            id="weight"
                            type="text"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            onBlur={() => setWeightTouched(true)}
                            placeholder="Vægt"
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginTop: "0.25rem",
                                borderColor: !isWeightValid && weightTouched ? "red" : undefined,
                                borderWidth: "1.5px",
                                borderStyle: "solid",
                                borderRadius: "4px",
                            }}
                            disabled={submitting}
                        />
                    </div>

                    {/* Shelflife */}
                    <div>
                        <label htmlFor="shelflife">Holdbarhed</label>
                        <input
                            id="shelflife"
                            type="text"
                            value={shelflife}
                            onChange={(e) => setShelflife(e.target.value)}
                            onBlur={() => setShelflifeTouched(true)}
                            placeholder="Holdbarhed"
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginTop: "0.25rem",
                                borderColor: !isShelflifeValid && shelflifeTouched ? "red" : undefined,
                                borderWidth: "1.5px",
                                borderStyle: "solid",
                                borderRadius: "4px",
                            }}
                            disabled={submitting}
                        />
                    </div>

                    {/* Price per kilo */}
                    <div>
                        <label htmlFor="priceperkilo">Kilopris</label>
                        <input
                            id="priceperkilo"
                            type="text"
                            value={pricePerKilo.replaceAll(".", ",")}
                            onChange={(e) => setPricePerKilo(e.target.value)}
                            onBlur={() => setPricePerKiloTouched(true)}
                            placeholder="Kilopris"
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginTop: "0.25rem",
                                borderColor:
                                    !isPricePerKiloValid && pricePerKiloTouched ? "red" : undefined,
                                borderWidth: "1.5px",
                                borderStyle: "solid",
                                borderRadius: "4px",
                            }}
                            disabled={submitting}
                        />
                    </div>

                    {/* Price before discount */}
                    <div>
                        <label htmlFor="pricebeforediscount">Pris før rabat:</label>
                        <input
                            id="pricebeforediscount"
                            type="text"
                            value={productPriceBeforeDiscount.replaceAll(".", ",")}
                            onChange={handlePriceBeforeDiscount}
                            onBlur={handleOnBlurPriceBeforeDiscount}
                            placeholder="Vejl. udsalgspris"
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginTop: "0.25rem",
                                borderColor:
                                    !isPriceBeforeDiscountValid && productPriceBeforeDiscountTouched
                                        ? "red"
                                        : undefined,
                                borderWidth: "1.5px",
                                borderStyle: "solid",
                                borderRadius: "4px",
                            }}
                            disabled={submitting}
                        />
                    </div>

                    {/* Discount percentage */}
                    <div>
                        <label htmlFor="xyz">Rabat i %:</label>
                        <input
                            id="xyz"
                            type="text"
                            readOnly
                            value={productDiscountPercentage}
                            placeholder="Rabat i %"
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginTop: "0.25rem",
                                borderColor:
                                    !isProductDiscountValid && productDiscountPercentageTouched
                                        ? "red"
                                        : undefined,
                                borderWidth: "1.5px",
                                borderStyle: "solid",
                                borderRadius: "4px",
                            }}
                            disabled={submitting}
                        />
                    </div>

                    {/* Price after discount */}
                    <div>
                        <label htmlFor="priceafterdiscount">Pris efter rabat:</label>
                        <input
                            id="priceafterdiscount"
                            type="text"
                            value={productPriceAfterDiscount.replaceAll(".", ",")}
                            onChange={handlePriceAfterDiscount}
                            onBlur={handleOnBlurPriceAfterDiscount}
                            placeholder="Vejl. udsalgspris"
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginTop: "0.25rem",
                                borderColor:
                                    !isPriceAfterDiscountValid && productPriceAfterDiscount
                                        ? "red"
                                        : undefined,
                                borderWidth: "1.5px",
                                borderStyle: "solid",
                                borderRadius: "4px",
                            }}
                            disabled={submitting}
                        />
                    </div>
                </div>


                {/* === FULL-WIDTH FIELDS === */}
                <div style={{ marginTop: "1.5rem" }}>
                    <label htmlFor="details">Lang beskrivelse:</label>
                    <RichtextEditorQuill
                        initialValue={productDetails}
                        onChange={(html) => handleRichTextEditorChange(html)}
                    />
                </div>

              

                {/* Buttons */}
                <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || submitting}
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: isFormValid && !submitting ? "#ffb84d" : "grey",
                            color: "white",
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
                            padding: "0.5rem 1rem",
                            backgroundColor: !submitting ? "#ffb84d" : "grey",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: !submitting ? "pointer" : "not-allowed",
                        }}
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );




}

export default AdminProductCreateEdit