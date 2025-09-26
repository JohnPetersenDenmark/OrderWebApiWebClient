
import { ProductCategory } from './ProducCategory';
import { ProductLabel } from './ProductLabel';
import { ProductType } from './ProductType';

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

  productcategories : ProductCategory[];
  producttypes : ProductType[];
  productlabels : ProductLabel[];

  badge: string;
  weight: string;
  shelfLife: string;
  pricePerKg: string
}