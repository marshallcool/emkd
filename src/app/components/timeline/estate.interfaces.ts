import { BaseResponse } from '../../interfaces/baseResponse.interfaces';


export interface EstateResponse extends BaseResponse {
  realty:Estate[];
}

export interface EstateType {
  id: number;
  name: string;
  parameter: string;
  abbreviation: string;
  type: string;
}

export interface Estate {
  number:string;
  floor:string;
  square:string
  cadaster:number;
  id:number;
  type: EstateType;
  house:House;
};

export interface House {
  fias_id:string;
  address:string;
  geo_lat:number;
  geo_lon: number;
}
