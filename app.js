const e = require("express");
const express = require("express");
const mysql = require("mysql");



const app = express();
const port = process.env.PORT || "3000";

app.use(express.urlencoded({extended:true}));
app.use(express.json());

//app.use(express.text());



const pool = mysql.createPool({
connectionLimit: 10,
host: "localhost",
user: "root",
password: "",
database: "gym"
});



app.get("/users", (req,res) => {
    pool.getConnection((err, con) => {
        if(err) throw err;
        
        const query = "SELECT * FROM users";
        con.query(query,(err,rows) => {
        
            con.release();
            if(err) throw err;

            console.log("in /all");
            res.send(JSON.stringify(rows));
    
    
     });
    
    
    });
});

app.get("/users/:id", (req,res) => {
    pool.getConnection((err, con) => {
        if(err) throw err;
        const userID = req.params.id; 
        
        const query = "SELECT * FROM users WHERE id = ?";
        con.query(query,[userID],(err,result) => {
        
            con.release();
            if(err) throw err;

            if(result && result.length){
                res.send(JSON.stringify(result[0]));
            }
            else{
                res.send(JSON.stringify("User not found"));
            }
            
    
    
     });
    
    
    });
});


app.post('/register', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err;
        const body = req.body;
        userName = body.name;
        userEmail = body.email;
        userPass = body.password;
        connection.query(`SELECT * FROM users WHERE email=?`,[userEmail], (err, result) => {
        connection.release(); // return the connection to pool
        if(result && result.length){res.send(JSON.stringify("user already exists"))}
        else{
            connection.query("INSERT INTO users(name,email,password) VALUES(?,?,?)", [userName,userEmail,userPass], (err,result) =>{
                if(err) throw err;
                res.send(JSON.stringify("successfully registered"));

            });
        }
        });
        
    });

});


app.post('/login', (req, res) => {

    pool.getConnection((err, connection) => {
        const body = req.body;
        userEmail = body.email;
        userPass = body.password;
  
        connection.query(`SELECT * FROM users WHERE email=?`,[userEmail], (err, result) => {
        connection.release(); // return the connection to pool
        if(result.length == 0){
            res.send("not exist")
        }
        else{
            if(result[0].password){
            
                if(result[0].password == userPass){
                    res.send("successfully logged in");
                }
            }
            
        }
       
    
  
    
     
       
    
          
           
        
        });
        
    });

});

app.delete('/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`user ID ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }
            
            
        })
    })
});

app.put('/update/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        //console.log(userID);
        const userID = req.params.id; 

        const body = req.body;
        userName = body.name;
        userEmail = body.email;
        userPass = body.password;
        

     
        connection.query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',[userName,userEmail,userPass,userID], (err, result) => {
            connection.release() // return the connection to pool
            if(!err){
                res.send(`user ID ${[userID]} has been updated.`);
            }
            else{
                res.send(`error`);
                console.log(err);
            }
          

        })

        console.log(req.body)
    })
})


app.listen(port, () => {
    console.log(`listening on: ${port}`);
    });
