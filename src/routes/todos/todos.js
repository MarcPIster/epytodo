const express = require("express");
const jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");
let router = express.Router();
const bcrypt = require("bcryptjs")
const database = require("../../config/db.js");
const auth = require("../../middleware/auth")


router.get("/", auth.verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET, (err, authDate) => {
        if (err) {
            res.status(403).json("Forbidden");
        } else {
            database.connection.query("SELECT * FROM todo", function(err, result, fields) {
                if (err) {
                    res.status(404).json("internal server error");
                } else {
                    res.status(200).json(result);
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
            var myid = req.params.id;
            database.connection.query(`SELECT id FROM todo WHERE id = ${myid}`, function(err, resulllt) {
                if (err) {
                    res.status(404).json("ID not found")
                } else {
                    if (!resulllt.length) {
                        res.status(404).json("ID not found");
                    } else {
                        database.connection.query(`SELECT id, title, description, created_at, due_time, user_id, status FROM todo WHERE id = ${myid}`, function(err, result) {
                            if (err) {
                                res.status(404).json("Id not found");
                            } else {
                                res.status(200).json(result[0]);
                            }
                        });
                    }
                }
            });
        }
    });
});

router.post('/', auth.verifyToken, function(req, res) {
    var mytitle = database.connection.escape(req.body.title);
    var my_desc = database.connection.escape(req.body.description);
    var mydue_t = database.connection.escape(req.body.due_time);
    var my_userid = database.connection.escape(req.body.user_id);
    var my_status = database.connection.escape(req.body.status);

    jwt.verify(req.token, process.env.SECRET, (err, authDate) => {
        if (err) {
            res.status(403).json("Forbidden");
        } else {
            database.connection.query(`SELECT id FROM user WHERE id = ${my_userid}`, function(err_1, resulllt) {
                if (err_1) {
                    res.status(404).json("ID not found")
                } else {
                    if (!resulllt.length) {
                        res.status(404).json("ID not found");
                    } else {
                        database.connection.query(`INSERT INTO todo (title, description, due_time, status, user_id) VALUES (${mytitle},
                            ${my_desc}, ${mydue_t}, ${my_status}, ${my_userid})`, function(err, result, fields) {
                            if (err) {
                                res.status(404).json("internal server error");
                            } else {
                                var new_id = result.insertId;
                                database.connection.query(`SELECT title, description, due_time, user_id, status FROM todo WHERE id = ${new_id}`, function(err_2, res_2) {
                                    if (err_2) {
                                        res.status(404).json("internal server error");
                                    } else {
                                        res.status(201).json(res_2[0]);
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

router.delete("/:id", auth.verifyToken, (req, res) =>{
    jwt.verify(req.token, process.env.SECRET, (err, authDate) => {
        if (err) {
            res.status(403).json("Forbidden");
        } else {
            const myid = req.params.id;
            database.connection.query(`SELECT id FROM todo WHERE id = ${myid}`, function(err, resulllt) {
                if (err) {
                    res.status(404).json("ID not found")
                } else {
                    if (!resulllt.length) {
                        res.status(404).json("ID not found");
                    } else {
                        database.connection.query(`DELETE FROM todo WHERE id = ${myid}`, function(err, result) {
                            if (err) {
                                res.status(404).json("internal server error");
                            } else {
                                res.status(200).json({
                                    "msg" : "successfully deleted record number:" + myid
                                });
                            }
                        });
                    }
                }
            });
        }
    });
});

router.put("/:id", auth.verifyToken,  (req, res) => {
    var myid = req.params.id;
    jwt.verify(req.token, process.env.SECRET, (err, authDate) => {
        if (err)
            res.status(403).json("Forbidden");
        else {
            database.connection.query(`SELECT id FROM todo WHERE id = ${myid}`, function (err, resulllt) {
                if (err) {
                    res.status(404).json("ID not found")
                } else {
                    if (!resulllt.length)
                        res.status(404).json("ID not found");
                    else {
                        var test_user_id = req.body.user_id;
                        database.connection.query(`SELECT id FROM user WHERE id = ${test_user_id}`, function (err, res_2) {
                            if (err) {
                                res.status(404).json("ID not found")
                            } else {
                                if (!res_2.length)
                                    res.status(404).json("User not exist");
                                else {
                                    database.connection.query(`UPDATE todo SET title = ${database.connection.escape(req.body.title)},
                                                                            description = ${database.connection.escape(req.body.description)},
                                                                            due_time = ${database.connection.escape(req.body.due_time)},
                                                                            status      = ${database.connection.escape(req.body.status)},
                                                                            user_id     = ${database.connection.escape(req.body.user_id)}
                                                                            WHERE id = ${req.params.id}`, function (err, result, fields) {
                                        if (err) {
                                            res.status(404).json("internal server error")
                                        } else {
                                            database.connection.query(`SELECT * FROM todo WHERE user_id = ${req.params.id}`, function(err_4, result_print) {
                                                if (err_4) {
                                                    res.status(404).json("internal server error")
                                                } else {
                                                    res.status(200).json(result_print[0]);
                                                }
                                            })
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    });
});

module.exports = router;