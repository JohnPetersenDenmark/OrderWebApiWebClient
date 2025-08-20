import { Product } from '../types/Product';

export interface OrderItem {
  orderid: number,
  productid: number,
  productname: string,
   productnumber: string,
  productdescription: string,
  details: string,
  quantity: number;
  selected: boolean;
  unitprice: number,
  unitdiscountpercentage: number,
  discountedunitprice: number,
  producttype: number;
}