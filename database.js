const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
function addText(db, value, datetime) {
    db.run(
        `INSERT INTO text(value, datetime) VALUES ('${value}', '${datetime}')`,
        function (createResult) {
            if (createResult) throw createResult;
        }
    );
}

function displayText(id, value, datetime) {
    return {
        id: id,
        value: value,
        datetime: datetime,
    };
}

async function listText(db) {
    return new Promise(function (resolve, reject) {
        db.all(
            "SELECT rowid AS id, value, datetime FROM text",
            function (err, rows) {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            }
        );
    });
}
function deleteText(db, id) {
    db.run(`DELETE FROM text WHERE id ='${id}'`,         
    function (createResult) {
        if (createResult) throw createResult;
    })
}
function createDatabase(file) {
    let db = new sqlite3.Database(file);
    if (!fs.existsSync(file)) {
        fs.openSync(file, "w");
        let query =
            "CREATE TABLE `text` ( `id` INTEGER primary key AUTOINCREMENT, 'value' TEXT, `datetime` TEXT )";
        db.serialize(function () {
            db.run(query);
            query =
                "CREATE TABLE `image` ( `id` INTEGER primary key AUTOINCREMENT, 'value' TEXT, `datetime` TEXT )";
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
module.exports = { addText, displayText, listText, createDatabase, deleteText };
