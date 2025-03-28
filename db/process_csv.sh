#!/bin/bash

awk -F, '{print $1 "," $2 "," $3 "," $4 "," $5 "," $7}' /docker-entrypoint-initdb.d/Interns_2025_SWIFT_CODES.csv > /docker-entrypoint-initdb.d/Interns_2025_SWIFT_CODES.csv
