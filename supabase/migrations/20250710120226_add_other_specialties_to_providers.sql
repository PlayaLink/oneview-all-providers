-- Migration: Add other_specialties multi-select field to providers table
ALTER TABLE providers
  ADD COLUMN other_specialties text[];
