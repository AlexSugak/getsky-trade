ALTER TABLE `Adverts` 
    MODIFY COLUMN `AmountFrom` DECIMAL NOT NULL,
    MODIFY COLUMN `AmountTo` DECIMAL NULL,
    MODIFY COLUMN `FixedPrice` DECIMAL NULL,
    MODIFY COLUMN `PercentageAdjustment` DECIMAL NULL;
