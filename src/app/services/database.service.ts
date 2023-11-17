import { Injectable } from '@angular/core';
import { SQLiteConnection, CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';

const DB_HOTEL = 'myhoteldb';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private databaseObj!: SQLiteObject;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  tables = {
    users: 'users',
    sesion: 'user_sesion'
  }
  constructor(private sqlite: SQLite, private platform: Platform) {
    this.createDatabase();
  }
  async createDatabase() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'hotel.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.databaseObj = db;
          console.log("Database Creada");
          this.createTables();
        })
        .catch(e => console.log(e));
    })
  }
  dbState() {
    return this.isDbReady.asObservable();
  }
  async createTables() {
    this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.users} (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        nombres VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        identificacion VARCHAR(30) NOT NULL,
        correo VARCHAR(100) NOT NULL,
        id_rol INTEGER NOT NULL
      )`,
      []
    ).then((r) => {
      console.log(`tabla de ${this.tables.users} creada`);
    });

    // Sesion user
    this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.sesion} (id INTEGER PRIMARY KEY autoincrement, user varchar(30),
          fecha_sistema datetime)`,
      []
    ).then((r) => {
      console.log(`tabla de ${this.tables.sesion} creada`);
    });
  }
  async getUserSesion(){
     return await this.sqlite.create({
      name: 'hotel.db',
      location: 'default'
      }).then((db: SQLiteObject) => {
      this.databaseObj = db;
      return this.databaseObj.executeSql(
        `SELECT * FROM ${this.tables.sesion} ORDER BY fecha_sistema DESC`,
        []
      ).then((res) => {
        if(res.rows.length > 0){
          return true;
        }else{
          return false;
        }
      }).catch((er) => {
        return false;
      });
    }).catch((e) => {
      return false;
    });
  }
  async cerrarSesion() {
    this.databaseObj.executeSql(`DROP TABLE IF EXISTS ${this.tables.users}`);
    this.databaseObj.executeSql(`DROP TABLE IF EXISTS ${this.tables.sesion}`);
  }
}
