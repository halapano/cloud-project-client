class DBHandler {
  constructor(dbclient) {
    this.client = dbclient;
  }

  connect(url, dbName, collectionName) {
    this.client.connect(url, (err, db) => {
      if (err) throw err;
      console.log("Connected to the Mongo Server!");

      // get the databse
      const dbase = db.db(dbName);

      // create/get the collection(table)
      dbase.createCollection(collectionName, (err, res) => {
        if (err) throw err;
      })
      return dbase;
    })
  }
}

module.exports = DBHandler;
