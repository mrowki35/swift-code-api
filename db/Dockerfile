FROM postgres:13

ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=swift_db

RUN mkdir -p /docker-entrypoint-initdb.d

COPY Interns_2025_SWIFT_CODES.csv /docker-entrypoint-initdb.d/Interns_2025_SWIFT_CODES.csv

COPY init_db.sql /docker-entrypoint-initdb.d/init_db.sql

EXPOSE 5432
