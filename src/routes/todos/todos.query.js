database.connection.query("SELECT * FROM todo", function(err, result, fields) {});
database.connection.query(`SELECT id FROM user WHERE id = ${myid}`, function(err, resulllt) {});
database.connection.query(`SELECT * FROM todo WHERE id = ${myid}`, function(err, result) {});
database.connection.query(`SELECT id FROM user WHERE id = ${my_userid}`, function(err, resulllt) {});
database.connection.query(`INSERT INTO todo (title, description, due_time, status, user_id) VALUES (${mytitle},
${my_desc}, ${mydue_t}, ${my_status}, ${my_userid})`, function(err, result, fields) {});
database.connection.query(`SELECT title, description, due_time, user_id, status FROM todo WHERE id = ${new_id}`, function(err_2, res_2) {});
database.connection.query(`SELECT id FROM todo WHERE id = ${myid}`, function(err, resulllt) {});
database.connection.query(`DELETE FROM todo WHERE id = ${myid}`, function(err, result) {});