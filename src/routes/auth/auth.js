const express = require("express");
const jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");
let router = express.Router();
const bcrypt = require("bcryptjs")
const database = require("../../config/db.js");



router.post('/register', function(req, res) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(`${database.connection.escape(req.body.password)}`, salt, function(err_3, hash) {
            if (err_3) {
                res.status(404).send("insert body password")
            } else {
                database.connection.query(`INSERT INTO user (email, password, name, firstname) VALUES (${database.connection.escape(req.body.email)},
                ${database.connection.escape(hash)}, ${database.connection.escape(req.body.name)},
                ${database.connection.escape(req.body.firstname)});`, function (err_2, result) {
                    if (err_2) {
                        res.status(400).json({
                            "msg": "account already exists"
                        })
                    } else {
                        var id = result.insertId
                        jwt.sign({id}, process.env.SECRET, {expiresIn : '10m'} , function(err_1, token) {
                            if (err_1) {
                                console.log(err_1)
                                res.status(400).json("invalid jwt signing")
                            } else {
                                res.status(201).json({
                                    "token": token
                                })
                            }
                        })
                    }
                }
                );
            }
        });
    });
});

router.post('/login', function(req, res) {
    database.connection.query(`SELECT * FROM user WHERE email = ${database.connection.escape(req.body.email)}`, function(err, result, fields) {
        if (err) {
            res.status(401).json({
                "msg" : "invalid credentials"
            })
        } else {
            if (result.length == 1) {
                bcrypt.compare(`${database.connection.escape(req.body.password)}`, result[0].password, function(err, result_2) {
                    if (result_2 == true) {
                        var id = result[0].id
                        jwt.sign({id}, process.env.SECRET, { expiresIn: '10m' }, (err_1, token) => {
                            if (err_1) {
                                res.status(400).json("invalid jwt signing")
                            } else {
                                res.status(201).json({
                                    "token": token
                                })
                            }
                        })
                    } else {
                        res.status(401).json({
                            "msg" : "Invalid Credentials"
                        })
                    }
                })
            } else {
                res.status(401).json({
                    "msg" : "Invalid Credential"
                })
            }
        }
    })
})

module.exports = router;