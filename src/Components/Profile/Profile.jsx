import React, { useState, useEffect } from "react";
import "./Profile.css";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import { Typography } from "@mui/material";
import { InputLabel, Select, MenuItem } from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import jwt_decode from "jwt-decode";
import Avatar from "@mui/material/Avatar";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function Profile() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [open, setOpen] = useState(false);
  const [domains, setDomains] = useState([]);
  const [batch, setBatch] = useState([]);
  const formdata = new FormData();
  const [user, setUser] = useState(0);
  const [profile, setProfile] = useState([]);
  const [address, setAddress] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [snackbar, setSnackbar] = useState(false);

  const updateAddresses = () => {
    axios
      .post("https://www.baskpro.online/fch_add", { user: user })
      .then((res) => {
        console.log(res.data);
        setAddresses(res.data);
      });
  };

  const profiles = () => {
    axios
      .post("https://www.baskpro.online/profile", {
        id: user,
      })
      .then((e) => {
        console.log(e.data.batch);
        setBatch(e.data.batch);
        setProfile(e.data.profile);
      });
  };
  useEffect(() => {
    profiles();
    axios.get("https://www.baskpro.online/domains").then((res) => {
      setDomains(res.data);
    });

    updateAddresses();
  }, []);

  // decoding the jwt token
  !user && setUser(jwt_decode(localStorage.getItem("studentToken")).user_id);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


// three functions for snackbar 
  const handleSnackBarOpen = () => {
    setSnackbar(true);
  };

  const handleSnackBarClose = (event,reason)=>{
    if(reason === 'clickaway'){
      return;

    }
    setSnackbar(false);
  }


   const action = (
     <React.Fragment>
       <IconButton
         size="small"
         aria-label="close"
         color="inherit"
         onClick={handleSnackBarClose}
       >
         <CloseIcon fontSize="small" />
       </IconButton>
     </React.Fragment>
   );


  const profileFormSubmit = (e) => {
    console.log(e);
    formdata.append("domain_name", e.domain);
    formdata.append("img", e.img[0]);
    formdata.append("id", user);

    let config = {
      headers: { "content-type": "multipart/form-data" },
    };

    axios
      .post("https://www.baskpro.online/prf_update", formdata, config)
      .then((res) => {
        handleSnackBarOpen();
        profiles();
        handleClose();
      });
  };

  const addAddress = (e) => {
    const { name, value } = e.target;
    if (value != "") {
      setAddress((address) => ({ ...address, [name]: value }));
    }
  };

  const updateAddress = (e) => {
    e.preventDefault();
    console.log(address);
    axios
      .post("https://www.baskpro.online/address", {
        user: user,
        dob: address.dob,
        age: address.age,
        gender: address.gender,
        father_name: address.father_name,
        father_contact: address.father_contact,
        mother_name: address.mother_name,
        mother_contact: address.mother_contact,
        address: address.address,
        village: address.village,
        taluk: address.taluk,
        education_qualification: address.education_qualification,
        collage_or_school: address.collage_or_school,
      })
      .then((res) => {
        console.log(res.data);
        setAddress(res.data);
        updateAddresses();
      });
  };

  return (
    <div
      className="container font-sans "
      style={{ height: "100%", backgroundColor: "#f3f2ef" }}
    >
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        className="flex flex-row"
      >
        <Grid item xs={12} md={6}>
          <Paper
            className="prf_paper p-6 !shadow-[0px_0px_0px_1px_rgba(0,0,0,0.1)]"
            sx={{ borderRadius: 5, width: "auto" }}
          >
            <h4 className="font-sans p-1 pl-11">PROFILE</h4>
            <div className="p-6 justify-center font-sans">
              <Grid container>
                <Grid xs={12} md={6}>
                  <Avatar
                    alt={profile.first_name}
                    src={profile.img}
                    sx={{ width: 100, height: 100 }}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography sx={{ m: 2 }}>
                    Name:
                    <TextField
                      disabled
                      variant="standard"
                      value={profile.first_name}
                      readOnly
                      sx={{ m: 1 }}
                    />
                  </Typography>
                  <Typography sx={{ m: 2 }}>
                    Batch:
                    <TextField
                      disabled
                      variant="standard"
                      value={batch.batch ? batch.batch.Batch_name : "Nil"}
                      sx={{ m: 1 }}
                    />
                  </Typography>
                  <Typography sx={{ m: 2 }}>
                    Email:
                    <TextField
                      disabled
                      value={profile.email}
                      variant="standard"
                      sx={{ m: 1 }}
                    />
                  </Typography>
                  <Typography sx={{ m: 2 }}>
                    Domain:
                    <TextField
                      disabled
                      value={
                        profile.domain_name ? profile.domain_name.title : "Nill"
                      }
                      variant="standard"
                    />
                  </Typography>
                </Grid>
              </Grid>
            </div>

            <Button
              variant="contained"
              size="medium"
              className="sub_btn"
              sx={{
                backgroundColor: "#10b981",
                ":hover": {
                  bgcolor: "black", // theme.palette.primary.main
                  color: "white",
                },
              }}
              onClick={handleClickOpen}
            >
              Update
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid item xs={12} sx={{}}>
            <Paper
              sx={{
                borderRadius: 5,
                display: "flex",
                justifyContent: "right",
              }}
              className="!shadow-[0px_0px_0px_1px_rgba(0,0,0,0.1)]"
            >
              <h4 className="font-sans p-2">Personal Details</h4>
              <Box component="form" onSubmit={updateAddress}>
                <FormControl component="fieldset">
                  {addresses ? (
                    addresses.map((address) => (
                      <FormGroup row>
                        <TextField
                          id="outlined-multiline-flexible"
                          helperText="DOB"
                          type="date"
                          name="dob"
                          maxRows={10}
                          style={{ width: 210 }}
                          size="small"
                          defaultValue={address ? address.dob : ""}
                          onChange={addAddress}
                          sx={{
                            mt: 1,
                            m: 1,
                          }}
                        />
                        <TextField
                          id="outlined-multiline-flexible"
                          label="Age"
                          name="age"
                          type="number"
                          maxRows={10}
                          style={{ width: 210 }}
                          size="small"
                          defaultValue={address ? address.age : ""}
                          onChange={addAddress}
                          sx={{
                            mt: 1,
                            m: 1,
                          }}
                        />

                        <FormControl>
                          <InputLabel id="gender_label">Gender</InputLabel>
                          <Select
                            id="demo-simple-select-disabled-label"
                            labelId="gender_label"
                            label="Gender"
                            name="gender"
                            style={{ width: 210 }}
                            size="small"
                            defaultValue={address ? address.gender : ""}
                            onChange={addAddress}
                            sx={{
                              m: 1,
                            }}
                            displayEmpty
                          >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="others">Others</MenuItem>
                          </Select>
                        </FormControl>

                        <TextField
                          id="outlined-multiline-flexible"
                          label="Father's name"
                          name="father_name"
                          multiline
                          maxRows={10}
                          style={{ width: 210 }}
                          size="small"
                          defaultValue={address ? address.father_name : ""}
                          onChange={addAddress}
                          sx={{
                            mt: 1,
                            m: 1,
                          }}
                        />
                        <TextField
                          id="outlined-multiline-flexible"
                          label="Father's contact"
                          name="father_contact"
                          multiline
                          maxRows={10}
                          style={{ width: 210 }}
                          size="small"
                          defaultValue={address ? address.father_contact : ""}
                          onChange={addAddress}
                          sx={{
                            mt: 1,
                            m: 1,
                          }}
                        />
                        <TextField
                          id="outlined-multiline-flexible"
                          label="Mother's Name"
                          name="mother_name"
                          multiline
                          maxRows={10}
                          style={{ width: 210 }}
                          size="small"
                          defaultValue={address ? address.mother_name : ""}
                          onChange={addAddress}
                          sx={{
                            mt: 1,
                            m: 1,
                          }}
                        />
                        <TextField
                          id="outlined-multiline-flexible"
                          label="Mother's Contact"
                          name="mother_contact"
                          multiline
                          maxRows={10}
                          style={{ width: 210 }}
                          size="small"
                          defaultValue={address ? address.mother_contact : ""}
                          onChange={addAddress}
                          sx={{
                            mt: 1,
                            m: 1,
                          }}
                        />

                        <TextField
                          id="outlined-multiline-flexible"
                          label="Address"
                          name="address"
                          multiline
                          maxRows={10}
                          style={{ width: 210 }}
                          size="small"
                          defaultValue={address ? address.address : ""}
                          onChange={addAddress}
                          sx={{
                            mt: 1,
                            m: 1,
                          }}
                        />
                        <TextField
                          id="outlined-multiline-flexible"
                          label="Village"
                          name="village"
                          multiline
                          maxRows={10}
                          style={{ width: 210 }}
                          size="small"
                          defaultValue={address ? address.village : ""}
                          onChange={addAddress}
                          sx={{
                            mt: 1,
                            m: 1,
                          }}
                        />
                        <TextField
                          id="outlined-multiline-flexible"
                          label="Taluk"
                          name="taluk"
                          multiline
                          maxRows={10}
                          style={{ width: 210 }}
                          size="small"
                          defaultValue={address ? address.taluk : ""}
                          onChange={addAddress}
                          sx={{
                            mt: 1,
                            m: 1,
                          }}
                        />
                        <TextField
                          id="outlined-multiline-flexible"
                          label="Education Qualification"
                          name="education_qualification"
                          multiline
                          maxRows={10}
                          style={{ width: 210 }}
                          size="small"
                          defaultValue={
                            address ? address.education_qualification : ""
                          }
                          onChange={addAddress}
                          sx={{
                            mt: 1,
                            m: 1,
                          }}
                        />
                        <TextField
                          id="outlined-multiline-flexible"
                          label="Name of College/ School"
                          name="collage_or_school"
                          multiline
                          maxRows={10}
                          style={{ width: 210 }}
                          size="small"
                          defaultValue={
                            address ? address.collage_or_school : ""
                          }
                          onChange={addAddress}
                          sx={{
                            mt: 1,
                            m: 1,
                          }}
                        />
                      </FormGroup>
                    ))
                  ) : (
                    <FormGroup row>
                      <TextField
                        id="outlined-multiline-flexible"
                        helperText="DOB"
                        type="date"
                        name="dob"
                        maxRows={10}
                        style={{ width: 210 }}
                        size="small"
                        defaultValue={address ? address.dob : ""}
                        onChange={addAddress}
                        sx={{
                          mt: 1,
                          m: 1,
                        }}
                      />
                      <TextField
                        id="outlined-multiline-flexible"
                        label="Age"
                        helperText="Age"
                        name="age"
                        type="number"
                        maxRows={10}
                        style={{ width: 210 }}
                        size="small"
                        defaultValue={address ? address.age : ""}
                        onChange={addAddress}
                        sx={{
                          mt: 1,
                          m: 1,
                        }}
                      />

                      <FormControl>
                        <InputLabel id="gender_label">Gender</InputLabel>
                        <Select
                          id="demo-simple-select-disabled-label"
                          labelId="gender_label"
                          label="Gender"
                          name="gender"
                          style={{ width: 210 }}
                          size="small"
                          defaultValue={address ? address.gender : ""}
                          onChange={addAddress}
                          sx={{
                            m: 1,
                          }}
                          displayEmpty
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="others">Others</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        id="outlined-multiline-flexible"
                        helperText="Father's name"
                        label="Father's name"
                        name="father_name"
                        multiline
                        maxRows={10}
                        style={{ width: 210 }}
                        size="small"
                        defaultValue={address ? address.father_name : ""}
                        onChange={addAddress}
                        sx={{
                          mt: 1,
                          m: 1,
                        }}
                      />
                      <TextField
                        id="outlined-multiline-flexible"
                        helperText="Father's contact"
                        label="Father's contact"
                        name="father_contact"
                        multiline
                        maxRows={10}
                        style={{ width: 210 }}
                        size="small"
                        defaultValue={address ? address.father_contact : ""}
                        onChange={addAddress}
                        sx={{
                          mt: 1,
                          m: 1,
                        }}
                      />
                      <TextField
                        id="outlined-multiline-flexible"
                        helperText="Mother's Name"
                        label="Mother's Name"
                        name="mother_name"
                        multiline
                        maxRows={10}
                        style={{ width: 210 }}
                        size="small"
                        defaultValue={address ? address.mother_name : ""}
                        onChange={addAddress}
                        sx={{
                          mt: 1,
                          m: 1,
                        }}
                      />
                      <TextField
                        id="outlined-multiline-flexible"
                        helperText="Mother's Contact"
                        label="Mother's Contact"
                        name="mother_contact"
                        multiline
                        maxRows={10}
                        style={{ width: 210 }}
                        size="small"
                        defaultValue={address ? address.mother_contact : ""}
                        onChange={addAddress}
                        sx={{
                          mt: 1,
                          m: 1,
                        }}
                      />

                      <TextField
                        id="outlined-multiline-flexible"
                        helperText="Address"
                        label="Address"
                        name="address"
                        multiline
                        maxRows={10}
                        style={{ width: 210 }}
                        size="small"
                        defaultValue={address ? address.address : ""}
                        onChange={addAddress}
                        sx={{
                          mt: 1,
                          m: 1,
                        }}
                      />
                      <TextField
                        id="outlined-multiline-flexible"
                        helperText="Village"
                        label="Village"
                        name="village"
                        multiline
                        maxRows={10}
                        style={{ width: 210 }}
                        size="small"
                        defaultValue={address ? address.village : ""}
                        onChange={addAddress}
                        sx={{
                          mt: 1,
                          m: 1,
                        }}
                      />
                      <TextField
                        id="outlined-multiline-flexible"
                        helperText="Taluk"
                        label="Taluk"
                        name="taluk"
                        multiline
                        maxRows={10}
                        style={{ width: 210 }}
                        size="small"
                        defaultValue={address ? address.taluk : ""}
                        onChange={addAddress}
                        sx={{
                          mt: 1,
                          m: 1,
                        }}
                      />
                      <TextField
                        id="outlined-multiline-flexible"
                        helperText="Education Qualification"
                        label="Education Qualification"
                        name="education_qualification"
                        multiline
                        maxRows={10}
                        style={{ width: 210 }}
                        size="small"
                        defaultValue={
                          address ? address.education_qualification : ""
                        }
                        onChange={addAddress}
                        sx={{
                          mt: 1,
                          m: 1,
                        }}
                      />
                      <TextField
                        id="outlined-multiline-flexible"
                        helperText="Name of College/ School"
                        label="Name of College/ School"
                        name="collage_or_school"
                        multiline
                        maxRows={10}
                        style={{ width: 210 }}
                        size="small"
                        defaultValue={address ? address.collage_or_school : ""}
                        onChange={addAddress}
                        sx={{
                          mt: 1,
                          m: 1,
                        }}
                      />
                    </FormGroup>
                  )}
                  <FormGroup row>
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{
                        height: 40,
                        mt: 1,
                        m: 1,
                        backgroundColor: "#10b981",
                        ":hover": {
                          bgcolor: "black", // theme.palette.primary.main
                          color: "white",
                        },
                      }}
                    >
                      update
                    </Button>
                  </FormGroup>
                </FormControl>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        message="Profile Updated"
        action={action}
      />
      {/* dialog box for profile updates */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Profile <EmojiEmotionsIcon />
        </DialogTitle>
        <Box
          component="form"
          onSubmit={handleSubmit((e) => profileFormSubmit(e))}
        >
          <DialogContent className="text-sm font-mono">
            <Grid container>
              <Grid item xs={6} sx={{ mb: 2 }}>
                <InputLabel>Domain</InputLabel>
                {errors.domain && (
                  <span style={{ color: "red" }}>This field is required</span>
                )}
                <Select
                  fullWidth
                  name="domain"
                  helperText="Domain"
                  id="domain"
                  value={domains.id}
                  variant="outlined"
                  sx={{ width: 190, ml: 2 }}
                  InputLabelProps={{
                    style: { color: "#fff" },
                  }}
                  {...register("domain", {
                    required: true,
                  })}
                >
                  {domains.map((domain) => (
                    <MenuItem value={domain.id} key={domain.id}>
                      {domain.title}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Profile Picture</InputLabel>
                {errors.img && (
                  <span style={{ color: "red", marginLeft: 60 }}>
                    Upload Image
                  </span>
                )}
                <TextField
                  type="file"
                  id="img"
                  name="img"
                  size="medium"
                  {...register("img", {
                    required: true,
                  })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Update</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}

export default Profile;
