import React from "react";
import { Grid } from '@mui/material';

export default function Loader({data}){
    return(
        <Grid item xs={12} style={{ textAlign: "left", padding: '10px', border: '1px solid #e6e6e6', margin: '15px 0', borderRadius: '4px' }}>
            <h2>{data.Notes}</h2>
            <p>Updated on: {data.Timestamp}</p>
            {data.Attachments && 
                <Grid container spacing={2}>
                    {data.Attachments.map((img) => (
                        <Grid item xs={12} sm={4}>
                            <img src={img.url} style={{ maxWidth: '100%', borderRadius: '4px' }} />
                        </Grid>
                    ))}
                </Grid>
            }
            
        </Grid>
    )
}