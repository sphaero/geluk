// import GSAP from 'react-gsap-enhancer'
import React from 'react';
import GSAP from 'gsap';
import ReactDOM from 'react-dom';

import Rebase from 're-base';

import Comment from './Gelukcomment.jsx';
import Message from './Gelukmessage.jsx';
import Allmessages from './Gelukallmessages.jsx';

const firebase = Rebase.createClass('https://geluk.firebaseio.com');

class Gelukoverlay extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      showMessage: false,
      posts: null
    }
  }

  componentDidMount(){
    var node = ReactDOM.findDOMNode(this);
    var buttons = this.refs.overlaybuttons;
    var text = this.refs.text;

    TweenLite.from(node, .4, {
      width: 0,
      padding: 0,
      display: 'block',
      ease: Power1.ease
    });

    TweenLite.from(text, .4, {
      y: 20,
      delay: .4,
      ease: Power1.ease,
      display: 'none'
    });

    if (this.props.text === "comment") {
      TweenLite.to(buttons, .4, {
        y: -20,
        delay: .4,
        ease: Power1.ease,
        display: 'block'
      });
      /* Fetch posts */
      firebase.fetch('users/answers/' + this.props.module + '/' + this.props.currentQuestion + '/' + this.props.happinessValue, {
        context: this,
        asArray: true,
        then(data){
          this.setState(function(state){
            state.posts = data;
            state.chosenPost = Math.floor(data.length*Math.random());
          });
        }
      }); 
    }
  }

  showBox(event){
    var parentNode = this.props.moduleDOM,
        thisNode = ReactDOM.findDOMNode(this),
        text = this.refs.text,
        buttons = this.refs.overlaybuttons,
        comment = ReactDOM.findDOMNode(this.refs.comment),
        fullWidth = window.innerWidth;

    [parentNode, thisNode].map(function(elements){
      return TweenLite.to(elements, .4, {
        minWidth: fullWidth,
        delay: .5,
        display: 'block',
        ease: Power1.ease
      });
     });        
    [text, buttons].map(function(elements){
      return TweenLite.to(elements, .4, {
        opacity: 0,
        y: 20,
        display: 'none',
        ease: Power1.ease
      });
     });

    TweenLite.to(comment, 1, {
      width: 0,
      padding: 0,
      delay: 1,
      y: -20,
      display: 'block',
      ease: Power1.ease
    })
  }

  resetWidth(){
    var parentNode = this.props.moduleDOM,
        thisNode = ReactDOM.findDOMNode(this),
        boxWidth = this.props.boxWidth;

    [parentNode, thisNode].map(function(elements){
      return TweenLite.to(elements, 1, {
        minWidth: boxWidth,
        display: 'block',
        ease: Power1.ease
      });
     });    

  }

  submitNext(event){
    this.props.setNext();
  }

  submitComment(event){
    var comment = ReactDOM.findDOMNode(this.refs.comment);
    TweenLite.to(comment, .3, {
      width: 0,
      padding: 0,
      delay: .2,
      y: 20,
      display: "none",
      opacity: 0,
      ease: Power1.ease
    })
  }

  setShowMessage(switcher){
    var switcher = switcher;
    this.setState(function(state){
      state.showMessage = switcher;
    })
    if(switcher === false){
      this.resetWidth();
    }
  }

  render() {
    if (this.props.text === "comment"){
      var cijfer = this.props.happinessValue;
      var tekst = "Wil je vertellen waarom je jezelf een " + cijfer + " gaf?";
      var showButtons = true;
    } else {
      var tekst = this.props.text;
    }
    var chosenPost = this.state.chosenPost;
		return (
			<div className="questions__overlay">
				<p className="questions__overlaytext" ref="text">{tekst}</p>
        { showButtons ? 
          <div className="questions__overlaybuttons" ref="overlaybuttons">
            <span className="questions__next--yellow" onClick={this.submitNext.bind(this)}>Liever niet</span>
            <span className="questions__next--yellow" onClick={this.showBox.bind(this)}>Ja</span>
          </div> : null
        }
        
        { this.props.showComment ? 
          <Comment 
            module={this.props.module}
            comment={this.props.comment} 
            submitCommentOverlay={this.submitComment.bind(this)}
            setAnswer={this.props.setAnswer.bind(this)}
            setShowMessage={this.setShowMessage.bind(this)}
            happinessValue={this.props.happinessValue} 
            ref="comment"
            currentQuestion={this.props.currentQuestion}
          /> : null 
        }
      { this.state.showMessage ? 
        <Message 
          age={this.state.posts[chosenPost].age} 
          gender={this.state.posts[chosenPost].gender} 
          rating={this.props.happinessValue} 
          comment={this.state.posts[chosenPost].answer} 
          setShowMessage={this.setShowMessage.bind(this)}
        /> : null
      }

      { this.props.showComment ?       <Allmessages
        module={this.props.module}
        currentQuestion={this.props.currentQuestion}
      /> : null}

			</div>
		)
	}
}

Gelukoverlay.propTypes = {
  text: React.PropTypes.string,
  comment: React.PropTypes.string
}

export default Gelukoverlay;