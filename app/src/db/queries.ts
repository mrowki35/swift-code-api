export const swift_codes_query = `SELECT address, 
                                          name as bank_name, 
                                          UPPER(country_iso2_code) as countryISO2, 
                                          UPPER(country_name) as countryName, 
                                          CASE 
                                              WHEN swift_code LIKE '%XXX' THEN true 
                                              ELSE false
                                          END AS isHeadquarter, 
                                          swift_code 
                                   FROM swift_data 
                                   WHERE swift_code = $1`;
export const branches_swift_codes_query = `SELECT address, 
                                   name as "bankName", 
                                   UPPER(country_iso2_code) as "countryISO2", 
                                   CASE 
                                       WHEN swift_code LIKE '%XXX' THEN true
                                       ELSE false
                                   END AS "isHeadquarter", 
                                   swift_code as "swiftCode"
                            FROM swift_data 
                            WHERE SUBSTRING(swift_code FROM 1 FOR 8) = SUBSTRING($1 FROM 1 FOR 8)`;

export const banks_by_country_query = `SELECT address, name as "bankName", UPPER(country_iso2_code) as "countryISO2", 
    CASE 
    WHEN swift_code LIKE '%XXX' THEN true
    ELSE false
    END AS "isHeadquarter", swift_code as "swiftCode" FROM swift_data 
    WHERE country_iso2_code = $1 `;

export const country_name_query = `SELECT country_name AS countryName 
 FROM swift_data 
 WHERE country_name IS NOT NULL 
   AND TRIM(country_name) != '' 
   AND country_iso2_code = $1 
 LIMIT 1`;

export const insert_swift_code_query = `
  INSERT INTO swift_data (country_iso2_code, swift_code, name, address, country_name) 
  VALUES (UPPER($1), $2, $3, $4, UPPER($5)) `;

export const delete_swift_code_query = `
 DELETE FROM swift_data WHERE swift_code = $1 `;
