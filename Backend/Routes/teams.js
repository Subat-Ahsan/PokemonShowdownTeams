const {Dex, Teams} = require('pokemon-showdown');

function validateEvs(evs){
    let total = 0;
    count = 0;
    for (const ev of Object.values(evs)){
        if (ev > 252 || ev < 0){
            return false;
        }
        total += ev;
        count++;
        if (count >= 7){
            return false;
        }
    }
    if (total > 510) {return false}
    return true;
}

function validateIvs(ivs){
    let count = 0;
    for (const iv of Object.values(ivs)){
        if (iv > 31 || iv < 0){
            return false;
        }
        count++;
        if (count >= 7){
            return false;
        }
    }
    return true;
}

function validateMoves(moves){
    if (!moves){
        return false;
    }
    let count = 0;
    for (const move of Object.values(moves)){
        const dexMove = Dex.moves.get(move);
        if (!dexMove.exists){
            return false;
        }
        count++;
        if (count >= 5){
            return false;
        }
    }
    if (count === 0){return false;}
    return true;
}

function formatErrorList(errorList){
    let errorString = ""
    for (const [i] of errorList.entries()){
        if (errorList[i].length === 0){continue;}
        errorString += ( "Slot " + (i+1) + ": ")
        for (error of errorList[i]){
            errorString += (error + ", ")
        }
        errorString += "\n"
    }
    return errorString;
}
function validateTeam(team){
    let errorMessage = [];
    let count = 0;
    const genders = ["","M", "F"]
    const natures = ["","Adamant","Bashful","Bold","Brave","Calm","Careful","Docile","Gentle","Hardy","Hasty","Impish","Jolly","Lax","Lonely","Mild","Modest","Naive","Naughty","Quiet","Quirky","Rash","Relaxed","Sassy","Serious","Timid"];
    const pokemonTypes = ["", "Stellar", "Normal","Fire","Water","Grass","Electric","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"];

    
    for (const entry of team){
        let localErrorMessage = []
        count++;
        if (count > 6){
            localErrorMessage.push("Team size Error");
            errorMessage.push(localErrorMessage);
            break;
        }
        const spc =  Dex.species.get(entry.species);
        if (!spc.exists){localErrorMessage.push("Species Error")}
        
        const item = Dex.items.get(entry.item);
        if (entry.item && !item.exists) { localErrorMessage.push("Item Error")}

        const ability = Dex.abilities.get(entry.ability)
        if (!ability.exists) { localErrorMessage.push("Ability Error")}

        if (entry.gender && !genders.includes(entry.gender)) {localErrorMessage.push("Gender Error")}

        if (entry.nature && !natures.includes(entry.nature)) {localErrorMessage.push("Nature Error")}

        if (entry.teraType && !pokemonTypes.includes(entry.teraType)) {localErrorMessage.push("TeraType Error")}

        if (entry.evs && !validateEvs(entry.evs)) {localErrorMessage.push("Evs Error")}

        if (entry.ivs && !validateIvs(entry.ivs)) {localErrorMessage.push("Ivs Error")}

        if (!validateMoves(entry.moves)) {localErrorMessage.push("Move Error")}

        errorMessage.push(localErrorMessage);
    }
    if (count == 0){
        return "No pokemon";
    }
    return formatErrorList(errorMessage);
}

function getTeamSummary(team){
    let out = [];
    let count = 0;
    for (const entry of team){
        count++;
        if (count > 6){
            break;
        }
        const spc =  Dex.species.get(entry.species);
        if (spc){
            out.push([spc.name, spc.spriteid])
        }
    }
    return out;
}
module.exports = {validateTeam, getTeamSummary}