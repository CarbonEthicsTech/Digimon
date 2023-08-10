import React from "react";
import Airtable from "airtable";

export default function Main(){

    // test credentials
    const apiKey = "patErOOEz4zFVzvIO.a57ea0d9421eaaae1e774535e7bdec9191c6300a150654d560a5513b41337369"
    const baseKey = "appCcRYgO820YdHKB"
    const plantingTableKey = "tblGqpiBl267bBNJg"
    const updateTableKey = "tblgnhwYhLUieEot9"

    const airtable = new Airtable({ apiKey: apiKey }).base(baseKey)
    const plantingTable = airtable(plantingTableKey)
    const updateTable = airtable(updateTableKey)

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userID = urlParams.get('purchaserID');



    
    async function get(){
        const plantingResult = await plantingTable.select({filterByFormula: `{User ID} = "${userID}"`}).all();
        if(plantingResult.length > 0){
            plantingResult.map(async (row) => {
                getGroupUpdate(row.fields['Group ID'])
            })
        }
    }

    async function getGroupUpdate(groupID){
        const plantingUpdates = await updateTable.select({filterByFormula: `{Group ID} = "${groupID}"`}).all();
        if(plantingUpdates.length > 0){
            plantingUpdates.map(async (row) => {
                console.log(row.fields)
                
            })
        }
    }

    get()

    return(
        <></>
    )
}