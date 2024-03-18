const express = require('express');
const path = require('path');

const port = 3000

const app = express();
const router = express.Router();

app.use(router)
app.use(express.static(path.join(__dirname, 'public')));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

/*path to HomePage.html*/
router.get('/', (req, res) => {
    console.log('Request at /');
    res.sendFile(path.join(__dirname, '/public/html/HomePage.html'))
})

/*path to Userlogin.html*/ 
router.get('/login', (req, res) => {
    console.log('Request at /login');
    res.sendFile(path.join(__dirname, '/public/html/Userlogin.html'))
})

/*path to User-account-management.html*/ 
router.get('/useracct', (req, res) => {
    console.log('Request at /userAcctManage');
    res.sendFile(path.join(__dirname, '/public/html/User-account-management.html'))
})

/*path to user.html*/
router.get('/user', (req, res) => {
    console.log('Request at /user');
    res.sendFile(path.join(__dirname, '/public/html/user.html'))
})

/*path to Product-management.html*/
router.get('/manage', (req, res) => {
    console.log('Request at /manage');
    res.sendFile(path.join(__dirname, '/public/html/Product-management.html'))
})

/*path to product.html*/
router.get('/product', (req, res) => {
    console.log('Request at /product');
    res.sendFile(path.join(__dirname, '/public/html/product.html'))
})

/*Form in Userlogin.html page will link to this
  If user submit the form in login page it will direct to this code.
  The value will send and in login in form will pass the code and password.*/ 
router.post('/login-submit', (req, res) => {
    console.log('Request at /login-submit');
    console.log("Login by " + req.body.code);//
    let code = req.body.code;
    let pass = req.body.password;

    /*we use fetch function with a method of POST to direct to 
      server at port 3030 with path /authentication. And we will 
      put the req.body of code and password in the JSON format*/ 
    fetch("http://localhost:3030/authentication", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code,
            password: pass
        })
    })
        .then(response => response.json()) //after send the result, we wait for the response
        .then(data => {
            console.log(data)
            /* data that send back has 'exist' to indicate whether
               this account is exist or not. If it true it will go the
               manage page. It's mean if user can login, that mean that user 
               can access to manage the product as they are admin. If it not 
               it will go to path /login again to let user put the account again*/
            if (data.exist === "true") {
                res.redirect('/manage');
            } else {
                res.redirect('/login');
            }
        })
        .catch(error => console.error(error));
})


/*This will happen when user click submit to signup form which is
  in the SignuoAdmin.html*/ 
router.post('/signup-submit', (req, res) => {
    console.log('Request at /signin-submit');
    console.log("Form submitted by " + req.body.code);

    /*fetch to the server with port of 3030 with path newuser by method
      of 'POST'. We keep all data that user input in the form and send
      the data to this port */
    fetch("http://localhost:3030/newuser", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fname: req.body.fname,
            lname: req.body.lname,
            dob: req.body.dob,
            gender: req.body.gender,
            code: req.body.code,
            password: req.body.password,
            role: req.body.role
        })
    })
        .then(response => response.json()) //after send the result, we wait for the response
        .then(data => {
            /*After signup, it will go to login page*/ 
            res.redirect('/login');
        })
        .catch(error => console.error(error));


})

/*This use when user click the search button in page of Product-management.html
  it will collect the query that user want to find which can find by name, location, and date*/
router.post('/search-product-submit', (req, res) => {
    console.log("Submit")
    let name = req.body.name;
    let location = req.body.location;
    let date = req.body.date;
    console.log(name)

    /*we fetch to this server to send data in the format of JSON*/
    fetch('http://localhost:3030/searchticket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            location: location,
            date: date
        })
    })
        .then(response => response.json()) //after send the result, we wait for the response
        .then(data => {
            console.log(data);
            res.send(data); //send the result back to client
        })
        .catch(error => console.error(error));

});

/*This will happen when user submit the search button of admin from the page of 
  User-account-management.html by send the query key of code, name, and date. */
router.post('/search-user-submit', (req, res) => {
    console.log("Submit")
    let code = req.body.code;
    let name = req.body.name;
    let date = req.body.date;
    fetch('http://localhost:3030/searchadmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code,
            name: name,
            date: date
        })
    })
        .then(response => response.json()) //after send the result, we wait for the response
        .then(data => {
            console.log(data);
            res.send(data); //send the result back to client
        })
        .catch(error => console.error(error));
});


/*If user click add product which is the ticket in Product-management.html
  To add the ticket  user has to fill in all of these data. The data will send
  to this router*/
router.post('/addProduct', (req, res) => {
    let t_code = req.body.t_code;
    let t_title = req.body.t_title;
    let t_img = req.body.t_img;
    let t_desc = req.body.t_desc;
    let t_loca = req.body.t_loca;
    let t_date = req.body.t_date;
    let t_time = req.body.t_time;
    let t_price = req.body.t_price;
    console.log('Request at /addProduct');

    /*fetch data from this port and send the data as a JSON format */
    fetch('http://localhost:3030/insertticket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            t_code: t_code,
            t_title: t_title,
            t_img: t_img,
            t_desc: t_desc,
            t_loca: t_loca,
            t_date: t_date,
            t_time: t_time,
            t_price: t_price
        })
    })
        .then(response => response.json()) //after send the result, we wait for the response  
        .then(data => {
            console.log(data);
            if (data.finish === "true") { //id finish add the ticket it will go the manage page
                return res.redirect('/manage');
            }
        })
        .catch(error => console.error(error));
});

/*This use for get all of the ticket and we use this path in HomePage.html to show
  all of the ticket that we have.*/
router.get('/gettickets', (req, res) => {
    console.log('Request at /gettickets');

    /*We fetch the data from this port that will send all ticket by using GET method.
      And we don't send any query to this  */
    fetch('http://localhost:3030/tickets', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            res.send(data) /**send the data to the HomePage.html that fetch port3000 with
                             path of /gettickets */
        })
        .catch(error => console.error(error));
});

/*This wll happen when user click the card to get only that information. This receive the ticketcode
  from the HomePage.html file*/
router.get('/getticket/:ticketCode', (req, res) => {
    const { ticketCode } = req.params;
    console.log(`Request at /getticket/${ticketCode}`);

    /*fetch the data with GET method by this ticketCode*/
    fetch(`http://localhost:3030/ticket/${ticketCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        res.send(data);
      })
      .catch(error => console.error(error));
  });


  /*This use for get all of the admins we use this path in AboutUs.html to show
  all of the admin that we have.*/
router.get('/getadmins', (req, res) => {
    console.log('Request at /getadmins');

    /*We fetch the data from this port that will send all ticket by using GET method.
      And we don't send any query to this  */
    fetch('http://localhost:3030/admin_infos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            res.send(data.data) /**send the data to the AboutUs.html that fetch port3000 with
                             path of /admin_infos */
        })
        .catch(error => console.error(error));
});


  /**Same as ticket, when user click the card, this will get the
   * information from the port of 3030 and passing the adminCode to
   * find the information and send the response back to user.
   */
router.get('/admin_infos/:adminCode', (req, res) => {
    const { adminCode } = req.params;
    console.log(`Request at /getticket/${adminCode}`);
    fetch(`http://localhost:3030/admin_infos/${adminCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        res.send(data);
      })
      .catch(error => console.error(error));
  });

/**This will happen when user click delete product. It will delete by uesing
 * thie ticket code
*/
router.delete('/deleteProduct', (req, res) => {
    let t_code = req.body.t_code;
    console.log(req.body)
    console.log('Request at /deleteProduct');
    fetch('http://localhost:3030/deleteticket', {  // fetch this port with this path in the method of delete
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            t_code: t_code,              // send this t_code to port of 3030
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error === false) {  /*It has to make sure that there is no problem of DELETE
                                           and after that it will reload the page*/
                res.send(data);
                //return res.redirect('/manage');
            }
        })
        .catch(error => console.error(error));
});

/**same as delete ticlet we use this to delete by useing admin_code that we get from html form. */
router.delete('/deleteAdmin', (req, res) => {
    let admin_code = req.body.admin_code;
    console.log('Request at /deleteAdmin');
    fetch('http://localhost:3030/admin_info', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            admin_code: admin_code,
        })
    })
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.error === false) {
                
                //res.redirect('/useracct');
                res.send(data.error);
            }
        })
        .catch(error => console.error(error));
});

/**To edituser, It will receive data by using POST method and fetch to the server with PUT methid
 * to update the data.
 */
router.post('/edituser', (req, res) => {
/**/
    fetch("http://localhost:3030/gettickets", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fname: req.body.fname,
            lname: req.body.lname,
            dob: req.body.dob,
            gender: req.body.gender,
            code:req.body.code,
            password: req.body.password,
            role: req.body.role
        })
    
    })
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.error === false) {
                return res.redirect('/useracct');
            }
        })
        .catch(error => console.error(error));
});

/*Same as the ticket, we get the value */
router.post('/editproduct', (req, res) => {
    /*It will fetch with the method of 'PUT' to update the ticket*/
        fetch("http://localhost:3030/updateticket", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({             // we send all of these by convert to JSON format
                ticket_code: req.body.t_code,
                ticket_title: req.body.t_title,
                ticket_img: req.body.t_img,
                ticket_desc: req.body.t_desc,
                ticket_loca:req.body.t_loca,
                ticket_date: req.body.t_date,
                ticket_time: req.body.t_time,
                ticket_price: req.body.t_price,
            })
        
        })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (data.error === false) {  /**If it pass, it will go to path of manage */
                    return res.redirect('/manage');
                }
            })
            .catch(error => console.error(error));
    });
    

/**/
app.listen(port, function () {
    console.log("Server listening at Port " + port);
});

