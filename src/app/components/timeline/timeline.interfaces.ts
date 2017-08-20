import { BaseResponse } from '../../interfaces/baseResponse.interfaces';


export interface EventResponse extends BaseResponse {
  events: Event[];
}

export interface Event {
  date: string;
  description: string;
  href: string
  id: number;
  module: string;
  creator: any;
  status: boolean;
  title: string;
};
