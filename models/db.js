"use strict";

const fs = require("fs");
const path = require("path");
const config = require("../config/CONSTANTS");
var Sequelize = require("sequelize");

// Can be used to determine which DB to load
const env = process.env.NODE_ENV || "development";

// Can dynamically set the password based on local or dev
let sequelize = new Sequelize(
    config.db.schema,
    config.db.user,
    config.db.password, {
        host: env != "development" ? config.db.host : config.db.dev_host,
        dialect: "mysql",
        pool: { max: 5, min: 0, idle: 10000 },
        logging: false
    }
);

let db = {};

fs
    .readdirSync(__dirname)
    .filter(file => {
        return file.indexOf(".") !== 0 && file !== "db.js";
    })
    .forEach(file => {
        let model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch(err => {
        console.error("Unable to connect to the database:", err);
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op;
module.exports = db;