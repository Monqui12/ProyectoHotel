import { Injectable } from '@angular/core';
import { SQLiteConnection, CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';

const DB_HOTEL = 'myhoteldb';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;

  constructor(
  ) {
    //this.initializPlugin();
   }
  async initializPlugin(){
    this.db = await this.sqlite.createConnection(
      DB_HOTEL,
      false,
      'no-encryption',
      1,
      false
    );
    await this.db.open();
    const  roles = `CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rol varchar(40)
      
    )`;
    await this.db.execute(roles);
    const  users = `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      identificacion varchar(30) NOT NULL,
      email varchar(150) NOT NULL,
      nombres varchar(100) NOT NULL,
      apellidos varchar(100) NOT NULL,
      id_rol integer NOT NULL
    )`;
    await this.db.execute(users);
    this.creteUser();
    return true
  }
  async creteUser(){
    const users = await this.db.query(`INSERT INTO users(identificacion, email, nombres, apellidos, id_rol) values('1024', 'jjbariosm@unadvirtual.edu.co', 'John', 'Barrios', 1);`);
  }
  async getUsers(){
    const users = await this.db.query(`SELECT * FROM users;`);
    console.log(users);
    return users;
  }
}
