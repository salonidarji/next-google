"use client";

import { TextField } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Grid from '@mui/material/Grid/Grid';
import { signOut } from 'next-auth/react';
import React, { useState } from "react";

export default function List() {
    const [searchText, setSearchText] = useState("");
    const [data, setData] = useState([]);
    const fetchData = async (text:string) => {
        const req = await fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&format=json&srsearch=${text}`);
        const res = await req?.json();
        console.log("res", res)
        const searchData = await res?.query?.search;
        return setData(searchData || []);
    };

    const handleSearch = (text:string) => {
        setSearchText(text);
        console.log("searchText", searchText, "text:", text);
        fetchData(text);
        console.log("api data:", data);
    }
    const handleClick = () => {
        signOut()
       }
    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
            <TextField fullWidth name="search" placeholder='Enter title name to search...' value={searchText} onChange={(e)=>handleSearch(e.target.value)} />
            </Grid>
            <Grid item xs={4}>
            <Button variant='contained' color='error' onClick={handleClick} >Sign Out</Button>
            </Grid>

            <Grid item xs={12}>
                {data.length > 0 && data.map((d: {title: ""},index) => (
                   <div key={index}>{d.title}</div> 
                ))}
            </Grid>
        </Grid>
       
        
   )
 }