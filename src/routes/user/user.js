const express = require("express");
const jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");
let router = express.Router();
const bcrypt = require("bcryptjs")
const database = require("../../config/db.js");
const auth = require("../../middleware/auth")

router.get("/", auth.verifyToken, function(req, res) {
    jwt.verify(req.token, process.env.SECRET, (err, authDate) => {
        if (err) {
            res.status(403).json({
                "msg" : "Token is not valid"
            });
        } else {
            database.connection.query("SELECT id, email, password, created_at, firstname, name FROM user", function (err, result, fields){
                if (err) {
                    res.status(404).json("internal server error");
                } else {
                    res.status(200).json(result);
                }
            });
        }
    })
});

router.get("/todos", auth.verifyToken, function(req, res) {
    jwt.verify(req.token, process.env.SECRET, (err, authDate) => {
        if (err) {
            res.status(403).json("Forbidden");
        } else {
            database.connection.query("SELECT id, title, description, created_at, due_time, user_id, status FROM todo", function (err, result, fields) {
                if (err || result.length == 0) {
                    res.status(403).json("No task to find");
                } else {
                    res.status(200).json(result);
                }
            });
        }
    });
});

router.put("/:id", auth.verifyToken,  (req, res) => {
    var myid = req.params.id;
    jwt.verify(req.token, process.env.SECRET, function(err, authDate) {
        if (err) {
            res.status(403).json("Forbidden");
        } else {
            database.connection.query(`SELECT id FROM user WHERE id = ${myid}`, function(err, resulllt) {
                if (err) {
                    res.status(404).json("ID not found")
                } else {
                    if (!resulllt.length) {
                        res.status(404).json("ID not found");
                    }
                    else {
                        bcrypt.genSalt(10, function(err_gen, salt) {
                            if (err_gen) {
                                res.status(404).json("internal server error")
                            } else {
                                bcrypt.hash(`${database.connection.escape(req.body.password)}`, salt, function(err, hash) {
                                    if (err) {
                                        res.status(404).json("internal server error")
                                    } else {
                                        database.connection.query(`UPDATE user SET email = ${database.connection.escape(req.body.email)}, password = ${database.connection.escape(hash)}, name = ${database.connection.escape(req.body.name)}, firstname = ${database.connection.escape(req.body.firstname)}, created_at = ${database.connection.escape(req.body.created_at)} WHERE id = ${req.params.id}`, function(err, result, fields) {
                                            if (err) {
                                                res.status(404).json("iternal server error")
                                            } else {
                                                database.connection.query(`SELECT id, email, password, created_at, firstname, name FROM user WHERE id = ${req.params.id}`, function(err_4, result_print) {
                                                    if (err_4) {
                                                        res.status(404).json("internal server error")
                                                    } else {
                                                        res.status(200).json(result_print[0]);
                                                    }
                                                })
                                            }
                                        });
                                    }
                                })
                            }
                        })
                    }
                }
            });
        }
    });
});

router.delete("/:id", auth.verifyToken, (req, res) =>{
    jwt.verify(req.token, process.env.SECRET, (err, authDate) => {
        if (err) {
            res.status(403).json("Forbidden");
        } else {
            const myid = req.params.id;
            database.connection.query(`SELECT id FROM user WHERE id = ${myid}`, function(err, resulllt) {
                if (err) {
                    res.status(404).json("ID not found")
                } else {
                    if (!resulllt.length) {
                        res.status(404).json("ID not found");
                    } else {
                        database.connection.query(`SELECT user_id FROM todo WHERE user_id = ${myid}`, function(err_2, res_2) {
                            if (res_2.length) {
                                database.connection.query(`DELETE FROM todo where user_id = ${myid}`, function(err_3,res_3) {
                                    if (err_3) {
                                        res.status(404).json("iternal server error")
                                    } else {
                                        res.status(200).json({
                                            "msg" : "successfully deleted record number:" + myid
                                        });
                                    }
                                });
                            } else {
                                database.connection.query(`DELETE FROM user WHERE id = ${myid}`, function (err, result) {
                                    if (err) {
                                        res.status(404).json("iternal server error")
                                    } else {
                                        res.status(200).json({
                                            "msg" : "successfully deleted record number:" + myid
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
});

router.get("/:id", auth.verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET, (err, authDate) => {
        if (err) {
            res.status(403).json("Forbidden");
        } else {
            var my_param = req.params.id;
            if (!isNaN(my_param)) {
                database.connection.query(`SELECT id, email, password, created_at, firstname, name FROM user WHERE id = ${my_param}`, function (err_2,res_2) {
                    if (!res_2.length || err_2) {
                        res.status(404).send("ID not found")
                    } else {
                        res.status(200).json(res_2[0]);
                    }
                });
            } else {
                my_param = database.connection.escape(req.params.id);
                database.connection.query(`SELECT id, email, password, created_at, firstname, name FROM user WHERE email = ${my_param}`, function (err_2,res_2) {
                    if (!res_2.length || err_2) {
                        res.status(404).send("Email not found");
                    } else {
                        res.status(200).json(res_2[0]);
                    }
                });
            }
        }
    });
});

module.exports = router;