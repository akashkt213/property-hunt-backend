export type createPropertyType = {
  userId: string;
  propertyName: string;
  propertyLocation: string;
  price: number;
};


export type updatePropertyType ={
  userId: string;
  propertyName?: string;
  propertyLocation?: string;
  price?: number;
}