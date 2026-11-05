/** Raw shape returned by DummyJSON's `/users` (used here as "employees"). Only the fields this BFF maps are declared — the real response has many more. */
export interface RawEmployee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  age: number;
  gender: string;
  image: string;
  company: {
    department: string;
    name: string;
    title: string;
  };
  address: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface RawEmployeeListResponse {
  users: RawEmployee[];
  total: number;
}
