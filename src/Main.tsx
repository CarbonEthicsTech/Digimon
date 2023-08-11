import React, { useState, useEffect } from "react";
import Airtable from "airtable";
import Loader from "./Loader";
import { Grid } from '@mui/material';

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
    const wixPurchaseID = urlParams.get('wixPurchaseID');
    
    const [allUpdates, setAllUpdates] = useState<any[]>([])
    
    async function getAll(){
        const plantingResult = await plantingTable.select({
            filterByFormula: `AND({User ID} = "${userID}", {Wix Purchase ID} = "${wixPurchaseID}")`
        }).all();
        if(plantingResult.length > 0){
            plantingResult.map(async (row) => {
                getGroupUpdate(row.fields['Group ID'])
            })
        }
    }

    async function getGroupUpdate(groupID){
        let updates:any[] = []
        
        const plantingUpdates = await updateTable.select({
            filterByFormula: `AND({Group ID} = "${groupID}", {Status} = "Active")`
        }).all();
        if(plantingUpdates.length > 0){
            plantingUpdates.map(async (row) => {
                updates.push(row.fields)
                console.log(row.fields)
            })
        }

        setAllUpdates(updates)
    }

    useEffect(() => {
        getAll()
    }, [])

    return(
        <>
            {allUpdates.length > 0 && 
                <Grid container>
                    {allUpdates.map((row) => (
                        <Loader data={row} key={row['Record ID']}/>
                    ))}
                </Grid>
            }
        </>
    )
}