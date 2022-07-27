const passport = require('passport');
const mongoose = require('mongoose');
const bcryptjs= require('bcryptjs')
const UserSchema = require('../../models/UserSchema');
const TotalScoreSchema = require('../../models/TotalScoreSchema');
const petAdmissionSchema = require('../../models/petAdmissionOwner');
const petAdmissionAnimalSchema = require('../../models/petAdmissionAnimal');
const ShelterSchema = require('../../models/shelterSchema');
const validator = require('validator')
const Razorpay = require("razorpay")
const Cryptr = require('cryptr');
const multer = require('multer');
const xlsx = require('xlsx')


const razorpay = new Razorpay({
  key_id:'rzp_test_Hi9G47G9H24Gfc',
  key_secret:'8sxalyvLvCf5mQs2qqp92TyE',
})


const cryptr = new Cryptr('myNameisAtlantis');
// defining storage for image
// const storage = multer.diskStorage({

// //   // destination of file
//   destination: function (req , file , cb){
//       cb(null, '../../public/img');
//   },

//   filename: function (req, file , cb){
//       cb(null , file.originalname);
//   },
// })

// // upload parameters for multer
// const upload = multer({
//   storage:storage,
//   limits:{
//       fieldSize:1024*1024*3
//   }
// })


// ------------------------------- LOgin and Registration page REST APIs are here 👇----------------------
exports.getUserLogin = async(req,res,next)=>{
  return res.status(200).render('login/login.pug');
}

exports.addUserData = async(req,res,next)=>{

  // if user already exists
  const user = await UserSchema.findOne({email:req.body.email});

  if(user) return res.status(400).send("User already exists");

  // 1. validate
  if(req.body.password!=req.body.confirmpassword){
    return res.status(400).send("Password not matched")
  }
  // 2. password hash

    let paswrdHash = await bcryptjs.hash(req.body.password,10)

  //crypting password
  const crytedPassword =  cryptr.encrypt(req.body.password)

  const newData = {
      "name":req.body.name,
      "email": req.body.email,
      "password": paswrdHash,
      "dummy": crytedPassword,
      "profileImg" : req.file.originalname
  };

  await UserSchema.create(newData,(err,result)=>{

     if(err){
          return res.status(401).json({
              "type":"failure",
              "msg": err
          })
     }
     req.session.user = result;
     res.status(200).redirect('/account/dashboard')
    //  return res.status(201).json({
    //   "type":"success",
    //   "msg":result
    // })

  })
  // 3. data base add kardo
  // 4. render
  return;

}

exports.userLogin =async(req,res,next)=>{
  const data = await UserSchema.findOne({"email":req.body.email});

  if(data){
      const passwordResult = await bcryptjs.compare(req.body.password, data.password)
      if(passwordResult){
              req.session.user = data;
              res.status(200).redirect('/account/dashboard')

              // res.status(200).json({
              //   "type":"success",
              //   "msg":data
              // })
      }else{
          return res.status(401).json({
              "type":"failure",
              "msg":"Plz enter correct password",
          })
      }
  }else{
      return res.status(401).json({
          "type":"failure",
          "msg":"user not found",
      })
  }

}

// -------------------------------------Dashboard page code is here 👇 -----------------------------------------
exports.getDashboard = async(req,res,next)=>{
    res.status(200).render('dashboard/dashboard.pug');
}

exports.getUserScore = async(req,res,next)=>{
  let userPresent = await TotalScoreSchema.find({user : mongoose.Types.ObjectId(req.body.userId)})
  return res.status(200).json({
    "type":"success",
    "highestscore" : userPresent.length?userPresent[0].highestscore : 0,
    "totalattempt" : userPresent.length?userPresent[0].totalattempt : 0,
  })
}

// ------------------------------------ Quiz page REST APIs here 👇 --------------------------------------------
exports.getPetsInShelter = async(req,res,next)=>{
  res.status(200).render('petInShelter/petInShelter.pug');
}

exports.getAdoptFromShelterPage = async(req,res,next)=>{
  res.status(200).render('adoptionForm/adoptionForm.pug');
}

exports.getSendtoShelterPage = async(req,res,next)=>{
  res.status(200).render('sendToShelter/sendToShelter.pug');
}

exports.setSendtoShelterOwnerPage = async(req,res,next)=>{


  if(req.body.name || req.body.email || req.body.phone || req.body.address){
        const newData = {
          "owner":mongoose.Types.ObjectId(req.body.id),
          "ownerDetails": {
            "name":req.body.name,
            "email": req.body.email,
            "phone": req.body.phone,
            "address": req.body.address,
            "document": req.file.originalname
          },
        };

        await petAdmissionSchema.create(newData,(err,result)=>{

          if(err){
               return res.status(401).json({
                   "type":"failure",
                   "msg": err
               })
          }
          console.log(result)

          res.status(200).redirect(`/account/petForm?ownerId=${result._id}`)

       })

  }else{
    return res.status(201).json({
      "type" : "failure",
      "message" : "You have not provided correct data"
    })
  }
}


exports.setSendtoShelterAnimalPage = async(req,res,next)=>{


  if(req.body.type || req.body.gender || req.body.vaccination){
        const newData = {
            "ownerId" : mongoose.Types.ObjectId(req.body.ownerId),
            "userId":mongoose.Types.ObjectId(req.body.userId),
            "name":req.body.name,
            "common_name":req.body.common_name,
            "gender": req.body.gender,
            "type": req.body.type,
            "vaccination": req.body.vaccination,
            "petImage": req.file.originalname,
            "age": parseInt(req.body.age)
        };

        await petAdmissionAnimalSchema.create(newData,(err,result)=>{

          if(err){
               return res.status(401).json({
                   "type":"failure",
                   "msg": err
               })
          }
          res.status(200).redirect(`/account/successForm?petDataId=${result._id}`)

       })

  }else{
    return res.status(201).json({
      "type" : "failure",
      "message" : "You have not provided correct data"
    })
  }
}

exports.getpetFormPage = async(req,res,next)=>{
  res.status(200).render('sendToShelter/petForm.pug',{ownerId:req.query.ownerId});
}

exports.getsuccessFormPage = async(req,res,next)=>{
  res.status(200).render('sendToShelter/successForm.pug',{addmissionId:req.query.petDataId});
}

exports.getdonationPage = async(req,res,next)=>{
  res.status(200).render('donation/donation.pug');
}

exports.getRazorpayOrder = async(req,res,next)=>{
  let options ={
    amount: 50000,
    currency: "INR",
   };

razorpay.orders.create(options, function(err,order){
    console.log(order)
    res.json(order)
})
}


exports.getRazorpayOrderIsComplete = async(req,res,next)=>{
  razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymentDocumnet)=>{
    if(paymentDocumnet.status == 'captured'){
        res.send('Payment Successfull')
    }
    else{
        res.redirect('/account/dashboard')
    }
})
}

exports.getAdmissionData = async(req,res,next)=>{
  let admData = await petAdmissionAnimalSchema.findById(req.body.id).populate({
    path: "ownerId",
  })

  const admissionData = {
    "name":admData.ownerId.ownerDetails.name,
    "email":admData.ownerId.ownerDetails.email,
    "phone":admData.ownerId.ownerDetails.phone,
    "address":admData.ownerId.ownerDetails.address,
    "gender":admData.gender,
    "common_name":admData.common_name,
    "type":admData.type,
    "vaccination":admData.vaccination,
  }
  console.log(admData);
  return res.status(200).json({
    "type":"success",
    "message":admissionData
  })
}

exports.getemergencyPage = async(req,res,next)=>{
  res.status(200).render('emergency/emergency.pug');
}


exports.getAddShelterPage = async(req,res,next)=>{
  res.status(200).render('addShelter/addShelter.pug');

}
exports.setAddShelterData = async(req,res,next)=>{
  console.log(req.body);
    const newData = {
      "name": req.body.name,
      "address": req.body.address,
      "city_name": req.body.city_name,
      "phone": req.body.phone,
      "total_pets": req.body.total_pets,
      "total_employee": req.body.total_employee,
    }

    await ShelterSchema.create(newData,(err,result)=>{

      if(err){
           return res.status(401).json({
               "type":"failure",
               "msg": err
           })
      }
      res.status(200).redirect(`/account/addShelter`)

   })

}

exports.getNearbyShelterData = async(req,res,next)=>{
  console.log(req.body);
  const shelterData = await ShelterSchema.find({city_name : req.body.city_name})
  return res.status(200).json({
    "type":"success",
    "message":shelterData
  })
}
exports.provideQuizQuestion = async(req,res,next)=>{
     var Qno = req.query.number;

     var wb = xlsx.readFile('excelSheet/Book1.xlsx');

     var ws = wb.Sheets["QuizQuestion"];

     var data = xlsx.utils.sheet_to_json(ws);

     var QuesData = data.find(data =>{
     if(data.SrNo == Qno.toString())  return data;
     })

     res.status(200).json({
      type:"success",
      data :  {
        "SrNo": QuesData.SrNo,
        "Question": QuesData.Question,
        "CorrectAnswer1" : QuesData.CorrectAnswer1,
        "WrongAnswer1" : QuesData.WrongAnswer1,
        "WrongAnswer2" : QuesData.WrongAnswer2,
        "WrongAnswer3" : QuesData.WrongAnswer3,
        "Solution" : QuesData.Solution
       }
     })
}

exports.submitResult = async(req,res,next)=>{
  let userPresent = await TotalScoreSchema.find({user : mongoose.Types.ObjectId(req.body.userId)})

  if(!userPresent.length){
    await TotalScoreSchema.create({
      highestscore:parseInt(req.body.currentscore),
      currentscore:parseInt(req.body.currentscore),
      totalattempt : 1,
      user : mongoose.Types.ObjectId(req.body.userId)
    })
  }else{
    await TotalScoreSchema.findOneAndUpdate({user : mongoose.Types.ObjectId(req.body.userId)},{
      highestscore:Math.max(userPresent[0].highestscore,parseInt(req.body.currentscore)),
      currentscore:parseInt(req.body.currentscore),
      totalattempt : (parseInt(userPresent[0].totalattempt)+1),
    })
  }

  res.status(200).json({
    type:"success"
  })
}


// -------------------------------- logout code is here 👇 ----------------------------------------------------
exports.logOut = async(req,res,next)=>{
  req.session.user = null;

  res.status(200).redirect('/account/login');

}