const express = require('express');
const {log} = require('console')
const app = express();
const path = require('path')
port = 80
const mongoose = require('mongoose');
let {PythonShell} = require('python-shell')
const { sign } = require('crypto');
main().catch(err => console.log(err));

isLogin = false;
isAttend = false;

async function main() {

    await mongoose.connect('mongodb://127.0.0.1:27017/FaceSync');

//mongoose
const signup = new mongoose.Schema({
    email: String,
    password:String
  });


const verify = new mongoose.Schema({
    userid: String,
    password:String
  });
const adminData = new mongoose.Schema({
    name: String,
    email:String,
    phone:String,
    company:String,
    password:String
  });

  const newMember = new mongoose.Schema({
    name: String,
    phone: String,
    class: String,
    userid: String,
    password: String
  });

  const attendance = new mongoose.Schema({
    userid:String,
      name:String,
      class:String,
    date:String,
    attendance: String,
    
})
  const trace = mongoose.model('trace', signup);
  const admin = mongoose.model('adminData', adminData);
  const validate = mongoose.model('verify', verify);
  const member = mongoose.model('newMember',newMember);
  const attend = mongoose.model('attendance',attendance);

// express
app.use(express.static(path.join(__dirname,'public')))
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded())

app.set('view engine', 'pug')
app.set('views', path.join(__dirname,'views'))


app.get('/',(req,res)=>{
    
    res.sendFile(path.join(__dirname, "index.html"))
})



// all login part
app.get('/signin',(req,res)=>{
    res.sendFile(path.join(__dirname, "signin.html"))
})
app.post('/signin',async(req,res)=>{

    const email = req.body.email;
    const password = req.body.password;
    const obj=await trace.findOne({email:email})
    const password_db = obj.password;
    // console.log(password)
    // console.log(password_db)
    if(password===password_db){
        isLogin=true;
        res.sendFile(path.join(__dirname, "index2.html"))
        
    }
    else{
        isLogin=false;
        res.send("invalid details!")

    }
   
    
})

// leader Login In Details
app.get("/leaderLogin", (req,res)=>{
    res.sendFile(path.join(__dirname, "leaderLogin.html"))
})
app.post("/leaderLogin", async(req,res)=>{
    
     email = req.body.email;
    const password = req.body.password;
    
    const obj=await admin.findOne({email:email})
    const password_db = obj.password;
    // console.log(password)
    // console.log(password_db)
    if(password===password_db){
        isLogin=true;
        res.sendFile(path.join(__dirname, "admin.html"))
        
    }
    else{
        isLogin=false;
        res.send("invalid details!")

    }
})


// all leader
app.get("/teamleader", (req,res)=>{
    if(isLogin==true){
    res.sendFile(path.join(__dirname, "admin.html"))

    }
    else{
    res.sendFile(path.join(__dirname, "managerDetails.html"))}
     
    
})

app.post('/teamleader',(req,res)=>{
     name1 = req.body.name;
     email = req.body.email;
     password = req.body.password;
     number = req.body.phone;
     company = req.body.company;

    const data = new admin({name:name1,email:email,phone:req.body.phone, company:company, password:password})
    data.save();
    isLogin=true;
    // console.log(req.statusCode)
    res.sendFile(path.join(__dirname, "admin.html"))
})

// all signup part
app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname, "signup.html"))
})
app.post('/signup',(req,res)=>{
    email = req.body.email;
    password = req.body.password;
    const data = new trace({email:email, password:password})
    data.save();
    isLogin=true;
    // console.log(req.statusCode)
    res.sendFile(path.join(__dirname, "index.html"))
})


app.get('/career',(req,res)=>{
   
    res.sendFile(path.join(__dirname, "career.html"))
    
        
    }
)
app.get('/aboutus',(req,res)=>{
    res.sendFile(path.join(__dirname, "/public/aboutUs.html"))
})
app.get('/member',(req,res)=>{
    if(isLogin==true){
    res.sendFile(path.join(__dirname, "memberLogin.html"))}
    
    else{
    res.sendFile(path.join(__dirname, "memberLogin.html"))

    }
})
app.post('/member',async(req,res)=>{ 
     userid = req.body.userid;
     password = req.body.password;
     password_db="Invalid"
    try{
     obj=await validate.findOne({password:password})
    
     password_db = obj.password;}
     catch(error){
        res.send("Invalid Details!")
    }
    // console.log(password)
    // console.log(password_db)
    if(password===password_db && userid == obj.userid){
        res.sendFile(path.join(__dirname, "memberDashBoard.html"))
        
    }
    // else{
    //     res.send("invalid details! please contact your team leader")

    // }
    // res.sendFile(path.join(__dirname, "memberDashBoard.html"))
})
// app.get('/verify',(req,res)=>{
//     res.sendFile(path.join(__dirname, "memberDashBoard.html"))
// })


app.get("/admin", (req,res)=>{
if(isLogin == true){
    res.sendFile(path.join(__dirname, "admin.html"))}
    else{
        res.sendFile(path.join(__dirname, "leaderLogin.html"))
    }
})

// app.post("/admin", async(req,res)=>{
//     const adminData = await admin(req.body)
//     res.sendFile(path.join(__dirname, "admin.html"))

// })

app.get("/profile", async(req,res)=>{
//     name1="ankush"
// emial1="ankush@gmail.com"
// phone1= 9136332043
//     id = 123;
em = email;
const obj=await admin.findOne({email:em})
    // const password_db = obj.password;
    

    res.render("profile", {name:obj.name, email:obj.email, phone:obj.phone, company:obj.company })
})


app.get("/userData", async(req,res)=>{
     user1 = userid;
    const obj = await attend.findOne({userid:user1});
    
  res.render("userData",{name:obj.name, class1:obj.class, attendance:obj.attendance,date:obj.date})
})
app.get("/markAttendance", async(req,res)=>{
   
    // if(isAttend){
    //     res.send("Attendance Marked")
    // }
    // email = req.body.email;
    // password = req.body.password;

    user = userid;
    const obj1=await member.findOne({userid:user})
    name1 = obj1.name;
    class1 = obj1.class;
    const now = new Date();
    const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();
// console.log(`${hours}:${minutes}:${seconds}`);
time1= `${hours}:${minutes}:${seconds}`
    // attendance = "Present"
    // const data = new attend({userid:obj1.userid,name:name1,class:class1,date:now,attendance:"P"});
    // data.save();
    const data = {userid:obj1.userid,name:name1,class:class1,date:now,attendance:"P"};

    res.send(`<img src="http://api.qrserver.com/v1/create-qr-code/?data=${obj1.userid} &size=300x300" alt="">`);
    
    // res.sendFile(path.join(__dirname, "memberDashBoard.html"))

})
app.get("/face", (req,res)=>{
    isAttend = true;
    // isLogin=false;
    res.sendFile(path.join(__dirname, "face.html"))
})
app.get("/data" , async(req,res)=>{
    res.sendFile(path.join(__dirname,"data.html"))
})



const fetchDocuments = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const documents = await attend.find({});
            resolve(documents);
        } catch (error) {
            reject(error);
        }
    });
};

app.get("/data1", async (req, res) => {
    try {
        const documents = await fetchDocuments();
        res.send(documents);
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).send("An error occurred while fetching data.");
    }
});
app.get("/attendance01", async(req,res)=>{
    res.sendFile(path.join(__dirname,"scan.html"))
    
})
app.post("/attendance01", async(req,res)=>{
    try {
        let data1 = req.body.dt;
        data1 = data1.trim();
        let student = await member.findOne({ userid: data1 });
      
        if (!student) {
          // Handle case where student is not found
          console.error("Student not found for userid:", data1);
          // You might want to return an error response or handle the situation differently
        } else {
          // Student found, proceed with your logic
          console.log("Student found:", student);
          const now = new Date();
          const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      // console.log(`${hours}:${minutes}:${seconds}`);
      time1= `${hours}:${minutes}:${seconds}`
          name1 = student.name;
            class1 = student.class;
            const data = {userid:student.userid,name:name1,class:class1,date:now,attendance:"P"};
          let d = new attend(data)
          d.save();
    res.sendFile(path.join(__dirname, "scan.html"))

        }
      } catch (error) {
        // Handle general errors
        console.error("Error:", error);
        // You might want to return an error response or handle the situation differently
      }
    
})
app.get("/logout", (req,res)=>{
    isLogin=false;
    res.sendFile(path.join(__dirname, "memberLogin.html"))
})
app.get("/logout1", (req,res)=>{
    isLogin=false;
    res.sendFile(path.join(__dirname, "signin.html"))
})






// Members Adding

app.get("/members", (req,res)=>{
    // isLogin=false;
    res.sendFile(path.join(__dirname, "memberCreate.html"))
})

// app.get("/career", (req,res)=>{
//     // isLogin=false;
//     res.sendFile(path.join(__dirname, "career.html"))
// })



app.post("/members", (req,res)=>{
    // isLogin=false;
    name1=req.body.name;
    phone=req.body.phone;
    class1=req.body.class;
    userid=req.body.userid;
    password=req.body.password;
    const data = new member({name:name1,phone:phone,class:class1,userid:userid, password:password});
    const data2 = new validate({userid:userid,password:password});
    data.save();
    data2.save();
    
    res.sendFile(path.join(__dirname, "admin.html"))
})


app.listen(port, ()=>{
    log(`listning on port ${port}`)
})

}