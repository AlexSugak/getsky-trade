ALTER TABLE Adverts
ADD COLUMN ExpiredAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
