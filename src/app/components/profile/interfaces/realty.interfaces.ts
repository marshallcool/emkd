import { BaseResponse } from '../../../interfaces/baseResponse.interfaces';


export interface RealtyResponse extends BaseResponse {
  realty: Realty[];
}

export interface Realty {
  number: string;
  floor: string;
  square: string;
  cadaster: string;
  
  house: House;
  type: RealtyType;
}

export interface House {
  fias_id: string;
  address: string;
  geo_lat: string;
  geo_lon: string;
}

export interface RealtyType {
  name: string;
  parameter: string;
  abbreviation: string;
}
