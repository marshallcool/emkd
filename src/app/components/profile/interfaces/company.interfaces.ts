import { BaseResponse } from '../../../interfaces/baseResponse.interfaces';


export interface CompanyResponse extends BaseResponse {
  companies: Company[];
}

export interface Company {
  name: string;
  address: string;
  inn: string;
  type: CompanyType;
  roles: CompanyRole[]
}

export interface CompanyType {
  name: string;
  abbreviation: string;
}

export interface CompanyRole {
  name: string;
  description: string;
}

