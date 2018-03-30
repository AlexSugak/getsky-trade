ALTER TABLE `Messages` DROP CONSTRAINT `Messages_fk0_Users`;

ALTER TABLE Messages
DROP COLUMN Recipient;

