const express = require('express');
const axios = require('axios');
const pendingWishes = require('../../sharedData.js');

const santaRouter = express.Router();
const error = {
    childNotRegistered: 'Child not registered',
    childAgeMoreThanTen: 'Child age more than 10',
    internalError: 'Internal Error'
}

santaRouter.get('', async(req, res) => {
    res.render('santa');
});

santaRouter.post('', async(req,res) => {
    try {
        const {userid, wish} = req.body;
        let userProfileId = '';

        // Get users from URL
        const usersURL = 'https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json';
        const userInfos = await axios.get(usersURL); //[username, uid]
        const getUserId = (arr, userid)=> arr.find(users => users.username === userid).uid;

        userProfileId = getUserId(userInfos.data, userid);
        
        // Is child not registered?
        if (userProfileId === '') {
            res.send('error', {error: error.childNotRegistered});
            return;
        }

        // Get user profile from URL
        let userProfile = '';

        const userProfilesURL = 'https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json';
        const userProfileInfo = await axios.get(userProfilesURL); // [userUid, address, birthdate]
        const getUserProfile = (arr, userid)=> arr.find(userProfiles => userProfiles.userUid === userid);
        const getAge = birthday => new Date(new Date() - new Date(birthday)).getFullYear() - 1970;
        
        userProfile = getUserProfile(userProfileInfo.data, userProfileId);
        const {address , birthdate} = userProfile;
        
        //Is Child's Age less than 10?
        if (getAge(userProfile.birthdate) > 10) {
            res.render('error', {error: error.childAgeMoreThanTen});
        } else {
            // Push the wish to the global variable
            pendingWishes.push({userid, address, wish});
            res.render('confirm');
        }
    } catch(e) {
        res.render('error', {error: error.internalError});
    }
});

module.exports = santaRouter;