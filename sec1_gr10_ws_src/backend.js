
//Web service listen to port 3030

/* ('express') used for building web applications and APIs. */
const express = require('express');

/* ("dotenv") module loads environment variables from a .env file into process.env. */
const dotenv = require("dotenv");

/* ('path') module provides utilities for working with file and directory paths. */
const path = require('path');

/* To set up and configure a web server. */
const app = express();

/* Config dotenv and router */
const router = express.Router();
app.use(router)
dotenv.config();

/* This function in an Express.js application that serves static files from the 'public' directory. */
app.use(express.static(path.join(__dirname, 'public')));

/* This is needed for POST method */
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

/* Connection to MySQL */
const mysql = require('mysql2');
var connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

/* Connect to Database */
connection.connect(function (err) {
    if (err) throw err;
    console.log(`Connected DB: ${process.env.MYSQL_DATABASE}`);
});

/* a route handler for HTTP GET requests to the root path '/' of the server, using the get method of the router instance. */
router.get('/', (req, res) => {
    console.log('Request at /');
    return res.send({ message: 'Welcome to Home Page' })
})

//TEST CASE:
//method: GET
//URL: http://localhost:3030/


/*-------------------------WEB SERVICE: SIGN IN & SIGN UP-------------------------*/

/* TASK 2.1: FOR SIGN IN 
To check if the code and password match the list of administrators. */
router.post('/authentication', (req, res) => {
    console.log('Request at /login-submit');
    console.log("Login by " + req.body.code);//
    let code = req.body.code;
    let pass = req.body.password;

    /* The command we want to add data to the database. */
    let sql = `select * from admin_info where (admin_code="` + code + `" && password="` + pass + `");`;

    connection.query(sql, function (error, results) {
        if (error) throw error;
        // console.log(`${results.length} row returned`);
        if (results.length === 0) {
            console.log("Not Found");
            return res.json({ "exist": "false" });
        } else {
            console.log("Found");
            return res.json({ "exist": "true" });
        }
    });
})

//TEST CASE 1:
//method: POST
//URL: http://localhost:3030/authentication
//Body: raw JSON
// {
//     "code": "120",
//     "password": "Suphavadee"
// }

//TEST CASE 2:
//method: POST
//URL: http://localhost:3030/authentication
//Body: raw JSON
// {
//     "code": "179",
//     "password": "Ponnapassorn"
// }

//TEST CASE 3:
//method: POST
//URL: http://localhost:3030/authentication
//Body: raw JSON
// {
//     "code": "181",
//     "password": "Thadeeya"
// }

//TEST CASE 4:
//method: POST
//URL: http://localhost:3030/authentication
//Body: raw JSON
// {
//     "code": "210",
//     "password": "Ravikarn"
// }



/* TASK 2.1: FOR SIGN UP 
This is for new users who want to log in. Must fill out the form first.*/
router.post('/newuser', (req, res) => {
    console.log('Request at /signin-submit');
    console.log("Form submitted by " + req.body.code);
    /* This is the request object, which represents the HTTP request sent by the client or frontend. */
    let fname = req.body.fname;
    let lname = req.body.lname;
    let dob = req.body.dob;
    let gen = req.body.gender;
    let code = req.body.code;
    let pass = req.body.password;
    let role = req.body.role;

    /* This is login_log where we will collect information that the user entered the form on what date and time.*/
    const currentDate = new Date();
    const date = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate();
    const time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
    console.log(gen)
    console.log(role)
    console.log(`INSERT INTO admin_info VALUES('` + code + `', '` + fname + `', '` + lname + `', '` + dob + `', 
                '`+ gen + `', '` + pass + `', '` + date + " " + time + `', '` + role + `');`);
    console.log("Sign up successfully!");

    /* The command we want to add data to the database. */
    let sql = `INSERT INTO admin_info VALUES('` + code + `', '` + fname + `', '` + lname + `', '` + dob + `', 
                '`+ gen + `', '` + pass + `', '` + date + " " + time + `', '` + role + `');`;
    connection.query(sql, function (error, results) {
        if (error) throw error;
        //console.log(results);
        return res.send({ message: '::New user Sign up successfully!::'});;

    });
})
//TEST CASE 1:
//method: POST
//URL: http://localhost:3030/newuser
//Body: raw JSON
// {
//     "fname": "Kongphop",
//     "lname": "Mekmanee",
//     "dob": "2000-04-27",
//     "gender": "M",
//     "code": "075",
//     "password": "thisismypassword",
//     "role": "Admistrator"
// }

//TEST CASE 2:
//method: POST
//URL: http://localhost:3030/newuser
//Body: raw JSON
// {
//     "fname": "SomSri",
//     "lname": "Mechock",
//     "dob": "1997-02-14",
//     "gender": "F",
//     "code": "007",
//     "password": "immakillergurl",
//     "role": "Admistrator"
// }



/*-------------------------WEB SERVICE: PRODUCT-------------------------*/

/* THIS PATH FOR SELECT ALL TICKET */
router.get('/tickets', function (req, res) {
    /* The command we want to select all data from the database. */
    const sql = "SELECT * FROM ticket"
    connection.query(sql, (err, results) => {
        if (err) return res.json(err);
        return res.send(results);
    });
});
//TEST CASE:
//method: GET
//URL: http://localhost:3030/tickets


/* THIS PATH FOR SELECT A TICKET BASED ON ticket_code*/
router.get('/ticket/:ticket_code', function (req, res) {
    let ticket_code = req.params.ticket_code;
    if (!ticket_code) {
        return res.status(404).send({ error: true, message: 'Please provide Ticket information.' });
    }

    /* The command we want to select data by ticket_code from the database. */
    connection.query('SELECT * FROM ticket where ticket_code=?', ticket_code, function (err, results) {
        if (err) throw err;
        // return res.send({ error: false, data: results[0], message: 'Ticket retrieved' });
        res.json(results[0]);
        console.log(`Sending product result of ticket_code = ${ticket_code}`);
    });
});
//TEST CASE: 1
//method: GET
//URL: http://localhost:3030/tickets/TK_01
//OUTPUT: It will print result of ticket_code = TK_01

//TEST CASE: 2
//method: GET
//URL: http://localhost:3030/tickets/TK_02
//OUTPUT: It will print result of ticket_code = TK_02


/* TASK 2.2: Part 1 */
//SEARCH for TICKET in each criteria => By name, location, and date
router.post('/searchticket', (req, res) => {
    console.log("::Welcome to path search ticket::");
    console.log("---------------------------------");
    
    /* This is the request object, which represents the HTTP request sent by the client or frontend. */
    let ticket_title = req.body.name;
    let ticket_loca = req.body.location;
    let ticket_date = req.body.date;
    console.log("Search by name: " + ticket_title + "| Search by location: " + ticket_loca + "| Search by: date: " + ticket_date);
    
    /* The command we want to select data from the database by name, location, and date. */
    let queryString = `select * from ticket where ticket_title like '%${ticket_title}%' and ticket_loca like '%${ticket_loca}%' and ticket_date like '%${ticket_date}%';`;
    // check if each query attribute has a value or not
    connection.query(queryString, (error, results) => {
        if (error) throw error;
        console.log(`${results.length} result(s) found`);
        console.log("---------------------------------");
        return res.send(results);
    });
});

//TEST CASE: 1 (NO CRITERIA)
//method: POST
//URL: http://localhost:3030/searchticket
//Body: raw JSON
// {
//   "name": "",
//   "location": "",
//   "date": ""    
// }

//TEST CASE: 2 (SEARCH BY NAME)
//method: POST
//URL: http://localhost:3030/searchticket
//Body: raw JSON
// {
//   "name": "19",
//   "location": "",
//   "date": ""    
// }

//TEST CASE: 3 (SEARCH BY LOCATION)
//method: POST
//URL: http://localhost:3030/searchticket
//Body: raw JSON
// {
//   "name": "",
//   "location": "impact",
//   "date": ""    
// }

//TEST CASE: 4 (SEARCH BY DATE)
//method: POST
//URL: http://localhost:3030/searchticket
//Body: raw JSON
// {
//   "name": "",
//   "location": "",
//   "date": "2023-04"    
// }

//TEST CASE: 5 (SEARCH BY NAME and LOCATION)
//method: POST
//URL: http://localhost:3030/searchticket
//Body: raw JSON
// {
//   "name": "o",
//   "location": "impact",
//   "date": ""    
// }

//TEST CASE: 6 (SEARCH BY NAME and DATE)
//method: POST
//URL: http://localhost:3030/searchticket
//Body: raw JSON
// {
//   "name": "o",
//   "location": "",
//   "date": "2023"    
// }

//TEST CASE: 7 (SEARCH BY LOCATION and DATE)
//method: POST
//URL: http://localhost:3030/searchticket
//Body: raw JSON
// {
//   "name": "",
//   "location": "g",
//   "date": "2023"    
// }

//TEST CASE: 8 (SEARCH BY NAME and LOCATION and DATE)
//method: POST
//URL: http://localhost:3030/searchticket
//Body: raw JSON
// {
//   "name": "1975",
//   "location": "arena",
//   "date": "2023-04"    
// }



/* TASK 2.2: Part 2 */
/* INSERT TICKET */
router.post('/insertticket', function (req, res) {
    /* This is the request object, which represents the HTTP request sent by the client or frontend. */
    let t_code = req.body.t_code;
    let t_title = req.body.t_title;
    let t_img = req.body.t_img;
    let t_desc = req.body.t_desc;
    let t_loca = req.body.t_loca;
    let t_date = req.body.t_date;
    let t_time = req.body.t_time;
    let t_price = req.body.t_price;
    console.log(t_code + " " + t_title + " " + t_img + " " + t_desc + " " + t_loca + " " + t_date + " " + t_time + " " + t_price)

    /* The command we want to add data to the database. */
    let insertSql = `INSERT INTO ticket VALUES('` + t_code + `', '` + t_title + `', '` + t_img + `', '` + t_desc + `', '` + t_loca + `', '` + t_date + `', '` + t_time + `', '` + t_price + `');`;

    connection.query(insertSql, function (error, insertResults) {
        if (error) throw error;
        if (insertResults.affectedRows === 0) {
            console.log("No rows inserted.");
            return res.status(500).send("No rows inserted.");
        }
        console.log(`${insertResults.affectedRows} row(s) inserted`);
        res.json({ "message": "Ticket has been updated successfully." });
    });
});

//TEST CASE: 1
//method: POST
//URL: http://localhost:3030/insertticket
// Body: raw JSON
//{
//    "t_code": "TK_12",
//    "t_title": "HALOO JAW FESTIVAL",
//    "t_img": "https://s3-ap-southeast-1.amazonaws.com/tm-img-poster-event/623cea40b98d11ed911101117567899b.jpg?format=basic&resize=w425,h610",
//    "t_desc": "THAILAND's world-beating Reggae / Indie rockers ‘Sticky Fingers’ return to Bangkok for the first Summer Watersports & Music Festival in Town. With a supported by 9 local rising bands for the Sunrise Main stage.",
//    "t_loca": "LANDSCAPE Muangthong Thani",
//    "t_date": "2023-04-29",
//    "t_time": "12:00:00",
//    "t_price": 1800
// }

//TEST CASE: 2
//method: POST
//URL: http://localhost:3030/insertticket
// Body: raw JSON
//{
//    "t_code": "TK_13",
//    "t_title": "CORY WONG LIVE IN JAPANNN",
//    "t_img": "https://s3-ap-southeast-1.amazonaws.com/tm-img-poster-event/9f3ebb70b0d311ed911101117567899b.jpg?format=basic&resize=w425,h610",
//    "t_desc": "MANGO Presents \"THE 1975 : At their very best\" live in Bangkok 2023",
//    "t_loca": "MOON WALK STUDIO",
//    "t_date": "2023-06-02",
//    "t_time": "20:00:00",
//    "t_price": 2300
// }




/* TASK 2.3: Part 3 */
router.put('/updateticket', function (req, res) {
    /* This is the request object, which represents the HTTP request sent by the client or frontend. */
    let ticket_code = req.body.ticket_code;
    let ticket_title = req.body.ticket_title;
    let ticket_img = req.body.ticket_img;
    let ticket_desc = req.body.ticket_desc;
    let ticket_loca = req.body.ticket_loca;
    let ticket_date = req.body.ticket_date;
    let ticket_time = req.body.ticket_time;
    let ticket_price = req.body.ticket_price;

    if (!ticket_code) {
        return res.status(404).send({ error: ticket, message: 'Please provide ticket information' });
    }
    console.log(ticket_code)
    /* The command we want to update data to the database. */
    connection.query("UPDATE ticket SET ticket_title='" + ticket_title + "', ticket_img='" + ticket_img + "',ticket_desc='" + ticket_desc + "',ticket_loca='" + ticket_loca + "',ticket_date='" + ticket_date + "',ticket_time='" + ticket_time + "',ticket_price='" + ticket_price + "' WHERE ticket_code = '" + ticket_code + "'", function (err, results) {
        if (err) throw err;
        return res.send({ error: false, data: results.affectedRows, message: 'Ticket has been updated successfully.' })
    });
});
//TEST CASE: 1
//method: PUT
//URL: http://localhost:3030/updateticket
// Body: raw JSON

//{
//         "ticket_code": "TK_12",
//         "ticket_title": "CONCERT IN PATTAYAA",
//         "ticket_img": "https://s.yimg.com/ny/api/res/1.2/ZzAHlDHi8a2xdBRRbruaYQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTkyOA--/https://media.zenfs.com/en/homerun/feed_manager_auto_publish_494/d05a3f087fa57f6d41b865d53a42a5f5",
//         "ticket_desc": "This Show is on the PATTAYA BEACHHHHHHHHHH LETS GOOOOO",
//         "ticket_loca": "PATTAHAYA STUDIO",
//         "ticket_date": "2024-06-01",
//         "ticket_time": "23:00:00",
//         "ticket_price": 2900
// }

//TEST CASE: 2
//method: PUT
//URL: http://localhost:3030/updateticket
// Body: raw JSON
//{
//         "ticket_code": "TK_13",
//         "ticket_title": "CORY WONG LIVE IN BANGKOK",
//         "ticket_img": "https://s3-ap-southeast-1.amazonaws.com/tm-img-poster-event/9f3ebb70b0d311ed911101117567899b.jpg?format=basic&resize=w425,h610",
//         "ticket_desc": "Mangosteenfest Presents \"THE 1975 : At their very best\" live in Bangkok 2023",
//         "ticket_loca": "MOONSTAR STUDIO",
//         "ticket_date": "2023-06-01",
//         "ticket_time": "20:00:00",
//         "ticket_price": 2300
// }



/* TASK 2.2: Part 4 */
router.delete('/deleteticket', function (req, res) {
    let ticket_code = req.body.t_code;
    if (!ticket_code) {
        return res.status(404).send({ error: true, message: 'Please provide your Ticket Code' });
    }
    /* The command we want to delete data from the database. */
    connection.query('DELETE FROM ticket WHERE ticket_code = ?', [ticket_code], function (err, results) {
        if (err) throw err;
        return res.send({ error: false, data: results.affectedRows, message: 'Ticket has been deleted successfully.' });
    });
});

//TEST CASE: 1
//method: DELETE
//URL: http://localhost:3030/deleteticket
// Body: raw JSON
// {
//     "t_code": "TK_12"
// }

//TEST CASE: 2
//method: DELETE
//URL: http://localhost:3030/deleteticket
// Body: raw JSON
// {
//     "t_code": "TK_13"
// }



/*-------------------------WEB SERVICE: ADMINISTRATOR-------------------------*/

//GET ADMIN USER
router.get('/admin_infos', function (req, res) {
    /* The command we want to select all data from the database. */
    connection.query('SELECT * FROM admin_info', (err, results) => {
        if (err) throw err;
        return res.send({ error: false, data: results, message: 'Admin User list.' });
    });
});

//TEST CASE:
//method: GET
//URL: http://localhost:3030/admin_infos


//SELECT a ADMIN USER
router.get('/admin_infos/:admin_code', function (req, res) {
    let admin_code = req.params.admin_code;
    if (!admin_code) {
        return res.status(404).send({ error: true, message: 'Please provide admin code id.' });
    }
    /* The command we want to select data from the database by using admin_code. */
    connection.query('SELECT * FROM admin_info where admin_code=?', admin_code, (err, results) => {
        if (err) throw err;
        res.send({ error: false, data: results[0], message: 'Admin User retrieved' });
        console.log(`Sending admin result of admin_code = ${admin_code}`);
    });
});
//TEST CASE: 1
//method: GET
//URL: http://localhost:3030/admin_infos/001
//OUTPUT: It will print result of admin_code = 001

//TEST CASE: 2
//method: GET
//URL: http://localhost:3030/admin_infos/002
//OUTPUT: It will print result of admin_code = 002


/* TASK 2.3: Part 1: SEARCH */
//SEARCH for admin_info in each criteria => By code, name, and date
router.post('/searchadmin', (req, res) => {
    let code = req.body.code;
    let name = req.body.name;
    let date = req.body.date;
    console.log(name)

    /* The command we want to select data from the database by code, name, and date. */
    let sql = `select * from admin_info where (fname like '%${name}%' or lname like '%${name}%') and admin_code like '%${code}%' and dob like '%${date}%';`;
    console.log('search by Code: '+ code + '| search by Name: ' +name + '| search by Date of Birth: ' + date);
    connection.query(sql, (error, results) => {
        if (error) throw error;
        console.log(results.length + ' result(s) found');
        console.log("---------------------------------");
        res.send(results);
    });
});

//TEST CASE: 1 (NO CRITERIA)
//method: POST
//URL: http://localhost:3030/searchadmin
//Body: raw JSON
// {
//     "code": "",
//     "name": "",
//     "date": ""
// }

//TEST CASE: 2 (SEARCH BY code)
//method: POST
//URL: http://localhost:3030/searchadmin
//Body: raw JSON
// {
//     "code": "00",
//     "name": "",
//     "date": ""
// }

//TEST CASE: 3 (SEARCH BY name -> name is include both fname and lname)
//method: POST
//URL: http://localhost:3030/searchadmin
//Body: raw JSON
// {
//     "code": "",
//     "name": "a",
//     "date": ""
// }

//TEST CASE: 4 (SEARCH BY date)
//method: POST
//URL: http://localhost:3030/searchadmin
//Body: raw JSON
// {
//     "code": "",
//     "name": "",
//     "date": "1979"
// }

//TEST CASE: 5 (SEARCH BY code and name)
//method: POST
//URL: http://localhost:3030/searchadmin
//Body: raw JSON
// {
//     "code": "00",
//     "name": "a",
//     "date": ""
// }

//TEST CASE: 6 (SEARCH BY code and date)
//method: POST
//URL: http://localhost:3030/searchadmin
//Body: raw JSON
// {
//     "code": "00",
//     "name": "",
//     "date": "19"
// }

//TEST CASE: 7 (SEARCH BY name and date)
//method: POST
//URL: http://localhost:3030/searchadmin
//Body: raw JSON
// {
//     "code": "",
//     "name": "a",
//     "date": "2000"
// }

//TEST CASE: 8 (SEARCH BY code and name and date)
//method: POST
//URL: http://localhost:3030/searchadmin
//Body: raw JSON
// {
//     "code": "1",
//     "name": "a",
//     "date": "1980"
// }



/* TASK 2.3: Part 2 INSERT ADMINISTRATOR */
router.post('/admin_info', function (req, res) {
    let admin_info = req.body.admin_info;
    console.log(admin_info);
    if (!admin_info) {
        return res.status(404).send({ error: true, message: 'please provide admin user information' });
    }
    /* The command we want to insert data to the database. */
    connection.query("INSERT INTO admin_info SET ? ", admin_info, (err, results) => {
        if (err) throw err;
        return res.send({ error: false, data: results.affectedRows, message: 'New Admin User has been created successfully.' });
    });
});

//TEST CASE: 1
//method: POST
//URL: http://localhost:3030/admin_info
// {
//     "admin_info": {
//         "admin_code": "222",
//         "fname": "Junepoon",
//         "lname": "patitin",
//         "dob": "1999-12-25",
//         "gender": "F",
//         "password": "junepoonthefinal",
//         "login_log": "2023-12-25 01:30:00",
//         "role": "Admistrator"
//     }
// }


//TEST CASE: 2
//method: POST
//URL: http://localhost:3030/admin_info
// {
//     "admin_info": {
//         "admin_code": "999",
//         "fname": "Satupadit",
//         "lname": "Chaichai",
//         "dob": "1980-08-05",
//         "gender": "M",
//         "password": "nineninesatu",
//         "login_log": "2023-05-11 11:22:30",
//         "role": "Admistrator"
//     }
// }




/* TASK 2.3: Part 3: UPDATE USER */
router.put('/admin_info', function (req, res) {
    /* This is the request object, which represents the HTTP request sent by the client or frontend. */
    let fname = req.body.fname;
    let lname = req.body.lname;
    let dob = req.body.dob;
    let gen = req.body.gender;
    let code = req.body.code;
    let pass = req.body.password;
    let role = req.body.role;
    console.log(fname + " " + lname + " " + dob + " " + gen + " " + code + " " + pass + " " + role)
    if (!code) {
        return res.status(404).send({ error: code, message: 'Please provide admin user information' });
    }
    const currentDate = new Date();
    const date = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate();
    const time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();

    console.log(code)
    /* The command we want to update data from the database. */
    connection.query("UPDATE admin_info SET fname='" + fname + "',lname= '" + lname + "', dob='" + dob + "', gender='" + gen + "',password='" + pass + "',login_log='" + date + " " + time + "' ,role='" + role + "' WHERE admin_code ='" + code + "'", (err, results) => {
        if (err) throw err;
        return res.send({ error: false, data: results.affectedRows, message: 'Admin User has been updated successfully.' })
    });
});

//TEST CASE: 1
//method: PUT
//URL: http://localhost:3030/admin_info
// {
//     "fname": "Satuuu",
//     "lname": "Kinnokuniya",
//     "dob": "2000-04-27",
//     "gender": "M",
//     "code": "999",
//     "password": "thisismypassword",
//     "role": "Admistrator"
// }

//TEST CASE: 2
//method: PUT
//URL: http://localhost:3030/admin_info
// {
//     "fname": "Junepoon",
//     "lname": "Pathitin",
//     "dob": "1999-12-25",
//     "gender": "F",
//     "code": "222",
//     "password": "junepoonthefinal",
//     "role": "Admistrator"
// }




/* TASK 2.3: Part 4: DELETE USER  */
router.delete('/admin_info', function (req, res) {
    let admin_code = req.body.admin_code;
    if (!admin_code) {
        return res.status(404).send({ error: true, message: 'Please provide admin_code' });
    }
    
    /* The command we want to delete data from the database. */
    connection.query('DELETE FROM admin_info WHERE admin_code = ' + admin_code, (err, results) => {
        if (err) throw err;
        return res.send({ error: false, data: results.affectedRows, message: 'Admin User has been deleted successfully.' });
    });
});

//TEST CASE: 1
//method: DELETE
//URL: http://localhost:3030/admin_info
// {

//     "admin_code": "075"
// }

//TEST CASE: 2
//method: DELETE
//URL: http://localhost:3030/admin_info
// {

//     "admin_code": "222"
// }



/* we're starting the server and listening on port 3030
By accessing the PORT property of this object (process.env.PORT), we can get the value of the PORT environment variable. */

app.listen(process.env.PORT, function () {
    console.log("Server listening at Port " + process.env.PORT);
});

