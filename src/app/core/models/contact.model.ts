export interface EmailAddress {
  id: string;
  email: string;
  type?: 'Work' | 'Personal' | 'Other';
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  address: string;
  company: string;
  jobTitle: string;
  phoneNumber: string;
  email: string;
  status: 'Active' | 'Inactive';
}
