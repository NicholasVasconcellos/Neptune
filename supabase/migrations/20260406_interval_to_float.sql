-- Change Interval column from bigint to double precision
-- to support decimal seconds (MM:SS.ms), matching the Times table
ALTER TABLE "Exercises" ALTER COLUMN "Interval" TYPE double precision USING "Interval"::double precision;
