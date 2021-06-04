import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Grid } from '@material-ui/core';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useHistory } from 'react-router-dom';

import useStyles from './styles';
import { createPost } from '../../actions/posts';


const Form = ({ currentId, setCurrentId }) => {

  const [postData, setPostData] = useState({title: '', location : '', lat: '', long : '', pincode : '', price : '', selectedFile: '' });


  const post = useSelector((state) => (currentId ? state.posts.find((message) => message._id === currentId) : null));

  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();

  useEffect(() => {
    if (!post?.title) clear();
    if (post) setPostData(post);
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', location : '', lat: '', long : '', pincode : '', price : '', selectedFile: ''});
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createPost({ ...postData, name: user?.result?.name }));
      clear();
    } else {
      clear();
    }
  };

  const handleSelect = async (value) => {
    console.log('dsfdsfsdfsdfds')
    geocodeByAddress(value)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        console.log('Success', latLng);
        setPostData({ location : value, lat : latLng.lat, long : latLng.lng })

      })
      .catch(error => console.error('Error', error));
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
        Please Sign In to create your own propertys.
        </Typography>
      </Paper>
    );
  }


  return (
    <Paper className={classes.paper}>

      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? `Editing "${post.title}"` : 'Creating a Property'}</Typography>

        

        <PlacesAutocomplete
          value={postData.location}
          onChange={(e) => setPostData({ ...postData, location : e  })}
          onSelect={handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <>
            <TextField  variant="outlined" label="Location" fullWidth 
                {...getInputProps({
                  name : 'location'
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
      </PlacesAutocomplete>
      
        <Grid item xs={12} sm={6}>
            <TextField name="lat" variant="outlined" label="Lattitude" fullWidth value={postData.lat} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField  name="long" variant="outlined" label="Longitute" fullWidth value={postData.long} disabled />
        </Grid>

        <TextField name="pincode" variant="outlined" label="PinCode" fullWidth value={postData.pincode} onChange={(e) => setPostData({ ...postData, pincode: e.target.value })} />

        <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />

        <TextField name="price" variant="outlined" label="Price" fullWidth value={postData.price} onChange={(e) => setPostData({ ...postData, price: e.target.value })} />


        <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div>

        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>

        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
      </form>
    </Paper>
  );
};

export default Form;
