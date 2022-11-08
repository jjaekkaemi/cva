const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
let isAddData = true

function changeIsAddData(bool){
    isAddData = bool
    console.log("changeIsAddData")
    console.log(isAddData)
}
function addData(db, type, value, datetime) {
    if(isAddData){
        db.run(
            `INSERT INTO data(type, value, datetime) VALUES ('${type}','${value}', '${datetime}')`,
            function (createResult) {
                if (createResult) throw createResult;
            }
        );
    }
    else{
        changeIsAddData(true)
    }

}
function displayText(id, value, datetime) {
    return {
        id: id,
        value: value,
        datetime: datetime,
    };
}


async function getData(db){
    return new Promise(function (resolve, reject) {
        db.all(
            "SELECT rowid AS id, value, type, datetime FROM data",
            function (err, rows) {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            }
        );
    });
}

function deleteData(db, id) {
    db.run(`DELETE FROM data WHERE id ='${id}'`,         
    function (createResult) {
        if (createResult) throw createResult;
    })
}
function createDatabase(file) {
    let db = new sqlite3.Database(file);
    if (!fs.existsSync(file)) {
        fs.openSync(file, "w");
        let query =
            "CREATE TABLE `data` ( `id` INTEGER primary key AUTOINCREMENT, type INTEGER, value TEXT, `datetime` TEXT )";
        db.serialize(function () {
            db.run(query);
            
        });
        console.log("database initialized");
    }
    // else {
    //     const query = "CREATE TABLE `memo` ( `contents` TEXT, `date` TEXT )";
    //     db.serialize();
    //     db.each(query);
    // }

    return db;
}
module.exports = { addData, displayText, createDatabase, deleteData, getData, changeIsAddData };
