export class HeadquarterResponse {
  [key: string]: any;
  constructor(
    public address: string,
    public bankName: string,
    public countryISO2: string,
    public countryName: string,
    public isHeadquarter: boolean,
    public swiftCode: string,
    public branches: string[],
  ) {}
}
