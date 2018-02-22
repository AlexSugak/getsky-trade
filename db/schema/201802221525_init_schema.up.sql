CREATE TABLE `Adverts` (
	`Id` bigint NOT NULL AUTO_INCREMENT,
	`Type` int NOT NULL,
	`Author` bigint NOT NULL,
	`TradeOptions` text NOT NULL,
	`AmountFrom` DECIMAL NOT NULL,
	`AmountTo` DECIMAL NULL,
	`FixedPrice` DECIMAL NOT NULL,
	`PercentageAdjustment` DECIMAL NOT NULL,
	`Currency` varchar(20) NOT NULL,
	`AdditionalInfo` TEXT NOT NULL,
	`TravelDistance` bigint NOT NULL,
	`TravelDistanceUoM` varchar(20) NOT NULL,
	`Country` varchar(20) NOT NULL,
	`State` varchar(20),
	`City` varchar(255) NOT NULL,
	`PostalCode` varchar(255) NOT NULL,
	`Status` int NOT NULL,
	`CreatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`Id`)
);

CREATE TABLE `Users` (
	`Id` bigint NOT NULL AUTO_INCREMENT,
	`UserName` varchar(500) NOT NULL UNIQUE,
	`Email` varchar(500) NOT NULL UNIQUE,
	`PasswordSalt` varchar(255) NOT NULL,
	`PasswordHash` varchar(255) NOT NULL,
	`Timezone` varchar(20) NOT NULL,
	`Country` varchar(20) NOT NULL,
	`State` varchar(20) NOT NULL,
	`City` varchar(255) NOT NULL,
	`PostalCode` varchar(255) NOT NULL,
	`DistanceUnits` varchar(20) NOT NULL,
	`Currency` varchar(20) NOT NULL,
	`Status` int,
	`RegisteredAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`Id`)
);

CREATE TABLE `Messages` (
	`Id` bigint NOT NULL AUTO_INCREMENT,
	`Author` bigint NOT NULL,
	`AdvertId` bigint NOT NULL,
	`Body` TEXT NOT NULL,
	`CreatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`Id`)
);

CREATE TABLE `Countries` (
	`Code` varchar(20) NOT NULL,
	`Name` varchar(255) NOT NULL,
	PRIMARY KEY (`Code`)
);

CREATE TABLE `States` (
	`Code` varchar(20) NOT NULL UNIQUE,
	`Name` varchar(255) NOT NULL,
	PRIMARY KEY (`Code`)
);

ALTER TABLE `Adverts` ADD CONSTRAINT `Adverts_fk0` FOREIGN KEY (`Author`) REFERENCES `Users`(`Id`);

ALTER TABLE `Adverts` ADD CONSTRAINT `Adverts_fk1` FOREIGN KEY (`Country`) REFERENCES `Countries`(`Code`);

ALTER TABLE `Adverts` ADD CONSTRAINT `Adverts_fk2` FOREIGN KEY (`State`) REFERENCES `States`(`Code`);

ALTER TABLE `Users` ADD CONSTRAINT `Users_fk0` FOREIGN KEY (`Country`) REFERENCES `Countries`(`Code`);

ALTER TABLE `Users` ADD CONSTRAINT `Users_fk1` FOREIGN KEY (`State`) REFERENCES `States`(`Code`);

ALTER TABLE `Messages` ADD CONSTRAINT `Messages_fk0` FOREIGN KEY (`Author`) REFERENCES `Users`(`Id`);

ALTER TABLE `Messages` ADD CONSTRAINT `Messages_fk1` FOREIGN KEY (`AdvertId`) REFERENCES `Adverts`(`Id`);
