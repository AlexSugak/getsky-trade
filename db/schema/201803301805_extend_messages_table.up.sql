ALTER TABLE `Messages`
ADD `Recipient` bigint NULL;

ALTER TABLE `Messages` ADD CONSTRAINT `Messages_fk0_Users` FOREIGN KEY (`Recipient`) REFERENCES `Users`(`Id`);
