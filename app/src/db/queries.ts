export const swift_codes_query = `SELECT address, 
                                          name as bank_name, 
                                          country_iso2_code as countryISO2, 
                                          country_name as countryName, 
                                          CASE 
                                              WHEN swift_code LIKE '%XXX' THEN 1 
                                              ELSE 0 
                                          END AS isHeadquarter, 
                                          swift_code 
                                   FROM swift_data 
                                   WHERE swift_code = $1`;