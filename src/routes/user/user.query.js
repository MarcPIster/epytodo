database.connection.query("SELECT * FROM user", function (err, result, fields) {});
database.connection.query("SELECT * FROM todo", function (err, result, fields) {});
database.connection.query(`SELECT id FROM user WHERE id = ${myid}`, function(err, resulllt) {});
database.connection.query(`UPDATE user SET email = ${database.connection.escape(req.body.email)}, password = ${database.connection.escape(req.body.password)}, name = ${database.connection.escape(req.body.name)}, firstname = ${database.connection.escape(req.body.firstname)} WHERE id = ${req.params.id}`, function(err, result, fields) {});
database.connection.query(`SELECT id FROM user WHERE id = ${myid}`, function(err, resulllt) {});
database.connection.query(`SELECT user_id FROM todo WHERE user_id = ${myid}`, function(err_2, res_2) {});
database.connection.query(`DELETE FROM todo where user_id = ${myid}`, function(err_3,res_3) {});
database.connection.query(`DELETE FROM user WHERE id = ${myid}`, function (err, result) {});