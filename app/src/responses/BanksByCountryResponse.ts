export class BanksByCountryResponse {
    [key: string]: any; 
      constructor(
        public countryISO2: string, 
        public countryName: string, 
        public swiftCodes: string[],
      ) {}
    }
