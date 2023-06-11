"use client";

import { TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Grid from '@mui/material/Grid/Grid';
import { signOut } from 'next-auth/react';
import React, { useState } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

export default function List() {
    const [searchText, setSearchText] = useState("");
    const [data, setData] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const [siteInfo, setSiteInfo] = useState("")

    console.log("date:", Date.now())
    
    const fetchData = async (text:string) => {
        const urlForListSearch = `https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&format=json&srsearch=${text}&meta=siteviews&svlimit=24&utf8=1&svprop=views`
        const req = await fetch(urlForListSearch);
        const res = await req?.json();
        console.log("res", res)
        const searchData = await res?.query?.search;
        console.log("searchData:", searchData)
        setSiteInfo(res?.query?.siteviews || {})
        return setData(searchData || []);
    };
    
    const fetchPageDetail = (pageID:any) => {
        const urlForRetrievingPageURLByPageID = `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids=${pageID}&inprop=url&format=json`;
        fetch(urlForRetrievingPageURLByPageID)
              .then(
                function (response) {
                  return response.json();
                }
              )
              .then(
                function (response) {
                      console.log("detail response:", response.query.pages);
                      const pageDetailURL = response.query.pages[pageID].fullurl || "";
                      window.open(pageDetailURL, "_blank")
                }
              )
    }

    const handleSearch = (text:string) => {
        setSearchText(text);
        console.log("searchText", searchText, "text:", text);
        fetchData(text);
        console.log("api data:", data);
    }
    const handleClick = () => {
        signOut()
    }
    
    const columns: GridColDef[] = [
        { field: 'pageid', headerName: '#ID' , width: 200},
        { field: 'title', headerName: 'Title', width:400 },
    ];

    let searchInOneDay = "";
    Object.keys(siteInfo)?.map((key: any, index, arr) => {
        if (index === arr.length - 1) {
            searchInOneDay = siteInfo[key];
    }  });

    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
            <TextField fullWidth name="search" placeholder='Enter title name to search...' value={searchText} onChange={(e)=>handleSearch(e.target.value)} />
            </Grid>
            <Grid item xs={4}>
            <Button variant='contained' color='error' onClick={handleClick} >Sign Out</Button>
            </Grid>

            <Grid item xs={12} style={{ height: 400, width: '100%' }}>
            {searchInOneDay && (<Typography component={'h6'}>{`Total Search performed in one day: ${searchInOneDay}`}</Typography>)}
                {data?.length > 0 && (
                    <><DataGrid
                        rows={data}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        getRowId={(row) => row.pageid}
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setRowSelectionModel(newRowSelectionModel);
                            fetchPageDetail(newRowSelectionModel[0]);
                            console.log("row:", newRowSelectionModel);
                        } }
                        rowSelectionModel={rowSelectionModel} /></>)}
            </Grid>
        </Grid>
       
        
   )
 }