const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
let isAddData = true
// 페이지 정보를 추적하는 변수
let currentPage = 0;
let totalPage = 0;
const pageSize = 10;
let page_state = true;
let totalData = 0;
let db = null
let clipboard_data = []
function changeIsAddData(bool){
    isAddData = bool

}
async function addData(db, type, value, datetime) {
    if(isAddData){
        db.run(
            `INSERT INTO data(type, value, datetime) VALUES ('${type}','${value}', '${datetime.toISOString()}')`,
            function (createResult) {
                if (createResult) throw createResult;
            }
        );
        totalData++;
        totalPage = Math.ceil(totalData / pageSize);

        const offset = (currentPage - 1) * pageSize;

        // 데이터 조회
        const query = `SELECT * FROM data ORDER BY id DESC LIMIT ${pageSize} OFFSET ${offset}`;
        clipboard_data = await getLimitData(query)
        
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

function deleteExpiredData(db, clipbaord_period){
    db.run(`DELETE FROM data WHERE datetime <= date('now', '-${clipbaord_period} days');`,
        function (createResult) {
                if (createResult) throw createResult;
        }
    ) 
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

async function deleteData(db, id) {
    db.run(`DELETE FROM data WHERE id ='${id}'`,         
    function (createResult) {
        if (createResult) throw createResult;
    })
    totalData--;
    totalPage = Math.ceil(totalData / pageSize);

    if (clipboard_data.length==1) {
        currentPage--;
    }
    const offset = (currentPage - 1) * pageSize;

    // 데이터 조회
    const query = `SELECT * FROM data ORDER BY id DESC LIMIT ${pageSize} OFFSET ${offset}`;
    clipboard_data = await getLimitData(query)

}

function deleteAllData(db){
    db.run(`DELETE FROM data ;`,         
    function (createResult) {
        if (createResult) throw createResult;
    })
}
function createDatabase(file) {
    db = new sqlite3.Database(file);
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

function getLimitData(query){
  return new Promise((resolve, reject) => {
        db.all(
            query,(err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}
async function getNextData() {

  if (totalPage>currentPage) {
    // if (!page_state) currentPage++;
    // page_state = true

    currentPage++;
    console.log("currentPage",currentPage)
    const offset = (currentPage - 1) * pageSize;

    // 데이터 조회
    const query = `SELECT * FROM data ORDER BY id DESC LIMIT ${pageSize} OFFSET ${offset}`;
    clipboard_data = await getLimitData(query)
  
    }

}
async function initialize() {
  // 데이터의 총 개수 조회
  const countQuery = `SELECT COUNT(*) AS total FROM data`;
  currentPage = 0
  await new Promise((resolve, reject) => {
    db.get(countQuery, async (err, result) => {
      if (err) {
        console.error(err.message);
        reject(err);
      }

      totalData = result.total;
      totalPage = Math.ceil(totalData / pageSize);
      console.log(totalData, totalPage)
      // 초기 데이터 가져오기
      await getNextData();
      resolve();
    });
  });

}


async function getPreviousData() {
    console.log("--------------------")
    console.log("currentPage",currentPage)
  if (currentPage > 1) {
    
    // if (page_state) currentPage--;
    // page_state = false
    currentPage--;

    const offset = (currentPage - 1) * pageSize;
    console.log("currentPage",currentPage)
console.log("offset",offset)
    // 데이터 조회
    const query = `SELECT * FROM data ORDER BY id DESC LIMIT ${pageSize} OFFSET ${offset}`;
    clipboard_data = await getLimitData(query)
  }
}

function getCliboardData(){
  return clipboard_data
}
module.exports = { addData, displayText, createDatabase, deleteData, getData, changeIsAddData, deleteExpiredData, initialize, getPreviousData, getNextData, getCliboardData };
