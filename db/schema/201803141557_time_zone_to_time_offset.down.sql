ALTER TABLE Users DROP COLUMN TimeOffset;

ALTER TABLE Users ADD Timezone varchar(20) NOT NULL;
