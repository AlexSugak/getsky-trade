ALTER TABLE `Messages` DROP FOREIGN KEY `Messages_fk0_Users`;

ALTER TABLE Messages
DROP COLUMN Recipient;
