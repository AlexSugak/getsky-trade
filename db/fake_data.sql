DELETE FROM `getskytrade`.`Adverts`;
DELETE FROM `getskytrade`.`Users`;
DELETE FROM `getskytrade`.`Countries`;
DELETE FROM `getskytrade`.`States`;

INSERT INTO `getskytrade`.`Countries`
(`Code`, `Name`)
VALUES
("US", "United States of America"),
("GR", "Greece");

INSERT INTO `getskytrade`.`States`
(`Code`, `Name`)
VALUES
("CA", "California");

ALTER TABLE `getskytrade`.`Users` AUTO_INCREMENT = 1;
INSERT INTO `getskytrade`.`Users`
(`UserName`,
`Email`,
`PasswordSalt`,
`PasswordHash`,
`Timezone`,
`CountryCode`,
`StateCode`,
`City`,
`PostalCode`,
`DistanceUnits`,
`Currency`,
`Status`)
VALUES
("bob", "bob@bob.com", "foo", "foo", "WST", "US", "CA", "Los Angeles", "", "mi", "USD", 1),
("sam", "sam@sam.com", "foo", "foo", "CET", "GR", null, "Athens", "", "km", "EUR", 1);

ALTER TABLE `getskytrade`.`Adverts` AUTO_INCREMENT = 1;
INSERT INTO `getskytrade`.`Adverts`
(`Type`,
`Author`,
`AmountFrom`,
`AmountTo`,
`FixedPrice`,
`PercentageAdjustment`,
`Currency`,
`AdditionalInfo`,
`TravelDistance`,
`TravelDistanceUoM`,
`CountryCode`,
`StateCode`,
`City`,
`PostalCode`,
`Status`,
`TradeCashInPerson`,
`TradeCashByMail`,
`TradeMoneyOrderByMail`,
`TradeOther`)
VALUES
(1, 1, 100, null, 25, null, "USD", "will sell 100 USD of SKY with fixed price of 25 USD per 1 SKY", 12, "mi", "US", "CA", "Los Angeles", "", 1, 1, 0, 1, 0),
(1, 1, 200, null, 25, null, "USD", "will sell 200 USD of SKY with fixed price of 25 USD per 1 SKY", 12, "mi", "US", "CA", "Los Angeles", "", 1, 1, 0, 1, 0),
(2, 2, 100, null, null, null, "EUR", "will buy 100 USD of SKY", 25, "km", "GR", null, "Athens", "", 1, 1, 1, 1, 0),
(2, 2, 200, null, null, null, "EUR", "will buy 200 USD of SKY", 25, "km", "GR", null, "Athens", "", 1, 1, 1, 1, 0);

