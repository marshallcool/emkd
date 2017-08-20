export interface User {
  id: number;
  phone: string;
  activated: boolean;
  confirmed: boolean;

  profile: UserProfile;
  image: UserImage;
  passport: UserPassport;

  roles: Role[];
}

export interface Permission {
  name: string;
}

export interface Role {
  name: string;
  permissions: Permission[];
}

export interface UserProfile {
  image: string;

  last_name: string;
  first_name: string;
  middle_name: string;

  gender: string;
  birthday: string;
  email: string;
  snils: string;
}

export interface UserImage {
  image_140: string;
  image_45: string;
  default: boolean
}

export interface UserPassport {
  issued: string;
  issue_date: string;
  subdivision_code: string;
  series: string;
  number: string;
  place_birthday: string;
  place_registration: string;
}
