import React from 'react';
import Rebase from 're-base';

import Message from './Gelukmessage.jsx';

const firebase = Rebase.createClass('https://geluk.firebaseio.com');

class Comment extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			posts: null,
			word: false
		}
	}

	componentWillMount(){
	  firebase.fetch('users/answers/' + this.props.module + '/' + this.props.currentQuestion + '/' + this.props.happinessValue, {
	    context: this,
	    asArray: true,
	    then(data){
	      this.setState(function(state){
	      	state.posts = data
	      });
	    }
	  });
	}

	changeString(event){
		var message = event.target.value,
				currentQuestion = this.props.currentQuestion,
				currentModule = this.props.module,
				currentHappiness = this.props.happinessValue;

		this.setState(function(state){state.word = true});

		this.props.setAnswer(message, currentQuestion, currentModule, currentHappiness);
	}

	submitComment(event){
    if(event.keyCode == 13){
			this.props.submitCommentOverlay();
    }
		console.log("submitten")

	}

  render() {
  	var placeholder = "Ik gaf mijzelf een " + this.props.happinessValue + " omdat ik...";
  	var enterElem;
  	if(this.state.word){
  		enterElem = (<p className="commentbox__entermessage">Of druk enter</p>)
  	}
  	console.log(this.state)
		return (
			<div className="commentbox">
        <input type="text" 
        	className="commentbox__input"
        	value={this.props.comment} 
        	maxLength="140"
        	placeholder={placeholder}
        	onChange={this.changeString.bind(this)}
        	onKeyUp={this.submitComment.bind(this)}
        />
        <br/>
        <div className="commentbox__container">
        <span className="commentbox__next--white" onClick={this.submitComment.bind(this)}>verder</span>
        {enterElem}
        </div>
			</div>
		)
	}
}

Comment.propTypes = {
	submitString: React.PropTypes.func.isRequired,
	submitCommentOverlay: React.PropTypes.func.isRequired,
	comment: React.PropTypes.string.isRequired,
	currentQuestion: React.PropTypes.string.isRequired
}

export default Comment;