-- Migration: Add new fields to birth_info table for additional birth info attributes
ALTER TABLE birth_info
  ADD COLUMN birth_city text,
  ADD COLUMN birth_state_province text,
  ADD COLUMN birth_county text,
  ADD COLUMN birth_country text,
  ADD COLUMN gender text,
  ADD COLUMN identifies_transgender boolean,
  ADD COLUMN hair_color text,
  ADD COLUMN eye_color text,
  ADD COLUMN height_ft integer,
  ADD COLUMN height_in integer,
  ADD COLUMN weight_lbs integer,
  ADD COLUMN ethnicity text; 