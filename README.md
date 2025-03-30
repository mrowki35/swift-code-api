# swift-code-api

## Overview
The Swift Codes API provides bank information based on country codes. This API fetches details from a PostgreSQL database using Express.js and PostgreSQL queries.

## How to run

1. Clone the Repository
   ```bash
   git clone <repository_url>
   cd <repository_folder>
   ```
2. Ensure Docker and Docker Compose are Installed
   ```bash
   docker --version
   docker-compose --version
   ```
3. Build using docker-compose
   ```bash
   docker-compose up --build
   ```
4. Access the Application on Localhost
   ```bash
   http://localhost:8080/endpoint
   ```
5. Requests examples:
   
   ```bash
   curl -X DELETE "http://localhost:8080/v1/swift-codes/TEST1234" -H "Accept: application/json"
   ```
   ```bash
   curl -X DELETE "http://localhost:8080/v1/swift-codes/" -H "Accept: application/json"
   ```
   ```bash
   curl -X DELETE "http://localhost:8080/v1/swift-codes/ALBPPLPWXXX" -H "Accept: application/json"
   ```
   ```bash
   curl -X POST "http://localhost:8080/v1/swift-codes" -H "Content-Type: application/json" -d "{\"address\":\"123 Bank Street\",\"bankName\":\"Sample                  Bank\",\"countryISO2\":\"US\",\"countryName\":\"United States\",\"isHeadquarter\":true,\"swiftCode\":\"BANKUS33\"}"
   ```

   ```bash
   curl -X GET "http://localhost:8080/v1/swift-codes/country/" -H "Accept: application/json"
   ```
   ```bash
   curl -X GET "http://localhost:8080/v1/swift-codes/country/CL" -H "Accept: application/json"
   ```
   ```bash
   curl -X GET "http://localhost:8080/swift-codes/ALBPPLPWXXX" -H "Accept: application/json"
   ```
   ```bash
   curl -X GET "http://localhost:8080/swift-codes/ALBPPLPWCUS" -H "Accept: application/json"
   ```




   
7. Stopping the Services
   ```bash
   use ctrl+C in your terminal
   ```
   
## How to launch tests
1. Navigate to the app Folder
   ```bash
   cd app
   ```
2. Install Dependencies
   ```bash
   npm install
   ```
3. Add in .env file
   ```
    ENVIRONMENT=DEV
   ```
4. Build & start db container
   ```bash
   cd ../
   cd db
   docker build -t my-postgres-db .
   docker run -d --name postgres_container -p 5432:5432 my-postgres-db
   ```
6. Run the tests
   ```bash
   npm test
   ```

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

***Responses***
```
400 Bad Request → { "message": "Missing swiftCode parameter." }
```
```
500 Internal Server Error → { "message": "Internal Server Error" }
```
```
200 OK → Returns JSON with bank details & branches.
```
```
204 OK -> empty response
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
***Responses***
```
400 Bad Request → { "message": "Missing country ISO2 code parameter." }
```
```
500 Internal Server Error → { "message": "Internal Server Error" }
```
```
200 OK → Returns JSON with country and bank details.
```
```
204 OK -> empty response
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

***Responses***

```
400 Bad Request → { "message": "Missing required fields" }
```
```
400 Bad Request → { "message": "Invalid country ISO2 code. It must be exactly 2 characters." }
```
```
400 Bad Request → { "message": "Invalid isHeadquarter value. It must be a boolean (true/false)." }
```
```
400 Bad Request → { "message": "Invalid SWIFT code length. It must be 8 or 11 characters." }
```
```
409 Conflict → { "message": "SWIFT code already exists" }
```
```
500 Internal Server Error → { "message": "Internal Server Error" }
```
```
201 Created → { "message": "SWIFT code entry added successfully" }
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
***Responses***

```
400 Bad Request → { "message": "Missing swiftCode parameter." }
```
```
404 Not Found → { "message": "SWIFT code not found" }
```
```
500 Internal Server Error → { "message": "Internal Server Error" }
```
```
200 OK → { "message": "SWIFT code deleted successfully" }
```
