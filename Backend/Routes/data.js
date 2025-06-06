const User = require('../Models/User');
const Team = require('../Models/Team');
const express = require('express');
require('dotenv').config();
const path = require('path');

const {Teams} = require('pokemon-showdown');

const {validateTeam, getTeamSummary} = require("./teams");
const { verify_jwt } = require('./authHelper');

const router = express.Router();

router.post('/uploadTeam', verify_jwt, async (req, res) => {
    
    try {
        const userId = req.user.userId;
        let { name, team } = req.body;
        if (!team ) {
          return res.status(400).json({ error: 'Team Required' });
        }
        if (typeof name !== 'string' || name.length > 100) {
            return res.status(400).json({ error: 'Team name must be 100 characters or fewer.' });
        }

        teamData = Teams.import(team);
        let errorString = validateTeam(teamData);

        if (errorString != ""){
            return res.status(400).json({ error: 'Team has Errors\n' + errorString });
        }

        const teamSummary = getTeamSummary(teamData);
        team = Teams.export(teamData);
        const newTeam = new Team({ name, summary: teamSummary, data: teamData, user: userId, teamText: team});
        await newTeam.save();
        res.status(201).json({ message: 'Team Added successfully.', teamId: newTeam._id });
      } catch (err) {
          res.status(500).json({ error: 'Something went wrong.' });
    }
})

router.post('/editTeam/:id', verify_jwt, async (req, res) => {
    try {
        const userId = req.user.userId;
        const teamId = req.params.id;
        let { name, team } = req.body;
        if (!team ) {
          return res.status(400).json({ error: 'Team Required' });
        }
        if (typeof name !== 'string' || name.length > 100) {
            return res.status(400).json({ error: 'Team name must be 100 characters or fewer.' });
        }
        const existingTeam = await Team.findById(teamId);
        
        if (!existingTeam) {
            return res.status(404).json({ error: 'Team not found.' });
        }
        
        if (existingTeam.user.toString() !== userId) {
            return res.status(401).json({ error: 'Unauthorized to edit this team.' });
        }

        teamData = Teams.import(team);
        let errorString = validateTeam(teamData);

        if (errorString != ""){
            return res.status(400).json({ error: 'Team has Errors\n' + errorString });
        }

        const teamSummary = getTeamSummary(teamData);
        team = Teams.export(teamData); 
        
        existingTeam.name = name;
        existingTeam.summary = teamSummary;
        existingTeam.data = teamData;
        existingTeam.teamText = team;

        await existingTeam.save();
        res.status(201).json({ message: 'Team Added successfully.', teamId: existingTeam._id });
      } catch (err) {
          res.status(500).json({ error: 'Something went wrong.' });
    }
})

router.post("/deleteTeam/:id",verify_jwt, async (req,res) =>{
    try {
        const teamId = req.params.id;
        const team = await Team.findById(teamId);
        if (!team) {
            res.status(404).json({ error: 'Team not found' });
        } 
        await Team.findByIdAndDelete(teamId);
        res.status(200).json({ message: 'Team deleted successfully' });
    }catch (err){
        res.status(500).json({ error: 'Something went wrong.' });
    }
})

router.post('/validateTeam', async (req,res) => {
    try {
        let { team } = req.body;
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
        res.status(200).json({ teamSummary, team, teamData })
    } catch (err){
        res.status(500).json({ error: 'Something went wrong.' });
    }
})

router.get('/getTeams/:username', async (req, res)=> {
    try {
        const username = req.params.username;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search?.trim();

        const user = await User.findOne({ username }).exec();
        const skip = (page - 1) * limit;
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const filter = { user: user._id }
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }
        
        const total = await Team.countDocuments(filter); 
        const teams = await Team.find(filter)
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

router.get('/sprite/:spriteName', async (req, res) => {
  try {
    const spriteName = path.basename(req.params.spriteName);
    const spriteDir = path.resolve(process.env.SPRITE_PATH);
    const imagePath = path.join(spriteDir, spriteName + ".png");

    res.sendFile(imagePath, (err) => {
      if (err) {
        return res.status(404).json({ error: 'File not found' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
})
module.exports = router;