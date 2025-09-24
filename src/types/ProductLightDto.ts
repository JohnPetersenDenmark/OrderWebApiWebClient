

export interface ProductLightDto {
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

  productcategoryIds : number[]

  badge: string,
  weight: string,
  shelflife: string,
  priceperkilo: string
}
