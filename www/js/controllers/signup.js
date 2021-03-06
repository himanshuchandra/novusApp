'use strict';

/**
 * @ngdoc function
 * @name appskeleton.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the appskeleton
 */
angular.module('appskeleton')
  .controller('SignupCtrl',function ($scope,signup,$window,$state,md5) {


    $scope.signup={
        useremail:"",
        username:"",
        password1:"",
        password2:""
    };
   
////////////Checking if username exists//////////////
    $scope.UsernameMessage=null;
    var isUsernameNew=false;

    $scope.checkUsername=function(regForm){
        $scope.isNotValid=true;
        isUsernameNew=false;
        if(regForm.validusername.$valid){
            $scope.UsernameMessage="Checking...";
            $scope.checkInDb(regForm);
        }
        else{
            $scope.UsernameMessage=null;
        }
    };

    $scope.checkInDb=function(regForm){

        var usernameObj = {
            "username":$scope.signup.username,
        };
        
      var promise = signup.checkUsername(usernameObj);
        promise.then(function(data){
           if(data.data.message==="found"){
               $scope.UsernameMessage = "Username Taken";
               isUsernameNew=false;
           }
           else{
               $scope.UsernameMessage = "Nice Choice!";
               isUsernameNew=true;
               $scope.enableRegister(regForm);
           }            
        },function(error){
            $scope.UsernameMessage = "Error occured! Try again later";
        });
    };

//////////////Enable Register code/////////
    $scope.isNotValid=true;
    $scope.enableRegister=function(regForm){
        if(regForm.$valid && passverified==true && isUsernameNew==true){
            $scope.isNotValid=false;
        }
        else{
            $scope.isNotValid=true;
        }
    };

//////////////Match Passwords //////////
    var passverified=false;
    $scope.checkp=function(regForm){
        $scope.isNotValid=true;
        if($scope.signup.password2!=undefined)
        {   
            if($scope.signup.password1===$scope.signup.password2)
            {   
                $scope.passtext="Passwords match";
                passverified=true;  
                $scope.enableRegister(regForm);
            }
  
            else if($scope.signup.password1==undefined){
                 $scope.passtext="";
                 passverified=false;
            }
            else{
                $scope.passtext="Passwords dont match";
                passverified=false;
            }
        }
    };
    
////////////////////Registering The user////////////////////////////////////    
    $scope.submitForm=function(regForm){
        if(regForm.$valid && passverified==true && isUsernameNew==true){
            $scope.result = "Checking..";
            $scope.doRegister();
        }
        else{
            $scope.result="Enter correct and full info";
        }
    };
       
   
    $scope.doRegister=function(){
        
        var hashPassword=md5.createHash($scope.signup.password1);

        var userObject = {
            "useremail":$scope.signup.useremail,
            "username":$scope.signup.username,
            "password1":hashPassword,
            "role":"customer"
        };
        
      var promise = signup.registerUser(userObject);
        promise.then(function(data){
           if(data.data.message==="pass"){
               $scope.result = "Registered Successfully";
               $window.location.reload();
               $state.go("app.main");
           }
           else if(data.data.message==="usernameTaken"){
               $scope.UsernameMessage = "Username Taken";
               isUsernameNew=false;
               $scope.result ="Sorry!The username is already taken";
           }  
           else if(data.data.message==="emailTaken"){
               $scope.result ="Email already registered!";
           }  
           else{
               $scope.result = "Error occured! Try again later";
           }       
        },function(error){
            $scope.result = "Error occured! Try again later";
        });
    }
  });
