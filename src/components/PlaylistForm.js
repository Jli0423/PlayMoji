<<<<<<< HEAD
import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import PropTypes from 'prop-types';

import { FieldDynamic, Field } from './FieldInput';
import { Button } from './Button';
import Songs from './Songs';
import Emoji from './emoji';

const server = 'https://spotify-playlist-generator-api.herokuapp.com';
const emojiapi = 'https://emojistoemotions.herokuapp.com/emojicollection/';

export default class Form extends Component {
  static propTypes = {
    token: PropTypes.string,
  }

  static defaultProps = {
    token: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      song_list: [],
      emoji_string: '',
      searchString: '',
      success: false,
    };
  }

  componentWillMount() {
    this.setState({
      song_list: [],
      songs: [],
    });
  }

  getEmojiString(val) {
    this.setState({ emoji_string: val });
  }

  removeSong(id) {
    const songList = this.state.song_list;
    songList.splice(id, 1);
    this.setState({ song_list: songList });
  }

  formatListToString() {
    // Turns list into comma separated string
    const ret = ['', '']; // 0 - trackId, 1 - artistIds
    const commaSeperatedString = this.state.song_list;
    commaSeperatedString.map((song) => {
      ret[0] += `${song.trackId},`;
      ret[1] += `${song.artistId},`;
    });
    ret[0] = ret[0].slice(0, -1);
    ret[1] = ret[1].slice(0, -1);
    return ret;
  }
  createPlaylist() {
    const self = this;
    const songInfo = self.formatListToString();
    axios.get(`${emojiapi}${this.state.emoji_string}`).then((res) => {
      const { data } = res;
      axios.post(
        `${server}/playlists`, {
          user: self.props.userid,
          name: document.getElementById('playlist').value,
          description: document.getElementById('desc').value,
          tracks: songInfo[0],
          artists: songInfo[1],
          limit: 50,
          danceability: data.danceability,
          energy: data.energy,
          liveness: data.liveness,
          loudness: data.loudness,
          mode: data.mode,
          popularity: data.popularity,
          valence: data.valence,
        },
        {
          headers: {
            Authorization: `Bearer ${self.props.token}`,
          },
        },
      ).then(() => {
        self.setState({ success: true });
        self.setState({
          song_list: [],
        });
      }, (err) => {
        console.log('error', err);
      });
    }, () => {
      axios.post(`${server}/playlists`, {
        user: self.props.userid,
        name: document.getElementById('playlist').value,
        description: document.getElementById('desc').value,
        tracks: songInfo[0],
        artists: songInfo[1],
        limit: 50,
      }, {
        headers: {
          Authorization: `Bearer ${self.props.token}`,
        },
      }).then(() => {
        self.setState({ success: true });
      }, (err) => {
        if (err.response.status === 401) {
          window.location = window.location.pathname;
        }
      });
    });
  }


  updateSong(val) {
    const songList = this.state.song_list;
    songList.push(val);
    this.setState({
      song_list: songList,
    });
  }

  searchSong(val) {
    if (val) {
      this.setState({
        searchString: val,
      });
      axios.get(`${server}/tracks`, {
        params: {
          q: val,
          type: 'track',
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
      }).then((result) => {
        const songs = result.data.tracks || [];
        const selectSongList = [];
        songs.map(() => {
          selectSongList.push(false);
        });
        this.setState({
          songs,
        });
      }, (e) => {
        console.log('error', e);
        if (e.response.status === 401) {
          window.location = window.location.pathname;
        }
      });
    } else {
      this.setState({
        songs: [],
      });
    }
  }

  render() {
    return (
      <Wrapper>
        <WrapperRow>
          {this.state.success && <Title>Successfully Created Playlist </Title>}
          <Field id="playlist" required placeholder="Playlist Name" />
          <Field id="desc" required placeholder="Description" />
          <FieldDynamic id="song-search" required placeholder="Search a song!" func={(val) => { this.searchSong(val); }} />
          {<Songs searchString={this.state.searchString} flag_cap={this.state.song_list.length >= 5} songsArray={this.state.songs} callback={(val) => { this.updateSong(val); }} />}
          <RemoveSongWrapper>
            {this.state.song_list.map((song, i) => <Item><ButtonRemove id={i} onClick={this.removeSong.bind(this, i)}>x</ButtonRemove><span>{song.name}</span></Item>)}
          </RemoveSongWrapper>
          <Emoji emojiCallback={(val) => { this.getEmojiString(val); }} />
          <ButtonCreate onClick={this.createPlaylist.bind(this)}>Create Playlist</ButtonCreate>
        </WrapperRow>
      </Wrapper>
    );
  }
}

const WrapperRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const RemoveSongWrapper = Wrapper.extend`
  margin-top: 2em;
`;


const Item = styled.span`
  margin: .5em auto;
  padding-left: 3em;
`;

const ButtonCreate = Button.extend`
  margin-top: 0;
  margin-bottom: 0;
`;

const ButtonRemove = Button.extend`
  padding: 0 .2em;
  display: inline;
  margin: .5em;
`;


const Title = styled.h1`
  font-size: 3em;
  text-align: center;
  margin-bottom: 0;
`;
=======
import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Colors from './data/Colors';

import {FieldDynamic, Field} from './FieldInput';
import {Songs} from './Songs';
import {Button} from './Button';
import {Emoji} from './emoji';

const server = 'https://spotify-playlist-generator-api.herokuapp.com';
const emojiapi = 'https://emojistoemotions.herokuapp.com/emojicollection/';
export class Form extends Component {

  constructor(props){
    super(props);
    this.state = {
      song_list:[],
      song_select: [],
      emoji_string:'',
      searchString: '',
      success:false,
    };
  }

  searchSong(val){
    if(val){
      this.setState({
        searchString: val,
      })
      axios.get(`${server}/tracks`,{
        params:{
          q:val,
          type:'track',
          limit:10
        },
        headers:{
          'Authorization':`Bearer ${this.props.token}`
        }
      }).then((result)=>{
        console.log(result)
        let songs = result.data.tracks || [];
        let select_list = [];
        songs.map(() => {
          select_list.push(false);
        })
        this.setState({
          'songs': songs,
          'song_select': select_list
        });
        
      },(e)=>{
        console.log('error',e);
        if (e.response.status == 401) {
            window.location = window.location.pathname;
        }
      });
    }else{
      this.setState({
        'songs':[],
      });
    }
  }

  updateSong(val){
    var song_l = this.state.song_list;
    song_l.push(val);
    this.setState({
      song_list: song_l,
    });
  }

  removeSong(id){
    var song_l = this.state.song_list;
    song_l.splice(id,1);
    this.setState({song_list:song_l});
  }

  formatListToString(){
    //Turns list into comma separated string
    var sl = this.state.song_list;
    console.log(sl);
    var ret = ['','']; //0 - trackId, 1 - artistIds
    sl.map((song)=>{
      ret[0] += `${song.trackId},`;
      ret[1] += `${song.artistId},`;
    });
    ret[0] = ret[0].slice(0,-1);
    ret[1] = ret[1].slice(0,-1);
    return ret;
  }
  createPlaylist(){
    let self = this;
    var song_info = self.formatListToString();
    console.log(this.state);
    axios.get(`${emojiapi}${this.state.emoji_string}`).then((res)=>{
      var data = res.data;
      console.log(data)
      axios.post(`${server}/playlists`,{

        user:self.props.userid,
        name: document.getElementById('playlist').value,
        description: document.getElementById('desc').value,
        tracks:song_info[0],
        artists:song_info[1],
        limit:50,
        danceability:data.danceability,
        energy:data.energy,
        liveness:data.liveness,
        loudness:data.loudness,
        mode:data.mode,
        popularity:data.popularity,
        valence:data.valence
      },
      {
        headers:{
          'Authorization':`Bearer ${self.props.token}`
      }
      }).then((result)=>{
        console.log(self);
        console.log(result);
        self.setState({'success':true});
        self.setState({
          song_list: []
        })
      },(err)=>{
        console.log(self);
        console.log('error',err);
      });
    },(e)=>{
      axios.post(`${server}/playlists`,{

        user:self.props.userid,
        name: document.getElementById('playlist').value,
        description: document.getElementById('desc').value,
        tracks:song_info[0],
        artists:song_info[1],
        limit:50,

      },
      {
        headers:{
          'Authorization':`Bearer ${self.props.token}`
      }
      }).then((result)=>{
        self.setState({'success':true});
      },(err)=>{
        if (err.response.status == 401) {
            window.location = window.location.pathname;
        }
      });
    });
    };

  getEmojiString(val){
    this.setState({'emoji_string':val});
  }

  componentWillMount(){
    this.setState({
      'song_list': [],
      'songs': [],
    })
  }

  render() {
    let songList = this.state.song_list;
    return (
      <Wrapper>
        <WrapperRow>
            {this.state.success && <Title>Successfully Created Playlist </Title>}
            <Field id = 'playlist' required placeholder='Playlist Name'></Field>
            <Field id = 'desc' required placeholder='Description'></Field>
            <FieldDynamic id='song-search' required placeholder='Search a song!' func={(val)=>{this.searchSong(val)}}></FieldDynamic>
            {<Songs searchString={this.state.searchString} flag_cap = {this.state.song_list.length >= 5} songsArray = {this.state.songs} callback={(val)=>{this.updateSong(val)}}/>}
            <RemoveSongWrapper>
              {this.state.song_list.map((song, i) => {
                return <Item><ButtonRemove id={i} onClick={this.removeSong.bind(this,i)}>x</ButtonRemove><span>{song.name}</span></Item>
              })}
            </RemoveSongWrapper>
            <Emoji emojiCallback={(val)=>{this.getEmojiString(val)}}/>
            <ButtonCreate onClick={this.createPlaylist.bind(this)}>Create Playlist</ButtonCreate>
        </WrapperRow>
      </Wrapper>
    );
  }
};

const WrapperRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const RemoveSongWrapper = Wrapper.extend`
  margin-top: 2em;
`;


const Item = styled.span`
  margin: .5em auto;
  padding-left: 3em;
`;

const ButtonCreate = Button.extend`
  margin-top: 0;
  margin-bottom: 0;
`;

const ButtonRemove = Button.extend`
  width: 1em;
  padding: 0 .2em;
  display: inline;
  margin: .5em;
  margin-top: 0;
`;


const Title = styled.h1`
  font-size: 3em;
  text-align: center;
  margin-bottom: 0;
`;
>>>>>>> 8bd56e5846d1a869eff51cf4267a9f9433230616
