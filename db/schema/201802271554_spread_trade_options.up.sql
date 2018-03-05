START TRANSACTION;
ALTER TABLE `Adverts` DROP COLUMN `TradeOptions`;
ALTER TABLE `Adverts` 
    ADD COLUMN `TradeCashInPerson` bit, 
    ADD COLUMN `TradeCashByMail` bit, 
    ADD COLUMN `TradeMoneyOrderByMail` bit, 
    ADD COLUMN `TradeOther` bit;
COMMIT;

