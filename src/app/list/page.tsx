"use client";

import {
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import Button from "@mui/material/Button/Button";
import Grid from "@mui/material/Grid/Grid";
import { signOut } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import axios from "axios";
import ViewsChart from "../components/ViewsChart";

export default function List() {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [siteInfo, setSiteInfo] = useState("");
  const [searchInMainOneDay, setSearchInMainOneDay] = useState("");
  const [searchInOneDay, setSearchInOneDay] = useState("");
  const [searchInOneHour, setSearchInOneHour] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [pageDetailURL, setPageDetailURL] = useState("");

  const fetchData = async (text: string) => {
    const urlForListSearch = `https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&format=json&srsearch=${text}&meta=siteviews&svlimit=24&utf8=1&svprop=views`;
    let req = await fetch(urlForListSearch);
    let res = await req?.json();
    let searchData = await res?.query?.search;
    setSiteInfo(res?.query?.siteviews || {});
    return setData(searchData || []);
  };

  const fetchPageDetail = (pageID: any) => {
    const urlForRetrievingPageURLByPageID = `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids=${pageID}&inprop=url&format=json`;
    fetch(urlForRetrievingPageURLByPageID)
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        setPageDetailURL(response.query?.pages[pageID].fullurl || "");
        getDailySiteViews(pageID);
      });
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    fetchData(text);
  };
  const handleClick = () => {
    signOut();
  };

  const columns: GridColDef[] = [
    { field: "pageid", headerName: "#ID", width: 200 },
    { field: "title", headerName: "Title", width: 400 },
  ];

  useEffect(() => {
    Object.keys(siteInfo)?.map((key: any, index, arr) => {
      if (index === arr.length - 1) {
        setSearchInMainOneDay(siteInfo[key]);
      }
    });
  }, [siteInfo]);

  const handleClose = () => {
    setShowDialog(false);
    setSearchInOneDay("");
    setSearchInOneHour("");
    setPageDetailURL("");
  };

  async function getDailySiteViews(pageId: string) {
    const filteredData = data.find(
      (obj: { pageid: string }) => obj.pageid === pageId
    ) || { title: "" };
    const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${filteredData.title}/daily/20230610/20230611`;

    try {
      const response = await axios.get(url);
      const items = response.data.items;

      const views = items[0].views;
      setSearchInOneDay(views);
      setSearchInOneHour(Math.floor(views / 24).toString());
    } catch (error) {
      console.error("Error occurred while fetching site views:", error);
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <TextField
          fullWidth
          name="search"
          placeholder="Enter title name to search..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Grid>
      <Grid item xs={4}>
        <Button variant="contained" color="error" onClick={handleClick}>
          Sign Out
        </Button>
      </Grid>

      <Grid item xs={12} style={{ height: 400, width: "100%" }}>
        {searchInMainOneDay && data?.length > 0 && (
          <Typography
            component={"h6"}
          >{`Total Search performed on main wikipedia in one day: ${searchInMainOneDay}`}</Typography>
        )}
        {data?.length > 0 && (
          <>
            <DataGrid
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
                newRowSelectionModel.length > 0 && setShowDialog(true);
              }}
              rowSelectionModel={rowSelectionModel}
            />
          </>
        )}
      </Grid>

      <Dialog fullWidth onClose={handleClose} open={showDialog}>
        <DialogTitle>Page Details</DialogTitle>
        <DialogContent>
          <Typography component={"h6"}>
            Search performed in one day: {searchInOneDay}
          </Typography>
          <Typography component={"h6"}>
            Search performed per Hour: {searchInOneHour}
          </Typography>
          <a href={pageDetailURL} style={{ color: "blue" }} target="_blank">
            show details page
          </a>

          <Grid container>
            <Grid item xs={12}>
              <div style={{ height: "100%", width: "100%" }}>
                <ViewsChart
                  viewsData={Object.values(siteInfo)}
                  labelData={Object.keys(siteInfo)}
                />
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
