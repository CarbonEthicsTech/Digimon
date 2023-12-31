import React, { useState, useEffect } from "react";
import Airtable from "airtable";
import Loader from "./Loader";
import { Grid } from '@mui/material';

export default function Main(){

    // test credentials
    const apiKey = process.env.REACT_APP_AIRTABLE_API_KEY
    const baseKey = process.env.REACT_APP_BASE_KEY!
    const plantingTableKey = process.env.REACT_APP_PLANTING_TABLE_KEY!
    const updateTableKey = process.env.REACT_APP_GROUP_TABLE_KEY!

    const airtable = new Airtable({ apiKey: apiKey }).base(baseKey)
    const plantingTable = airtable(plantingTableKey)
    const updateTable = airtable(updateTableKey)

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userID = urlParams.get('purchaserID');
    const wixPurchaseID = urlParams.get('wixPurchaseID');
    const orderNo = urlParams.get('orderNo');
    
    const [allUpdates, setAllUpdates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    async function getAll(){
        const plantingResult = await plantingTable.select({
            // filterByFormula: `AND({User ID} = "${userID}", {Wix Purchase ID} = "${wixPurchaseID}")`
            filterByFormula: `{Order No} = "${orderNo}"`
        }).all();
        if(plantingResult.length > 0){
            plantingResult.map(async (row) => {
                getGroupUpdate(row.fields['Batch'])
            })
        }
    }

    async function getGroupUpdate(Batch){
        let updates:any[] = []
        
        const plantingUpdates = await updateTable.select({
            filterByFormula: `AND({Batch} = "${Batch}", {Status} = "Active")`,
            sort: [{
                field: 'Timestamp',
                direction: 'desc'
            }]
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
            {allUpdates.length > 0 ? 
                <Grid container>
                    {allUpdates.map((row, index) => (
                        <Loader data={row} key={row['Record ID']}/>
                    ))}
                </Grid>
            :
                <> 
                    {loading ? 
                        <h1> Loading... </h1>
                    :
                        <h1> No Updates Yet </h1>
                    }
                    
                </>
            }
        </>
    )
}