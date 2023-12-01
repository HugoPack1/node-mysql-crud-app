module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `players` cORDER BY id ASC";

        //execute query

        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: "Welcome to Socka | View Players",
                players: result
            });
        });
    },
};


