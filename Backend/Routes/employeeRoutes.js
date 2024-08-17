const express = require("express");
const loginData = require("../Controllers/login");
const mySqlPool = require("../config/db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/login", async (req, res) => {
  // const data=req.body;
  // alert("hello")
  console.log(req.body);
  try {
    const dataquery = await mySqlPool.query(
      `SELECT * FROM employee_info WHERE Email=? LIMIT 1`,
      [req.body.email]
    );
    // console.log(dataquery);
    if (!dataquery) {
      return res.send({
        sucess: false,
        message: "Something Went Wrong",
      });
    }
    // console.log()
    if (dataquery[0][0].Password === req.body.password) {
      const token = jwt.sign(
        {
          Name: dataquery[0][0].Name,
          Email: dataquery[0][0].Email,
          Role: dataquery[0][0].Role,
        },
        process.env.SECRET_KEY
      );
      // obj.token=token;
      return res.status(200).send({
        sucess: true,
        message: "Login SucessFul",
        data: {
          Name: dataquery[0][0].Name,
          Email: dataquery[0][0].Email,
          Password: dataquery[0][0].Password,
          token: token,
        },
      });
    }
    return res.status(400).send({
      sucess: false,
      message: "Something Went Wrong",
    });
  } catch (e) {
    console.log("There is Error in login" + e);
    res.status(500).send({
      sucess: false,
      message: "Something Went Wrong",
      err: e,
    });
  }
});
router.post("/signup", async (req, res) => {
  // console.log("sign up is hited");
  let role = "Admin";
  const urlData = req.body;
  // console.log("this is auth body");
  // console.log(urlData);
  // console.log(urlData);
  const obj = {
    Name: urlData.name,
    Email: urlData.email,
    Password: urlData.password,
    token: "",
    role: "Admin",
  };
  try {
    const data = await mySqlPool.query(
      `INSERT INTO employee_info (Name,Email,Password,Role) VALUES (?,?,?,?)`,
      [obj.Name, obj.Email, obj.Password, role]
    );
    console.log(data);
    if (!data) {
      return res.status(404).send({
        sucess: false,
        message: "Something Went Wrong",
        err: e,
      });
    }

    const token = jwt.sign(
      { Name: urlData.name, Email: urlData.email, Role: "Admin" },
      process.env.SECRET_KEY
    );
    obj.token = token;
    // console.log("This is Token")
    // console.log(token);
    // res.cookie('jwt', token, { httpOnly: true });
    // const sql = 'SELECT * FROM employee_info WHERE Email = ? LIMIT 1';

    return res.status(200).send({
      sucess: true,
      message: "You Are Sign In",
      data: obj,
    });
  } catch (e) {
    console.log("There is an error in Sign up " + e);
    res.status(500).send({
      sucess: false,
      message: "Something Went Wrong",
      err: e,
    });
  }
});

const DataBaseEntryOfOrganization = async (req, res, next) => {
  console.log("This is Middleware hit");
  console.log(req.body.organizationName.organization)

  try {
    const data = await mySqlPool.query(
      `INSERT INTO employee_info (Name, Email, Password, Role) VALUES (?, ?, ?, ?)`,
      [
        req.body.organizationName.organization,
        req.body.companyEmail.companyEmail,
        req.body.defaultPass.defaultPass,
        "Organization",
      ]
    );
    console.log("Data is inserted into Database:", data);

    // Pass control to the next middleware or route handler
    next();
  } catch (e) {
    console.error("Data of Organization Not Inserted to Database:", e);
    return res.status(500).send({
      message: "Storage Mai Problem Hai",
      success: "False",
    });
  }
};

const DataOraganizatioMain = async (req, res, next) => {
  console.log("This is Middleware hit- 2");
  console.log("This is Package")
  console.log(req.body.package1.package1)

  try {
    const data = await mySqlPool.query(
      `INSERT INTO organization (Organization_Name,Company_Email,Package,Contact_Number,Website,City,Country,Zip) VALUES (?, ?, ?, ?,?,?,?,?)`,
      [
        req.body.organizationName.organization,
        req.body.companyEmail.companyEmail,
        req.body.package1.package1,
        req.body.contact.contact,
        req.body.website.website,
        req.body.city.city,
        req.body.country.country,
        req.body.zip.zip,

        
      ]
    );
    console.log("Data is inserted into Database:", data);

    // Pass control to the next middleware or route handler
    next();
  } catch (e) {
    console.error("Data of Organization Not Inserted to Database:", e);
    return res.status(500).send({
      message: "Storage Mai Problem Hai middle2 k2",
      success: "False",
    });
  }
};



router.post(
  "/organizationU/:id",
  DataBaseEntryOfOrganization,DataOraganizatioMain,
  
  async (req, res) => {
    console.log("oo Bhai");
    console.log(req.params.id);
    // console.log(process.env.SECRET_KEY);
    console.log(req.body.organizationName.organization);
    console.log(req.body);






    const Token = jwt.sign(
      {
        Name: req.body.organizationName.organization,
        Password:"Encrypted",
        Email: req.body.companyEmail.companyEmail,
       Role:"Organization"
      },
      process.env.SECRET_KEY
    );
    // console.log("THe Gerenerated Web Token");
    console.log(Token);
    console.log(req.body);
    // console.log(Token);
    const link = `http://localhost:3000/authLogin/${Token}`;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "parasnaulia88@gmail.com",
          pass: "yyxz zpqm xqcl pzeo",
        },
      });

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: {
          name: req.params.id,
          address: req.params.id,
        },
        to: `${req.body.companyEmail.companyEmail}`, // List of receivers
        subject: `Create Account Here ✔ Your Default password is ${req.body.defaultPass.defaultPass}`, // Subject line
        text: link, // Plain text body
        html: ` Create Account ${link} and Your Default Password is :   ${req.body.defaultPass.defaultPass}`, // HTML body
      });

      console.log("Mail sent:", info.response);
      return res.status(200).send({ message: "Mail sent successfully" });
    } catch (error) {
      console.error("Error sending mail:", error);
     return  res.status(500).send({ error: "Internal server error" });
    }
  }
);

router.post("/auth", async (req, res) => {
  // console.log(req.body)

  const tokenData = jwt.verify(req.body.token, process.env.SECRET_KEY);
  // console.log(tokenData);

  return res.status(200).send({
    message: "Auth SucessFully",
    data: tokenData,
  });

  console.log("Api is Hitted");
  return res.status(200).send({ message: "Done" });
});
const dataMiddle = async (req, res, next) => {
  try {
    // console.log("Checking if user already exists...");
    const [findData] = await mySqlPool.query(
      "SELECT * FROM employee_info WHERE Email = ?",
      [req.body.email]
    );

    if (findData.length > 0) {
      // User exists, return an error
      console.log("User already present");
      return res.status(409).send({
        message: "User already exists",
        success: false,
        error: "User already exists",
      });
    }

    // User does not exist, proceed to the next middleware/route handler
    next();
  } catch (err) {
    console.log("Error in dataMiddle: " + err);
    return res.status(500).send({
      message: "Database query failed",
      success: false,
      error: err.message,
    });
  }
};

router.post("/signupD/:id", dataMiddle, async (req, res) => {
  // console.log("this is org api");
  const urlData = req.body;
  // console.log(req.body);
  const obj = {
    Name: urlData.name,
    Email: urlData.email,
    Password: urlData.password,
    token: "",
    role: "",
  };

  const tokenVerify = jwt.verify(req.params.id, process.env.SECRET_KEY);

  obj.role = tokenVerify.role;
  // obj.token=req.params.id;

  // console.log(obj);
  // console.log(Ctoken+"this is Ctoken")

  try {
    const data = await mySqlPool.query(
      `INSERT INTO employee_info (Name,Email,Password,Role) VALUES (?,?,?,?)`,
      [obj.Name, obj.Email, obj.Password, obj.role]
    );
    // console.log(data);
    if (!data) {
      return res.status(404).send({
        sucess: false,
        message: "Something Went Wrong",
        err: e,
      });
    }

    const Ctoken = jwt.sign(
      { Name: obj.Name, Email: obj.Email, Role: tokenVerify.role },
      process.env.SECRET_KEY
    );
    obj.token = Ctoken;
    // console.log("This is Token")
    // console.log(token);
    // res.cookie('jwt', token, { httpOnly: true });
    // const sql = 'SELECT * FROM employee_info WHERE Email = ? LIMIT 1';
    // console.log("yha bhi aagya")
    return res.status(200).send({
      sucess: true,
      message: "You Are Sign In",
      data: obj,
    });
  } catch (e) {
    // console.log("There is an error in Sign up "+e);
    return res.status(500).send({
      sucess: false,
      message: "Something Went Wrong",
      err: e,
    });
  }

  res.status(200).send({
    message: "Api is Hitt",
    sucess: true,
  });
});



router.post("/loginD/:id", async (req, res) => {
  console.log("Login APi is Hitted")
  // console.log("this is org api");
  const urlData = req.body;
  // console.log(req.body);
  const obj = {
    Name: urlData.name,
    Email: urlData.email,
   
    token: "",
    role: "",
  };

  const tokenVerify = jwt.verify(req.params.id, process.env.SECRET_KEY);
  console.log("verification")
  console.log(tokenVerify)

  obj.role = tokenVerify.role;
  // obj.token=req.params.id;

  // console.log(obj);
  // console.log(Ctoken+"this is Ctoken")

  try {
    const data = await mySqlPool.query(
      `SELECT * from employe_info where Email=?`,
      [obj.Email]
    );
    console.log(data)
    // console.log(data);
    if (!data) {
      return res.status(404).send({
        sucess: false,
        message: "Something Went Wrong",
        err: e,
      });
    }

    const Ctoken = jwt.sign(
      { Name: obj.Name, Email: obj.Email, Role: tokenVerify.role },
      process.env.SECRET_KEY
    );
    obj.token = Ctoken;
    // console.log("This is Token")
    // console.log(token);
    // res.cookie('jwt', token, { httpOnly: true });
    // const sql = 'SELECT * FROM employee_info WHERE Email = ? LIMIT 1';
    // console.log("yha bhi aagya")
    return res.status(200).send({
      sucess: true,
      message: "You Are Sign In",
      data: obj,
    });
  } catch (e) {
    // console.log("There is an error in Sign up "+e);
    return res.status(500).send({
      sucess: false,
      message: "Something Went Wrong",
      err: e,
    });
  }

  res.status(200).send({
    message: "Api is Hitt",
    sucess: true,
  });
});

router.post("/package", async (req, res) => {
  //   console.log("The PAcakge Api is Hitted ");
  //   console.log(req.body);
  const { Name, Start_date, End_date, Start_Time, endTime, Project, Users } =
    req.body;

  try {
    const data = await mySqlPool.query(
      `INSERT INTO package (Name,Start_Date,End_Date,Start_Time,End_Time,Project,Users) VALUES (?,?,?,?,?,?,?)`,
      [Name, Start_date, End_date, Start_Time, endTime, Project, Users]
    );
    // console.log("Package Data Inserted Sucesscfully");
    // console.log(data);
    return res.status(200).send({
      name: "Paras",
      sucess: "true",
      data: data,
    });
  } catch (e) {
    console.log("There is Some Error In PAckage Insertion " + e);
    return res.send(500).send({
      message: "Something went Wrong in Package Insertion",
      success: false,
    });
  }
});

router.get("/package", async (req, res) => {
  console.log("pkage Get Api Is hitted");

  try {
    const [rows, fields] = await mySqlPool.query(`SELECT * FROM package`);
    // console.log(data[0][0]);
    console.log(rows);
    return res.send({
      data: rows,
    });
  } catch (e) {
    console.log("there is an error in Package Data" + e);
    return res.status(500).send({
      message: "Something Went Wrong In fetching Data",
      sucess: false,
      error: e,
    });
  }

  return res.status(200).send({
    message: "Sucess",
    success: true,
  });
});
router.delete("/package", async (req, res) => {
  console.log(req.body);
  console.log("this is Backend api of delete package");
  try {
    // const
    const query = `DELETE FROM package WHERE Name = ?`;
    const [result] = await mySqlPool.query(query, [req.body.name]);
    console.log(result);
    return res.status(200).send({
      message: "SucessFully Deleted",
      sucess: "true",
    });
  } catch (e) {
    console.log("Delete Api of package Problem" + e);
    return res.status(400).send({
      message: "Error In deleting the package",
      success: false,
    });
  }
});

router.patch("/package", (req, res) => {
  console.log("this is Update Page");
  return res.status(200).send({
    message: "HEllo Upadte this Side",
    success: true,
  });
});



router.patch("/newpass",async(req,res)=>{
  console.log("The Update PAsssword is here");
  console.log(req.body);




  try{

    const updateResult = await mySqlPool.query(
      `UPDATE employee_info SET Password = ? WHERE Email = ?`,
      [req.body.pass.pass,req.body.name]
    );
    console.log(updateResult);
    console.log("Data is Updated");
  return res.status(200).send({
    message:"data is Updated",
    success:true
  })
  }
  catch(e)
  {
    console.log("This is the error "+e);
   return res.status(500).send({
      message:"Not updated",
      sucess:false
    })

  }
})

router.get("/organization",async(req,res)=>{
  console.log("Organization is here");



  try{
    const [rows]=await mySqlPool.query(`SELECT * from organization`);
    // console.log(rows);
    
      return res.send({
        message:"Elements of Organization",
        data:rows,
        success:true
      })
  

  }
  catch(e)
  {
    console.log("There is an error in fetching The data "+e);
    return res.status(500).send({
      success:false,
      message:"Error in Fetching the Organization"
    })

  }

})

const deleorgmiddleWare = async (req, res, next) => {
  try {
    const [result] = await mySqlPool.query(
      `DELETE FROM employee_info WHERE Name=?`,
      [req.body.Organization_Name] // Correct the access here
    );

    console.log("Organization deleted:", result);

    // If the organization is deleted, you can proceed to delete employee info
    if (result.affectedRows > 0) {
      next(); // Proceed to the next middleware
    } else {
      return res.status(404).send({
        message: "Organization not found",
        success: false,
      });
    }
  } catch (err) {
    console.log("Error in deleorgmiddleWare: " + err);
    return res.status(500).send({
      message: "Database query failed",
      success: false,
      error: err.message,
    });
  }
};

router.delete("/organization",  async (req, res) => {
  console.log("Deleting associated employee data...");
  console.log(req.body.name);

  try {
    const [result] = await mySqlPool.query(
      `DELETE FROM organization WHERE Organization_Name=?`,
      [req.body.name] // Make sure this is correct
    );
    console.log("Employee data deleted:", result);

    return res.status(200).send({
      message: "Organization and associated employee data deleted successfully",
      success: true,
    });
  } catch (e) {
    console.log("Error deleting employee data:", e);
    return res.status(500).send({
      message: "Failed to delete associated employee data",
      success: false,
    });
  }
});










module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOYW1lIjoiTXVrZXNoIiwiRW1haWwiOiJwYXJhc0BnbWFpbC5jb20iLCJpYXQiOjE3MjM1NTg3NDh9.fZhX5od_5yxrEZGfdSX1o_dA6C7t7b2AVByTQuyRd2w
