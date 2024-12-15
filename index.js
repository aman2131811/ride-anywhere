const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require(process.cwd() + "/config/db");
let con = null;
const multer = require('multer');
let storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, './public/uploads');
  },
  filename: function(req, file, callback) {
      callback(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(require("express-session")({
  secret: "Rusty is a pug",
  resave: false,
  saveUninitialized: false
}));

app.use(express.static("public"));

//=====================
// ROUTES
//=====================

app.post("/editAdmin", upload.fields([{
  name: 'photo', maxCount: 1
}]) ,function(req, res) {
  let id = req.session.customer_id;
  let fname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;
  let phone = req.body.phone;
  let address = req.body.address;
  let country = req.body.country;
  let state = req.body.state;
  let dob = req.body.dob;
  let pin = req.body.pin;
  let photo = req.files.photo ? req.files.photo[0].filename : req.session.result[0].photo;
  if (con == null) con = db.openCon(con);
  con.query("update customer set fname = ?, lname = ?, email = ?, phone = ?, address = ?, country = ?, state = ?, dob = ?, pin_code = ?, photo = ? where id = ? and utype = 'admin'", 
  [fname, lname, email, phone, address, country, state, dob, pin, photo, id], function(err, result) {
    if (err) {
      return res.render("adminAccount", {success: 0, result: req.session.result, fname: req.session.fname, photo: req.session.photo});
    }
    con.query("select * from customer where utype = 'admin' and id = ?", [id], function(err, result) {
      if (err) {
        return res.render("adminAccount", {success: 0, result: req.session.result, fname: req.session.fname, photo: req.session.photo});
      }
      req.session.fname = result[0].fname;
      req.session.photo = result[0].photo;
      req.session.result = result;
      return res.render("adminAccount", {success: 1, result: req.session.result, fname: req.session.fname, photo: req.session.photo});
    });
  });
});

app.post("/editCustomer", upload.fields([{
  name: 'photo', maxCount: 1
}]) ,function(req, res) {
  let id = req.session.customer_id;
  let fname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;
  let phone = req.body.phone;
  let address = req.body.address;
  let country = req.body.country;
  let state = req.body.state;
  let dob = req.body.dob;
  let pin = req.body.pin;
  let photo = req.files.photo ? req.files.photo[0].filename : req.session.result[0].photo;
  if (con == null) con = db.openCon(con);
  con.query("update customer set fname = ?, lname = ?, email = ?, phone = ?, address = ?, country = ?, state = ?, dob = ?, pin_code = ?, photo = ? where id = ? and utype = 'customer'", 
  [fname, lname, email, phone, address, country, state, dob, pin, photo, id], function(err, result) {
    if (err) {
      return res.render("customerAccount", {success: 0, result: req.session.result, fname: req.session.fname, photo: req.session.photo});
    }
    con.query("select * from customer where utype = 'customer' and id = ?", [id], function(err, result) {
      if (err) {
        return res.render("customerAccount", {success: 0, result: req.session.result, fname: req.session.fname, photo: req.session.photo});
      }
      req.session.fname = result[0].fname;
      req.session.photo = result[0].photo;
      req.session.result = result;
      return res.render("customerAccount", {success: 1, result: req.session.result, fname: req.session.fname, photo: req.session.photo});
    });
  });
});

app.get("/fareEdit", function(req, res) {
  let id = req.query.id;
  if(req.session.utype != 'admin'){
    return res.render("index", {success: 10});
  }
  if (con == null) con = db.openCon(con);
  con.query("select * from fare where id = ?", id, function(err, result) {
    if (err) {
      return res.render("fareEdit", {success: 0, result, fname: req.session.fname, photo: req.session.photo});
    }
    return res.render("fareEdit", {success: -1, result, fname: req.session.fname, photo: req.session.photo});
  });
});

app.post("/fareEdit", function(req, res) {
  let source = req.body.source;
  let destination = req.body.dest;
  let total_km = req.body.total_km;
  let total_cost = req.body.total_cost;
  let first_km = req.body.first_km;
  let cost = req.body.cost;
  let id = req.body.fare_id;
  if (con == null) con = db.openCon(con);
  con.query("update fare set source = ?, destination = ?, total_km = ?, first_km = ?, cost = ?, total_cost = ? where id = ?", 
  [source, destination, total_km, first_km, cost, total_cost, id], function(err, result) {
    if (err) {
      return res.render("fareList", {success: 0, result, fname: req.session.fname, photo: req.session.photo});
    }
    con.query("select * from fare", function(err, result) {
      if (err) {
        return res.render("fareList", {success: 0, result, fname: req.session.fname, photo: req.session.photo});
      }
      return res.render("fareList", {success: 3, result, fname: req.session.fname, photo: req.session.photo});
    });
  });
});

app.get("/changePasswordCustomer", function(req, res) {
  if(req.session.utype === 'customer'){
    return res.render("changePasswordCustomer", {success: -1});
  }
  return res.render("index", {success: 10});
});

app.get("/changePasswordAdmin", function(req, res) {
  if(req.session.utype === 'admin'){
    return res.render("changePasswordAdmin", {success: -1});
  }
  return res.render("index", {success: 10});
});

app.post("/changePasswordCustomer", function(req, res) {
  let customer_id = req.session.customer_id;
  let passw = req.body.password1;
  if (con == null) con = db.openCon(con);
  con.query("update customer set passw = ? where id = ? and utype = 'customer'",
  [passw, customer_id], function(err, result) {
    if (err) {
      return res.render("changePasswordCustomer", {success: 0, fname: req.session.fname, photo: req.session.photo});
    }
    return res.render("changePasswordCustomer", {success: 1, fname: req.session.fname, photo: req.session.photo});
  });
});

app.post("/changePasswordAdmin", function(req, res) {
  let customer_id = req.session.customer_id;
  let passw = req.body.password1;
  if (con == null) con = db.openCon(con);
  con.query("update customer set passw = ? where id = ? and utype = 'admin'",
  [passw, customer_id], function(err, result) {
    if (err) {
      return res.render("changePasswordAdmin", {success: 0, fname: req.session.fname, photo: req.session.photo});
    }
    return res.render("changePasswordAdmin", {success: 1, fname: req.session.fname, photo: req.session.photo});
  });
});

app.post("/submitCustomer", function(req, res) {
  let data = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    phone: req.body.phone,
    passw: req.body.password1,
    utype: 'customer'
  };
  if (con == null) con = db.openCon(con);
  con.query("select * from customer where email = ?", req.body.email, function(err, result) {
    if (err) {
      return res.render("submitCustomer", {success: 0});
    }
    if(result.length > 0){
      return res.render("submitCustomer", {success: 2});
    }else{
      con.query("insert into customer set ?", data, function(err, result) {
        if (err) {
          return res.render("submitCustomer", {success: 0});
        }
        return res.render("submitCustomer", {success: 1});
      });
    }
  });
});

app.post("/submitFare", function(req, res) {
  let data = {
    source: req.body.source,
    destination: req.body.dest,
    total_km: req.body.total_km,
    total_cost: req.body.total_cost,
    first_km: req.body.first_km,
    cost: req.body.cost
  };
  if (con == null) con = db.openCon(con);
  con.query("insert into fare set ?", data, function(err, result) {
    if (err) {
      return res.render("fareList", {success: 0, result, fname: req.session.fname, photo: req.session.photo});
    }
    con.query("select * from fare", function(err, result) {
      if (err) {
        return res.render("fareList", {success: 0, result, fname: req.session.fname, photo: req.session.photo});
      }
      return res.render("fareList", {success: 1, result, fname: req.session.fname, photo: req.session.photo});
    });
  });
});

app.post("/loginAdmin", function(req, res) {
  let email = req.body.email;
  let passw = req.body.password1;
  if (con == null) con = db.openCon(con);
  con.query("select * from customer where email = ? and passw = ? and utype = 'admin'", [email, passw], function(err, result) {
    if (err) {
      return res.render("loginAdmin", {success: 0});
    }
    else if(result.length == 0){
      return res.render("loginAdmin", {success: 3});
    }
    else{
      req.session.utype = "admin";
      req.session.result = result;
      req.session.fname = result[0].fname;
      req.session.photo = result[0].photo;
      req.session.customer_id = result[0].id;
      return res.render("adminAccount", {success: -1, result: req.session.result, fname: req.session.fname, photo: req.session.photo});
    }
  });
});

app.post("/loginCustomer", function(req, res) {
  let email = req.body.email;
  let passw = req.body.password1;
  if (con == null) con = db.openCon(con);
  con.query("select * from customer where email = ? and passw = ? and utype = 'customer'", [email, passw], function(err, result) {
    if (err) {
      return res.render("loginCustomer", {success: 0});
    }
    else if(result.length == 0){
      return res.render("loginCustomer", {success: 3});
    }
    else{
      req.session.utype = "customer";
      req.session.result = result;
      req.session.fname = result[0].fname;
      req.session.photo = result[0].photo;
      req.session.customer_id = result[0].id;
      return res.render("customerAccount", {success: -1, result: req.session.result, fname: req.session.fname, photo: req.session.photo});
    }
  });
});

app.get("/fareList", function(req, res) {
  if (con == null) con = db.openCon(con);
  con.query("select * from fare", function(err, result) {
    if (err) {
      return res.render("fareList", {success: 0, result, fname: req.session.fname, photo: req.session.photo});
    }
    return res.render("fareList", {success: -1, result, fname: req.session.fname, photo: req.session.photo});
  });
});

app.get("/customerList", function(req, res) {
  if (con == null) con = db.openCon(con);
  con.query("select * from customer where utype = 'customer'", function(err, result) {
    if (err) {
      return res.render("customerList", {success: 0, result, fname: req.session.fname, photo: req.session.photo});
    }
    return res.render("customerList", {success: -1, result, fname: req.session.fname, photo: req.session.photo});
  });
});

app.get("/customerBookedList", function(req, res) {
  if (con == null) con = db.openCon(con);
  con.query("select * from booking", function(err, result) {
    if (err) {
      return res.render("customerBookedList", {success: 0, result, fname: req.session.fname, photo: req.session.photo});
    }
    return res.render("customerBookedList", {success: -1, result, fname: req.session.fname, photo: req.session.photo});
  });
});

app.get("/addFare", function(req, res) {
  if(req.session.utype === 'admin'){
    return res.render("addFare", {success: -1});
  }
  return res.render("index", {success: 10});
});

// Showing home page
app.get("/", function(req, res) {
  let utype = req.session.utype;
  if(utype == "admin"){
    return res.render("adminAccount", {success: -1, result: req.session.result, fname: req.session.fname, photo: req.session.photo});
  }else if(utype == "customer"){
    return res.render("customerAccount", {success: -1, result: req.session.result, fname: req.session.fname, photo: req.session.photo});
  }else{
    return res.render("index", {success: -1});
  }
});

app.get("/customerDelete", function(req, res) {
  let id = req.query.id;
  if (con == null) con = db.openCon(con);
  con.query("delete from customer where id = ?", [id], function(err, result) {
    if (err) {
      return res.render("customerList", {success: 0, result, fname: req.session.fname, photo: req.session.photo});
    }
    con.query("select * from customer where utype = 'customer'", function(err, result) {
      if (err) {
        return res.render("customerList", {success: 0, result, fname: req.session.fname, photo: req.session.photo});
      }
      return res.render("customerList", {success: 1, result, fname: req.session.fname, photo: req.session.photo});
    });
  });
});

app.get("/customerBookedDelete", function(req, res) {
  let id = req.query.id;
  if (con == null) con = db.openCon(con);
  con.query("delete from booking where id = ?", [id], function(err, result) {
    if (err) {
      return res.render("customerBookedList", {success: 0, result, fname: req.session.fname, photo: req.session.photo});
    }
    con.query("select * from booking", function(err, result) {
      if (err) {
        return res.render("customerBookedList", {success: 0, result, fname: req.session.fname, photo: req.session.photo});
      }
      return res.render("customerBookedList", {success: 1, result, fname: req.session.fname, photo: req.session.photo});
    });
  });
});

app.get("/fareDelete", function(req, res) {
  let id = req.query.id;
  if (con == null) con = db.openCon(con);
  con.query("delete from fare where id = ?", [id], function(err, result) {
    if (err) {
      return res.render("fareList", {success: 0, result, fname: req.session.fname, photo: req.session.photo});
    }
    con.query("select * from fare", function(err, result) {
      if (err) {
        return res.render("fareList", {success: 0, result, fname: req.session.fname, photo: req.session.photo});
      }
      return res.render("fareList", {success: 2, result, fname: req.session.fname, photo: req.session.photo});
    });
  });
});

app.get("/cabBook", function(req, res) {
  let id = req.query.id;
  if (con == null) con = db.openCon(con);
  con.query("select * from fare where id = ?", [id], function(err, result) {
    if (err) {
      return res.render("cabBook", {success: 0, result, fname: req.session.fname, photo: req.session.photo});
    }
    req.session.book_result = result;
    return res.render("cabBook", {success: -1, result, fname: req.session.fname, photo: req.session.photo});
  });
});

app.get("/payment", function(req, res) {
  if(req.session.utype === 'customer'){
    return res.render("payment", {success: -1, fname: req.session.fname, photo: req.session.photo});
  }
  return res.render("index", {success: 10});
});

app.get("/fareListCustomer", function(req, res) {
  if(req.session.utype === 'customer') {
    con.query("select * from fare", function(err, result) {
      if (err) {
        return res.render("fareListCustomer", {success: 0, result, fname: req.session.fname, photo: req.session.photo});
      }
      return res.render("fareListCustomer", {success: -1, result, fname: req.session.fname, photo: req.session.photo});
    });
  } else {
    return res.render("index", {success: 10});
  }
});

app.post("/submitPayment", function(req, res) {
  let data = {
    source: req.session.book_result[0].source,
    destination: req.session.book_result[0].destination,
    total_km: req.session.book_result[0].total_km,
    total_cost: req.session.book_result[0].total_cost,
    cust_id: req.session.result[0].id,
    cust_name: req.session.result[0].fname
  };
  if (con == null) con = db.openCon(con);
  con.query("insert into booking set ?", data, function(err, result) {
    if (err) {
      return res.render("customerAccount", {success: 0, result: req.session.result, fname: req.session.fname, photo: req.session.photo});
    }
    return res.render("customerAccount", {success: 2, result: req.session.result, fname: req.session.fname, photo: req.session.photo});
  });
});

app.get("/logout", function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

let port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server Has Started!");
});