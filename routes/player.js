const fs = require('fs');

module.exports = {
    addPlayerPage: (req, res) => {
        res.render('add-player.ejs', {
            title: 'Welcome to Socka | Add a new player',
            message: ''
        });
    },
    //funcion para añadir un jugador
    addPlayer: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let first_name = req.body.first_name;
        let last_name = req.bpdy.last_name;
        let position = req.body.position;
        let number = req.body.number;
        let username = req.body.username;
        let uploadedFile = req.body.image;
        let image_name = req.body.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `players`WHERE user_name = '" + username + "'"; //comprobamos que el nombre de usuario no está repetido

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.lenght > 0) {
                message = 'Username already exists';
                res.render('add-player.ejs', {
                    message,
                    title: 'Welcome to Socka | Add a new player'
                });
            } else {
                //check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') { //decimos con mimetype que solo queremos ese tipo de archivo
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => { //mv es move mover
                        if (err) {
                            return res.status(500).send(err);
                    
                        }
                        let query = "INSERT INTO `players` (first_name, last_name, position, number, image, user_name) VALUES ('"+
                        first_name + "', '" + last_name + "', '" + position + "','" + number + "', '" + image_name + "', '" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });

                    });
            } else {
                message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed."
                res.render('add-player.ejs', {
                    message,
                    title: "Welcome to Socka | Add a new player"
                });
            }
        }
    });
    },
    //funcion para editar el jugador
    editPlayerPage: (req, res) => {
        let playerId = req.params.id;
        let query = "SELECT * FROM `players` WHERE id = '" + playerId + "' "; //recogemos la id del jugador para saber cual hay q editar y comprobamos si la id del jugador existe p
        db.query(query, (err, result) => {
            if(err) {
                return res.status(500).send(err);
            }
            res.render('edit-player.ejs', {
                title: "Edit player",
                player: result[0],
                message: ''
            });
        });
    },
    editPlayer: (req, res) => {
        let playerId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;

        let query = "UPDATE `players` SET `first_name`= '" + first_name + "', `last_name`= '" + last_name + "', `position`= '" + position + "', `number`= '" + number + "' WHERE `players`.`id` = '" + playerId + "'";
        db.query (query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });

    },
    deletePlayer: (req, res) => {
        let playerId = req.params.id;
        let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
        let deleteUserQuery = 'DELETE FROM players WHERE id = "' + playerId + '"';

        db.query(getImageQuery, (err, result) => {
            if(err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;
            //fs le estamos pasando la ubicación de un fichero para borrar la imagen de la base de datos
            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};