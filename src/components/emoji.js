import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Colors from './data/Colors';

const server = 'https://emojistoemotions.herokuapp.com/emojicollection';

export class Emoji extends Component {
  constructor(props){
    super(props);
    this.state = {
      emoji_list:[],
      emoji_string:[],
      emoji_select:[],
    };
  }

  emojiGet(){
      axios.get(`${server}`).then((result)=>{
        let emojis = result.data;
        let emojis_selected = [];
        emojis.map((el, i) => {
          emojis_selected.push(false);
        });
        this.setState({
          emoji_list: emojis,
          emoji_select: emojis_selected
        });
      },(e)=>{
        console.log('error',e);
      });
  }
  componentWillMount(){
    this.emojiGet();
    this.setState({
      emoji_list: []
    })
  
  }

  addEmoji(emoji, id){
    let curr = this.state.emoji_string;
    let tempArr = this.state.emoji_select;    
    curr.push(emoji);
    tempArr[id] = true;
    this.setState({
      emoji_select: tempArr,
      emoji_string:curr
    })

    this.props.emojiCallback(this.formatEmojiString(this.state.emoji_string));
  }

  formatEmojiString(emoji_list){
    var estring = '';
    for(let e of emoji_list){
      estring += `${e.unicode}_`;
    }
    estring = estring.slice(0,-1);

    return estring;
  }

  render() {
    let emojis = this.state.emoji_list;
    let emojis_1 = emojis.slice(0, emojis.length/2);
    let emojis_2 = emojis.slice(emojis.length/2, emojis.length);

    const selectEmoji = function(index) {
      return this.state.emoji_select[index] ? EmojibtnSelect : Emojibtn;
    }

    return (
      <Template>
        <Wrapper>
          {emojis_1.map((emoji, i) => {
            return (this.state.emoji_select[i] ? 
              <EmojibtnSelect id = {`emoji__${i}`} onClick={this.addEmoji.bind(this, emoji, i)}>{emoji.emoji}</EmojibtnSelect> :
              <Emojibtn id = {`emoji__${i}`} onClick={this.addEmoji.bind(this, emoji, i)}>{emoji.emoji}</Emojibtn>
            )
          })}
        </Wrapper>
        <Wrapper>
          {emojis_2.map((emoji, i) => {
            return (this.state.emoji_select[i + emojis.length/2] ? 
              <EmojibtnSelect id = {`emoji__${i + emojis.length/2}`} onClick={this.addEmoji.bind(this, emoji, i + emojis.length/2)}>{emoji.emoji}</EmojibtnSelect> :
              <Emojibtn id = {`emoji__${i + emojis.length/2}`} onClick={this.addEmoji.bind(this, emoji, i + emojis.length/2)}>{emoji.emoji}</Emojibtn>
            )
          })}
        </Wrapper>
      </Template> 
    );
  }
};

const Emojis = styled.p`
  font-size: 2em;
`;

const Wrapper = styled.div`
  height: 5em;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Emojibtn = styled.button`
  background-color:inherit;
  padding: 0;
  margin: 5px;
  border: none;
  background:none;
  font-size: 1.7em;
  transition: all .3s;

  &:hover {
    transform: scale(1.5);
  }

  &:focus {
    box-shadow: transparent;
    outline: none;
  }
`;

const EmojibtnSelect = Emojibtn.extend`
  transform: scale(1.5);
`;

const WrapperSelect = Wrapper.extend`
  position: absolute;
  top: 75%;
  left: 50%;
  transform: translate(-50%, -50%);

`;

const Template = styled.div`
  height: 13em;
`;