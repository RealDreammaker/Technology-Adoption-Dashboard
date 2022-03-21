create table fixed_telephone(
	entity varchar(50),
	code varchar(10),
	year int,
	fixed_subscriptions float,
	gdp float
);

create table mobile_telephone(
	entity varchar(50),
	code varchar(10),
	year int,
	mobile_subscriptions float,
	gdp float
);


create table geojson (
	geojson json
);

/*make sure to import csv and json files before running this block */
ALTER TABLE fixed_telephone ADD COLUMN ID SERIAL PRIMARY KEY;
ALTER TABLE mobile_telephone ADD COLUMN ID SERIAL PRIMARY KEY;
ALTER TABLE geojson_telephone ADD COLUMN ID SERIAL PRIMARY KEY;