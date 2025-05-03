export interface Profile {
  id: string;
  name: string;
  company_name: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  profile: Profile;
}