const express = require("express");
const path = require("path");
const Router = express.Router();
const mysqlConnection = require("./connection");

var parent_dir = path.resolve(__dirname, "..");
var static = path.join(parent_dir, "static");

/* 
   GET agent-{aid} with some pStatus
   URL : /agents?aid=1&pStatus=
*/


function rent(req, callback) {
    let aid = req.aid;
    mysqlConnection.query(

                'SELECT p.pid as pid, city, address, rent, area, bedrooms, date\
                 FROM Property p, Status s\
                 WHERE p.pid = s.pid AND s.aid = ? AND s.pStatus = "rented"',

                [aid], (err, rows, fields)=>{
                if (err) {
                    console.log(err);
                    // return {};
                    callback({});
                }
                else {
                    console.log("Requested properties rented by Agent-" + aid);
                    callback(JSON.parse(JSON.stringify(rows)));
                    // return JSON.stringify(rows);
                }
            });
}

function sold(req, callback) {
    let aid = req.aid;
    mysqlConnection.query(

                'SELECT p.pid as pid, city, address, price, area, bedrooms, date\
                 FROM Property p, Status s\
                 WHERE p.pid = s.pid AND s.aid = ? AND s.pStatus = "sold"',

                [aid], (err, rows, fields)=>{
                if (err) {
                    console.log(err);
                    callback({});
                }
                else {
                    console.log("Requested properties sold by Agent-" + aid);
                    callback(JSON.parse(JSON.stringify(rows)));
                    // return JSON.stringify(rows);
                }
            });
}

function info(req, callback) {
    let aid = req.aid;

    mysqlConnection.query(
            'SELECT a.aid as aid, name, contact, \
            (\
                SELECT COUNT(*) FROM Status s, Property p\
                WHERE s.aid = a.aid AND s.pid = p.pid AND s.pStatus = "rented"\
                GROUP BY s.aid\
            ) as countRented, \
            (\
                SELECT COUNT(*) FROM Status s, Property p\
                WHERE s.aid = a.aid AND s.pid = p.pid AND s.pStatus = "sold"\
                GROUP BY s.aid\
            ) as countSold,\
            (\
                SELECT SUM(p.rent) FROM Status s, Property p\
                WHERE s.aid = a.aid AND s.pid = p.pid AND s.pStatus = "rented"\
                GROUP BY s.aid\
            ) as profitRented,\
            (\
                SELECT SUM(p.price) FROM Status s, Property p\
                WHERE s.aid = a.aid AND s.pid = p.pid AND s.pStatus = "sold"\
                GROUP BY s.aid\
            ) as profitSold\
            FROM Agents a\
            GROUP BY a.aid HAVING a.aid = ?;'

        , [aid], (err, rows, fields)=>{
            if (err) {
                console.log(err);
                callback({});
            }
            // console.log(rows);
            // console.log(JSON.stringify(rows));
            // console.log(JSON.parse(JSON.stringify(rows)));
            callback(JSON.parse(JSON.stringify(rows)));
        });
}

module.exports = {info, rent, sold, Router};