const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
let isAddData = true
// 페이지 정보를 추적하는 변수
let currentPage = 1;
let totalPage = 0;
const pageSize = 10;
let page_state = true;
let db = null
let clipboard_data = []
function changeIsAddData(bool){
    isAddData = bool
    console.log("changeIsAddData")
    console.log(isAddData)
}
function addData(db, type, value, datetime) {
    if(isAddData){
        db.run(
            `INSERT INTO data(type, value, datetime) VALUES ('${type}','${value}', '${datetime.toISOString()}')`,
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

function deleteData(db, id) {
    db.run(`DELETE FROM data WHERE id ='${id}'`,         
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
async function initialize() {
  // 데이터의 총 개수 조회
  const countQuery = `SELECT COUNT(*) AS total FROM data`;
  db.get(countQuery, async (err, result) => {
    if (err) {
      console.error(err.message);
      return;
    }

    const totalData = result.total;
    totalPage = Math.ceil(totalData / pageSize);
    console.log(totalData, totalPage)
    // 초기 데이터 가져오기
    return await getNextData();
  });
}
async function getLimitData(query){
  return new Promise(function (resolve, reject) {
        db.all(
            query,
            function (err, rows) {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            }
        );
    });
}
async function getNextData() {
    console.log("--------------------")
    if (totalPage>=currentPage) {
            if (!page_state) currentPage++;
    page_state = true
    console.log("currentPage",currentPage)
  const offset = (currentPage - 1) * pageSize;
console.log("offset",offset)
  // 데이터 조회
  const query = `SELECT * FROM data LIMIT ${pageSize} OFFSET ${offset}`;
  clipboard_data = await getLimitData(query)
  
  // db.all(query, (err, rows) => {
  //   if (err) {
  //     console.error(err.message);
  //     return;
  //   }
  //   clipboard_data = rows
    // // 결과 처리
    // rows.forEach(row => {
    //   // 여기에서 가져온 데이터를 사용하는 로직을 작성하세요.
    //   // console.log(row);
    //   clipboard_data = row
    // });

    // 페이지 증가
    
    currentPage++;

console.log("currentPage",currentPage)
console.log("--------------------")
    // // "이전" 버튼 활성화
    // document.getElementById('previousButton').disabled = false;

    // // 마지막 페이지에 도달하면 "다음" 버튼 비활성화
    // if (currentPage > totalPage) {
    //   document.getElementById('nextButton').disabled = true;
    // }
  
    }
    return clipboard_data

}
function getPreviousData() {
    console.log("--------------------")
  if (currentPage > 2) {
    console.log("currentPage",currentPage)
    if (page_state) currentPage--;
    page_state = false
    currentPage--;

    const offset = (currentPage - 1) * pageSize;
    console.log("currentPage",currentPage)
console.log("offset",offset)
    // 데이터 조회
    const query = `SELECT * FROM data LIMIT ${pageSize} OFFSET ${offset}`;
    db.all(query, (err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }
      clipboard_data = rows
    //   // 결과 처리
      // rows.forEach(row => {
      //   // 여기에서 가져온 데이터를 사용하는 로직을 작성하세요.
      //   // console.log(row);
      //   clipboard_data = row
      // });
console.log("--------------------")
    //   // "다음" 버튼 활성화
    //   document.getElementById('nextButton').disabled = false;

    //   // 첫 페이지에서는 "이전" 버튼 비활성화
    //   if (currentPage === 1) {
    //     document.getElementById('previousButton').disabled = true;
    //   }
    });
  }
}

function getCliboardData(){
  return clipboard_data
}
module.exports = { addData, displayText, createDatabase, deleteData, getData, changeIsAddData, deleteExpiredData, initialize, getPreviousData, getNextData, getCliboardData };
