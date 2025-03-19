const express = require('express');
const router = express.Router();//express router
const userController = require('./../Controller/userController')
const authController = require('./../Controller/authController')

router.route('/')
    .get(authController.protect,userController.DisplayAll)
    .post(authController.protect,userController.createUser)
    

router.route('/:id')
    .delete(authController.protect,authController.restrict('admin'),userController.deleteUser)
    .patch(authController.protect,authController.restrict('admin'),userController.Updateuser)
    .get(authController.protect,authController.restrict('admin'),userController.Getiduser)
router.route('/updatePassword').patch(
        authController.protect,authController.restrict('admin'),
        userController.updatePassword
)
    
module.exports=router
