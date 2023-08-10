import React from "react";
import Airtable from "airtable";

export default function Main(){
    const apiKey = "patErOOEz4zFVzvIO.a57ea0d9421eaaae1e774535e7bdec9191c6300a150654d560a5513b41337369"

    const airtable = new Airtable({ apiKey: apiKey }).base('appCcRYgO820YdHKB')
    const table = airtable('tblGqpiBl267bBNJg')
    
    async function get(){
        const data = await table.select({filterByFormula: '{Group ID} = "A"'}).all();
        console.log(data)
    }

    get()

    return(
        <></>
    )
}