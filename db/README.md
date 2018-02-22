# Working with database

We use MySql as a main database, storing all adverts, users, messages etc.
The DB schema is managed using [migrate](https://github.com/mattes/migrate) 

## Changing schema

In order to change DB schema, create a new migration under `/schema` folder by adding two files:

- **`<version>_<migration name>.up.sql`** stores the schema change script
- **`<version>_<migration name>.down.sql`** stores the schema "rollback" script.

Each migration should be revertable, non revertable changes or changes that lead to data loss must be avoided. 

The `version` format is **YYYYMMDDhhmm**, e.g. `201802221525` for the migration that was added on `February 22, 2018 at 15:25`

Example:
- `201802221525_init_schema.up.sql`
- `201802221525_init_schema.down.sql`

## Applying schema changes

More details on how to install and use migrate cli can be found [here](https://github.com/mattes/migrate/tree/master/cli).

### Install the migrate cli:
```sh
$ go get -u -d github.com/mattes/migrate/cli github.com/go-sql-driver/mysql
$ go build -tags 'mysql' -o /usr/local/bin/migrate github.com/mattes/migrate/cli
```

### Run all migrations against the local DB:
```sh
$ migrate -database "mysql://root:root@(localhost:3306)/getskytrade" -source file://db/schema up
```