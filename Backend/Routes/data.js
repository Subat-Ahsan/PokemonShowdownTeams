const User = require('../Models/User');
const Team = require('../Models/Team');
const express = require('express');
require('dotenv').config();
const path = require('path');

const {Teams} = require('pokemon-showdown')

const {validateTeam, getTeamSummary} = require("./teams")
const { verify_jwt } = require('./authHelper');

const router = express.Router();

router.post('/uploadTeam', verify_jwt, async (req, res) => {
    
    try {
        const userId = req.user.userId;
        let { name, team } = req.body;
        if (!team ) {
          return res.status(400).json({ error: 'Team Required' });
        }
        teamData = Teams.import(team)
        let errorString = validateTeam(teamData);

        if (errorString != ""){
            return res.status(400).json({ error: 'Team has Errors\n' + errorString });
        }
        const teamSummary =getTeamSummary(teamData)
        team = Teams.export(teamData)
        const newTeam = new Team({ name, summary: teamSummary, data: teamData, user: userId, teamText: team});
        await newTeam.save();
        await User.findByIdAndUpdate(
            userId,
            { $push: { teams: newTeam._id } },
            { new: true }
        );
        res.status(201).json({ message: 'Team Added successfully.', teamId: newTeam._id });
      } catch (err) {
          res.status(500).json({ error: 'Something went wrong.' });
    }
});

router.get('/getTeams/:username', async (req, res)=> {
    try {
        const username = req.params.username;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const user = await User.findOne({ username }).exec();
        const skip = (page - 1) * limit;

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const total = await Team.countDocuments({ user: user._id }); 
        const teams = await Team.find({ user: user._id })
        .select('summary name _id').skip(skip).limit(limit).exec();
        
        return res.status(200).json({teams: teams, total: total})
    } catch (err){
        res.status(500).json({ error: 'Something went wrong.' });
    }
})

router.get('/teams/:teamid', async (req,res) => {
    try {
        const teamId = req.params.teamid;
        const team = await Team.findById(teamId).populate('user', 'username -_id');;
        if (team) {
            res.status(200).json(team);
        } else {
            res.status(404).json({ error: 'Team not found' });
        }
    }catch (err){
        res.status(500).json({ error: 'Something went wrong.' });
    }
})
router.get('/sprite/:spriteName', (req, res) => {
  const spriteName = path.basename(req.params.spriteName);
  const imagePath = path.join(process.env.SPRITE_PATH, (spriteName+".png"));
  res.sendFile(imagePath, (err) => {
    if (err){
         res.status(404).json({ error: 'File not found' });
    }
   
  });
});

module.exports = router;