const express = require('express');
const router = express.Router();
const {
  catchErrors
} = require('../../handlers/errorHandlers');
const {isAuthenticated} = require('../../handlers/passport');
const accountController = require('../../controllers/account/accountController');
//Dependencies
const multer = require('multer');

 //Multer DiskStorage Config
const diskStorage = multer.diskStorage({

  // destination of file
  destination: function (req , file , cb){
      cb(null, 'public/img');
  },

  filename: function (req, file , cb){
      cb(null , file.originalname);
  },
})

const DocStorage = multer.diskStorage({

  // destination of file
  destination: function (req , file , cb){
      cb(null, 'public/petInShelterOwner');
  },

  filename: function (req, file , cb){
      cb(null , file.originalname);
  },
})

const AddmissionPetStorage = multer.diskStorage({

  // destination of file
  destination: function (req , file , cb){
      cb(null, 'public/addmissionPetStorage');
  },

  filename: function (req, file , cb){
      cb(null , file.originalname);
  },
})

 //Create Multer Instance
 const upload = multer({ storage: diskStorage });
 const uploadPetInShelterOwner = multer({ storage: DocStorage });
 const uploadPetInShelterAnimal = multer({ storage: AddmissionPetStorage });


// router.post('/auth',accountController.addUserData)
router.post('/register',
upload.single('profileImg'),
accountController.addUserData)

router.post('/login',accountController.userLogin)
router.get('/login',accountController.getUserLogin)

router.get('/dashboard',accountController.getDashboard)

router.post('/getscore',accountController.getUserScore)

router.get('/petsInShelter',accountController.getPetsInShelter)

router.get('/adoptfromshelter',accountController.getAdoptFromShelterPage)

router.get('/sendtoShelter',accountController.getSendtoShelterPage)

router.post('/sendtoShelter',uploadPetInShelterOwner.single('document'),accountController.setSendtoShelterOwnerPage)

router.post('/petForm',uploadPetInShelterAnimal.single('petImage'),accountController.setSendtoShelterAnimalPage)

router.get('/petForm?',accountController.getpetFormPage)

router.get('/successForm?',accountController.getsuccessFormPage)

router.post('/getAdmissionData',accountController.getAdmissionData)

router.get('/emergency',accountController.getemergencyPage)

router.get('/donation',accountController.getdonationPage)

router.get('/addShelter',accountController.getAddShelterPage)

router.post('/addShelter',accountController.setAddShelterData)

router.post('/getNearbyShelter',accountController.getNearbyShelterData)

router.post('/donation/order',accountController.getRazorpayOrder)

router.post('/donation/is-order-complete',accountController.getRazorpayOrderIsComplete)

router.get('/questions?',accountController.provideQuizQuestion)

router.post('/submit',accountController.submitResult)

router.get('/logout',isAuthenticated,
 accountController.logOut);

module.exports = router;