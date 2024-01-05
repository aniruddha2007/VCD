package main

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

var id int
var name string
var domain string

func main() {
	var choice int
	db := connectPostgresDB()
	for {
		fmt.Println("Choose\n1.Insert data\n2.Read data\n3.Update data\n4.Delete data\n5.Exit")
		fmt.Scan(&choice)
		switch choice {
		case 1:
			Insert(db)
		case 2:
			Read(db)
		case 3:
			Update(db)
		case 4:
			Delete(db)
		case 5:
			os.Exit(0)
		}
	}
}

// CONNECT DB

//before connecting you have to create a database and a table in psql shell (just a base code improve these code as well as you need)

func connectPostgresDB() *sql.DB {
	connstring := "user=postgres dbname=todos password='aniruddha' host=localhost port=5432 sslmode=disable"
	db, err := sql.Open("postgres", connstring)
	if err != nil {
		fmt.Println(err)
	}
	return db
}

// INSERT

func Insert(db *sql.DB) {
	id = 001
	name = "Edwin"
	domain = "golang"
	insertIntoPostgres(db, id, name, domain)

}

func insertIntoPostgres(db *sql.DB, id int, name, domain string) {
	_, err := db.Exec("INSERT INTO  students(id,name,domain) VALUES($1,$2,$3)", id, name, domain)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("value inserted")
	}
}

// READ

func Read(db *sql.DB) {
	rows, err := db.Query("SELECT * FROM students")
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("id  name    domain")
		for rows.Next() {
			rows.Scan(&id, &name, &domain)
			fmt.Printf("%d - %s - %s \n", id, name, domain)
		}

	}
}

// UPDATE

func Update(db *sql.DB) {
	id = 1
	name = "Eddie"
	_, err := db.Exec("UPDATE students SET name=$1 WHERE id=$2", name, id)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("Data updated")
	}
}

// DELETE

func Delete(db *sql.DB) {
	id = 1
	_, err := db.Exec("DELETE FROM students WHERE id=$1", id)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("Data deleted")
	}
}

// completed ?? now do it in GROM
