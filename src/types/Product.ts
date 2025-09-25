
import { ProductCategory } from "./ProducCategory";
import { ProductLabel } from "./ProductLabel";
import { ProductType } from "./ProductType";

export interface Product {
  id: number;
  productnumber: string;
  name: string;
  description: string;
  details: string;
  imageurl: string;
  price: number;
  discountpercentage: number;
  discountprice: number;
  producttype: number;

  productcategories : ProductCategory[]
   producttypes : ProductType[]

     productLabels : ProductLabel[]

  badge: string,
  weight: string,
  shelflife: string,
  pricePerKg: string

  

}