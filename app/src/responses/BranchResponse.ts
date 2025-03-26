export class BranchResponse {
    [key: string]: any; 
      constructor(
        public address: string, 
        public bankName: string, 
        public countryISO2: string, 
        public countryName: string, 
        public isHeadquarter: boolean,
        public swiftCode: string,
      ) {}
    }
