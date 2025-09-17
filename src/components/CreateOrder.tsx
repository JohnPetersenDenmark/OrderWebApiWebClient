
import { FishShopFullDto } from '../types/FishShop';
import { TemplateSchedule } from '../types/TemplateSchedule';
import { OrderItem } from '../types/OrderItem';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { ProductType } from '../types/ProductType';
import { Product } from '../types/Product';
import { ProductCategory } from '../types/ProducCategory';
import { AxiosClientGet, AxiosClientPost } from '../types/AxiosClient';
import { useNavigate } from "react-router-dom";
import ProductCard from './ProductCard';
import Cart from './Cart';

import PickupLocation from './PickupLocation';
import { Order } from '../types/Order';
import { useCart } from './CartContext';
import { id } from 'date-fns/locale';


export default function CreateOrder() {

    const location = useLocation();
    const { fishShop, templateScedule } = (location.state as { fishShop: FishShopFullDto; templateScedule: TemplateSchedule }) || {};
    const [products, setProducts] = useState<Product[]>([]);
    const [orderItemsProduct, setOrderItemsProduct] = useState<OrderItem[]>([]);
    const [customerName, setCustomerName] = useState<string>('');
    const [nameTouched, setNameTouched] = useState(false);

    const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
    const [selectedSearchProductCategories, setSelectedSearchProductCategories] = useState<ProductCategory[]>();
    const [selectedSearchProductTypes, setSelectedSearchProductType] = useState<ProductType[]>();

    const [productTypes, setProductTypes] = useState<ProductType[]>([]);

    //  const [allOrderItems, setAllOrderItems] = useState<OrderItem[]>([]);
    const [enteredQuantity, setEnteredQuantity] = useState<string[]>([]);

    const [phone, setPhone] = useState<string>('');
    const [phoneTouched, setPhoneTouched] = useState(false);
    const [selectedMenuPoint, setSelectedMenuPoint] = useState(0);
    const [email, setEmail] = useState<string>('');
    const [emailTouched, setEmailTouched] = useState(false);

    const [comment, setComment] = useState<string>('');  // <-- Added comment state
    const [error, setError] = useState<string | null>(null);
    const [reload, setReload] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

    const navigate = useNavigate();
    const { cart } = useCart();

    const isNameValid = customerName.trim().length > 0;
    const isPhoneValid = phone.trim().length > 0;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const IsAnyOrderLines = Object.values(cart).length > 0


    const isFormValid = isNameValid && isPhoneValid && isEmailValid && IsAnyOrderLines

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const categoryResponse: any = await AxiosClientGet('/Home/productcategorylist', false);

                setProductCategories(categoryResponse)

            } catch (err) {

            }

            try {

                const productTypeResponse: any = await AxiosClientGet('/Home/producttypelist', false);

                setProductTypes(productTypeResponse)

            } catch (err) {

            }

            try {
                const productsResponse: any = await AxiosClientGet('/Home/productlist', true);

                setProducts(productsResponse);

                const tmpOrderItemsProduct: OrderItem[] = productsResponse.map((product: any) => ({
                    quantity: 1,
                    productid: product.id,
                    producttype: product.producttype,
                    productnumber: product.productnumber,
                    productname: product.name,
                    imageurl: product.imageurl,
                    productdescription: product.description,
                    details: '',
                    unitdiscountpercentage: product.discountpercentage,
                    discountedunitprice: product.discountprice,
                    unitprice: product.price,
                    orderid: 0,
                    selected: false,
                    badge: product.badge,
                    weight: product.weight,
                    shelfLife: product.shelflife,
                    pricePerKg: product.priceperkilo,

                    /*  productcategories  :  product.productcategories.map((category : ProductCategory) => (
                      {
                         id : category.id,
                         categoryname : category.categoryname
                      })) */

                    productcategories: product.productcategories,

                    producttypes: product.producttypes

                }
                ));


                let filteredByCategory;
                if (!selectedSearchProductCategories || selectedSearchProductCategories.length === 0) {
                    // nothing selected → show all products
                    filteredByCategory = tmpOrderItemsProduct;
                } else {
                    // filter products if any of their categories match any selected category
                    filteredByCategory = tmpOrderItemsProduct.filter((p) =>
                        p.productcategories?.some((cat) =>
                            selectedSearchProductCategories.some((selectedCat) => selectedCat.id === cat.id)
                        )
                    );
                }

                let filteredOrderItemProducts;
                if (!selectedSearchProductTypes || selectedSearchProductTypes.length === 0) {
                    filteredOrderItemProducts = filteredByCategory
                } else {
                      // filter products if any of their categories match any selected category
                    filteredOrderItemProducts = tmpOrderItemsProduct.filter((p) =>
                        p.producttypes?.some((type) =>
                            selectedSearchProductTypes.some((selectedCat) => selectedCat.id === type.id)
                        )
                    );


                }

                setOrderItemsProduct(filteredOrderItemProducts);

                setLoading(false);

            } catch (err) {
                setError('Failed to load locations');
                setLoading(false);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
        setCustomerName('');
        setNameTouched(false);
        setPhone('');
        setPhoneTouched(false);
        setEmail('');
        setEmailTouched(false);
        setComment('');  // Reset comment on open
        setSubmitError(null);
        setSubmitSuccess(null);
        setSubmitting(false);
    }, [selectedSearchProductCategories, selectedSearchProductTypes]);

    /*   const toggleSelection = (index: number) => {
          const updated = [...allOrderItems];
          updated[index].selected = !updated[index].selected;
          setAllOrderItems(updated);
      };
  
      const updateQuantity = (index: number, quantity: string) => {
  
          if (quantity === '') {
              enteredQuantity[index] = '';
              const updated = [...allOrderItems];
              updated[index].quantity = 0;
              setAllOrderItems(updated);
              return
              return;
              // quantityAsNumber = 0;
          }
  
          let quantityAsNumber = Number(quantity);
  
          if (!isNaN(quantityAsNumber)) {
              enteredQuantity[index] = quantity;
              const updated = [...allOrderItems];
              updated[index].quantity = quantityAsNumber;
              setAllOrderItems(updated);
              return
          }
  
  
      }; */

    function handleMenuSelection(menuItem: number) {
        setSelectedMenuPoint(menuItem);
        if (menuItem === 1) {
            navigate("/home")
        }
    }

    function categorySelectedToggle(selectedCategory: ProductCategory, index: number) {
        setSelectedSearchProductCategories(prevCategories => {
            // Check if category already exists
            const exists = prevCategories?.some(category => category.id === selectedCategory.id);

            if (exists) {
                // Remove it
                return prevCategories?.filter(category => category.id !== selectedCategory.id);
            } else {
                // Add it
                return [...(prevCategories || []), selectedCategory];
            }
        });
    }

    function isCategorySelected(category: ProductCategory) {
        return selectedSearchProductCategories?.some(c => c.id === category.id);
    }

    function productTypeSelectedToggle(selectedProductType: ProductType) {
        setSelectedSearchProductType(prevProductTypes => {
            // Check if type already exists
            const exists = prevProductTypes?.some(productType => productType.id === selectedProductType.id);

            if (exists) {
                // Remove it
                return prevProductTypes?.filter(productType => productType.id !== selectedProductType.id);
            } else {
                // Add it
                return [...(prevProductTypes || []), selectedProductType];
            }
        });
    }

    function isProductTypeSelected(productType: ProductType) {
        return selectedSearchProductTypes?.some(type => type.id === productType.id);
    }

    const SubmitOrder = async () => {
        setSubmitting(true);

        const customerOrderCodeAsString = Math.floor(1000 + Math.random() * 9000).toString();

        const orderData: Order = {
            id: 0,
            customerName: customerName.trim(),
            customerorderCode: customerOrderCodeAsString,
            phone: phone,
            email: email,
            locationId: templateScedule.locationid,
            createddatetime: new Date().toISOString(),
            modifieddatetime: new Date().toISOString(),
            payeddatetime: new Date().toISOString(),
            locationname: 'aaaa',
            locationstartdatetime: '',
            locationenddatetime: '',
            locationbeautifiedstartdatetime: 'aaa',
            locationbeautifiedTimeInterval: 'aaaa',
            totalPrice: 0,
            // totalPrice: parseFloat(getTotal()),
            templateScheduleId: templateScedule.id,
            deliveryDate: templateScedule.date,
            fishShopId: fishShop.id,
            comment: comment.trim(),
            orderlines: Object.values(cart),
            templateSchedule: templateScedule,
            fishShop: undefined

        };

        try {
            let response: any;
            response = await AxiosClientPost('/Home/createorder', orderData, false);

        } catch (error) {

            setSubmitError('Kunne ikke sende bestillingen. Prøv igen senere.');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <>
            <div className="flex flex-col gap-30  bg-customBlue text-left">
                <div className="flex">
                    {/* Column 1 */}
                    <div className="flex-1  text-white p-4 text-left">
                        <img src="/images/jjfisk_logo.svg" alt="Logo" height={100} width={100} />
                    </div>

                    {/* Column 2 with nested row */}
                    <div className="flex-1 text-white p-4">
                        <div className="grid grid-cols-5 gap-2 text-left">
                            <div className="text-2xl p-2">
                                <span
                                    onClick={() => handleMenuSelection(1)}
                                    className={`cursor-pointer hover:text-hoverYellow ${selectedMenuPoint == 1 ? 'text-hoverYellow' : 'text-white'}`} >
                                    FORSIDE
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-6 bg-customGreyLight text-left mt-10 text-2xl" >
                <div className="flex-[1]">
                    <div className=" ml-10 mb-10 font-bold">
                        Vælg kategori
                        {productCategories.map((productCategory, index) => (
                            <p
                                key={index}
                                onClick={() => categorySelectedToggle(productCategory, index)}
                                className="font-normal cursor-pointer hover:underline text-xl mt-5"
                                style={{
                                    backgroundColor: isCategorySelected(productCategory) ? "lightblue" : "white",
                                }}
                            >
                                {productCategory.categoryname}
                            </p>
                        ))}
                    </div>

                    <div className="ml-10 font-bold">
                        Vælg produkttype
                        {productTypes.map((productType, index) => (
                            <p
                                key={index}
                                onClick={() => productTypeSelectedToggle(productType)}
                                className="font-normal cursor-pointer hover:underline text-xl mt-5"
                                style={{
                                    backgroundColor: isProductTypeSelected(productType) ? "lightblue" : "white",
                                }}
                            >
                                {productType.name}
                            </p>
                        ))}
                    </div>

                </div>

                <div className="flex-[5] grid grid-cols-4 gap-6  bg-customGreyLight text-xl"
                >
                    {orderItemsProduct.map((orderItem, index) => (
                        <ProductCard orderItem={orderItem} />
                    ))}
                </div>


                <div className="flex-[1] mr-20">

                    <div className="mt-10">
                        <Cart />
                    </div>

                    <div className="text-2xl p-4 bg-gray-50 rounded-xl shadow-md mt-10">
                        <h2 className="text-xl font-bold mb-2">
                            Kontaktinfo:
                        </h2>
                        {/* Customer name */}
                        <label htmlFor="customerName" className="text-xl"></label>
                        <input
                            id="customerName"
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            onBlur={() => setNameTouched(true)}
                            placeholder="Indtast dit navn"
                            className="text-xl"
                            disabled={submitting}
                        />
                        {!isNameValid && nameTouched && (
                            <p className="text-xl" style={{ color: 'red', marginTop: '0.25rem' }}>Navn må ikke være tomt.</p>
                        )}

                        <label htmlFor="phone" className="text-xl">Telefonnummer:</label>
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onBlur={() => setPhoneTouched(true)}
                            placeholder="+451234567890 eller 12345678"
                            className="text-xl"
                            maxLength={12}
                            disabled={submitting}
                        />
                        {!isPhoneValid && phoneTouched && (
                            <p className="text-xl" style={{ color: 'red', marginTop: '0.25rem' }}>
                                Telefonnummer skal være enten 8 cifre eller '+' efterfulgt af 10 cifre.
                            </p>
                        )}

                        {/* Email */}
                        <label htmlFor="email" className="text-xl">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => setEmailTouched(true)}
                            placeholder="Indtast din email"
                            className="text-xl"
                            disabled={submitting}
                        />
                        {!isEmailValid && emailTouched && (
                            <p className="text-xl" style={{ color: 'red', marginTop: '0.25rem' }}>Indtast venligst en gyldig emailadresse.</p>
                        )}

                    </div>

                    <div className="mt-10">
                        <label htmlFor="comment" className="text-xl">Kommentarer til bestillingen:</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Skriv eventuelle ønsker eller bemærkninger her..."
                            spellCheck='false'
                            rows={3}
                            className="text-xl w-96 h-40 border rounded p-2"
                            disabled={submitting}
                        />
                    </div>

                    <div className="mt-10">
                        <button
                            onClick={SubmitOrder}
                            disabled={submitting}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor:
                                    isFormValid && !submitting ? '#5470a9' : 'grey',
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
                    </div>

                    <div className="mt-10">
                        <PickupLocation templateScedule={templateScedule} />
                    </div>

                </div>
            </div >
        </>
    );
}

