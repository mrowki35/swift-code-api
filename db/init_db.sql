CREATE TABLE IF NOT EXISTS swift_data (
    country_iso2_code VARCHAR(2),
    swift_code VARCHAR(11),
    code_type VARCHAR(6),
    name VARCHAR(255),
    address VARCHAR(255),
    town_name VARCHAR(255),
    country_name VARCHAR(255),
    time_zone VARCHAR(255)
);


COPY swift_data(country_iso2_code, swift_code, code_type, name, address, town_name, country_name, time_zone)
FROM '/docker-entrypoint-initdb.d/Interns_2025_SWIFT_CODES.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', QUOTE '"');
