import {createEnemy, damageEnemy, getEnemiesList} from "../services/service.enemy.js";

export const viewEnemies = (req, res) => {
    try {
        return res.status(200).json({error: false, data: getEnemiesList()});
    } catch (e) {
        res.status(500).json({error: true, message: e.message});
    }
}

export const requestEnemy = (req,res) =>{
    try {
        return res.status(200).json({error: false, data: createEnemy()});
    } catch (e) {
        res.status(500).json({error: true, message: e.message});
    }
}

export const attackEnemy = (req,res) => {
    try {
        const {enemyId} = req.body;
        const {userId} = req.user;

        if (!enemyId || !userId){
            throw new Error("Missing enemy ID or user ID")
        }

        return res.status(200).json({error: false, data: damageEnemy(userId,enemyId)});
    } catch (e) {
        res.status(500).json({error: true, message: e.message});
    }
}