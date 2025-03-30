# swift-code-api

## Overview
The Swift Codes API provides bank information based on country codes. This API fetches details from a PostgreSQL database using Express.js and PostgreSQL queries.

## How to run

1. Clone the Repository
   ```
   git clone <repository_url>
   cd <repository_folder>
   ```
2. Ensure Docker and Docker Compose are Installed
   ```
   docker --version
   docker-compose --version
   ```
3. Build using docker-compose
   ```
   docker-compose up --build
   ```
4. Access the Application on Localhost
   ```
   http://localhost:8080/endpoint
   ```
5. Requests examples:
   ```
   
   ```
   
## How to launch tests



## Endpoints

### Banks by swift code

```
GET /swift-codes/{swiftCode}
```
Description: Retrieve details of a single SWIFT code whether for a headquarters or branches  

***Path Parameter:***

swiftCode: string consisting 11 characters

Response Structure for headquarter swift code:
```
{
    "address": string,
    "bankName": string,
    "countryISO2": string,
    "countryName": string,
    "isHeadquarter": bool,
    "swiftCode": string
    “branches”: [
          {
          "address": string,
          "bankName": string,
          "countryISO2": string,
          "isHeadquarter": bool,
          "swiftCode": string
          },
          {
          "address": string,
          "bankName": string,
          "countryISO2": string,
          "isHeadquarter": bool,
          "swiftCode": string
          }, . . .
    ]
}
```



Response Structure for branch swift code: 
```
{
    "address": string,
    "bankName": string,
    "countryISO2": string,
    "countryName": string,
    "isHeadquarter": bool,
    "swiftCode": string
}
```

### Banks by country code 

```
GET /swift-codes/country/{countryISO2code}
```
Description: Retrieves a list of banks (headquarters) for a given country based on the country code.

 ***Path Parameter:***

countryISO2code (string): The two-letter ISO country code (e.g., US, DE, PL).


```
{
  "countryISO2code": "US",
  "countryName": "United States",
  "headquarters": [
    {
      "address": "123 Main St",
      "bankName": "Example Bank",
      "countryISO2": "US",
      "swift_code": "EXAMP123XXX"
    }
  ]
}
```

### Add record

```
POST /v1/swift-codes:
```

 Description: Adds new SWIFT code entries to the database for a specific country.


***Path Parameter:***
swiftCode: string consisting 11 characters
 
	Request Structure :
```
	{
    "address": string,
    "bankName": string,
    "countryISO2": string,
    "countryName": string,
    “isHeadquarter”: bool,
    "swiftCode": string,
}
```

Response Structure: 

```
{
    "message": string,
}

```

### Delete record


```
DELETE:  /v1/swift-codes/{swift-code}
```

Deletes swift-code data if swiftCode matches the one in the database.

Response Structure: 

```
{
    "message": string,
}
```

