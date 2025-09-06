
import { ProductCategory } from './ProducCategory';

export interface OrderItem {
  orderid: number,
  productid: number,
  productname: string,
  productnumber: string,
  productdescription: string,
  details: string,
  imageurl: string,
  quantity: number;
  selected: boolean;
  unitprice: number,
  unitdiscountpercentage: number,
  discountedunitprice: number,
  producttype: number;

  productcategories : ProductCategory[]

  badge: string;
  weight: string;
  shelfLife: string;
  pricePerKg: number
}