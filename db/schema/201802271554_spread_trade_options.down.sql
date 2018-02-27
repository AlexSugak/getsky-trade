ALTER TABLE `Adverts` 
    DROP COLUMN `TradeCashInPerson`, 
    DROP COLUMN `TradeCashByMail`, 
    DROP COLUMN `TradeMoneyOrderByMail`, 
    DROP COLUMN `TradeOther`;
ALTER TABLE `Adverts` ADD COLUMN `TradeOptions` text NULL;
