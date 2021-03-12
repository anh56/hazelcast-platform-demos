import React, {Component} from 'react';
import Collapsible from 'react-collapsible';
import detectBrowserLanguage from 'detect-browser-language';
import styled from 'styled-components';
import update from 'immutability-helper';

import "../../Query.css";

var rest = require('rest');
var mime = require('rest/interceptor/mime');

// Styled-components. Could move to CSS
const Styles = styled.div `
  table {
    border-spacing: 0;
    width: 100%;
    tr {
    }
    td {
    }
  }
`

// The '<Table/>' HTML element
function Table({ data }) {
          return (
            <table>
    			<tbody>
      				{data.map((row) => (
        			<tr>
        			  <td>
        			    {row}&nbsp;
        			  </td>
        			</tr>
					))}
    			</tbody>            
            </table>
          )
}

class Querying extends Component {
    constructor(props) {
        super(props);
        this.state = {
	            browserLanguage: "en",
				query: 'SELECT * FROM kf_trades',
          	    message1: [],
                message2: '',
                message2_style: {
                	color: 'yellow',
                    'font-weight': 'bold'
                }
            };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        this.setState({browserLanguage: detectBrowserLanguage()})
        var rows = [];
        for (var i = 0; i < 12; i++) {
            rows.push('');
		}
		this.setState({	
            message1: update(this.state.message1, {$set: rows}) 
        })
		var text2 = '.';
	    var text2_style = {visibility: 'hidden'};
		this.setState({	
            message2: update(this.state.message2, {$set: text2}) 
        })
		this.setState({	
            message2_style: update(this.state.message2_style, {$set: text2_style}) 
        })
    }

    handleChange(e) {
        if (e.target.name === 'query') {
        	//console.log("Querying.js", "handleChange()", this.state.query);
            this.setState({query: e.target.value});
        }
    }
    
    handleSubmit(e) {
     	console.log("Querying.js", "handleSubmit()", this.state.query);
     	e.preventDefault();
        setTimeout(() => {
                var client = rest.wrap(mime);
                var self = this;
                
                var restURL = '/rest/sql?query=' + this.state.query;

                client({path:restURL}).then(
                                function(response) {
                        console.log("Querying.js", "handleSubmit()", "response.entity", response.entity);
                        var payload = response.entity;
                        
                        var text1 = [];
                        var text2 = '?';
                        var text1_style = {};
                        var text2_style = {};

	                    var error_message = payload.error;
	                    var warning_message = payload.warning;
	                    var rows_message = payload.rows;

                        var error_style = {
                        	color: 'red',
                        	'font-weight': 'bold'
	                	}
    					var warning_style = {
                            color: 'yellow',
                        	'font-weight': 'lighter'
                    	}

                        var i = 0;
                        // Lines provided
                        if (error_message.length == 0) {
                            for (; i < rows_message.length; i++) {
        						text1.push(rows_message[i]);
							}
                        }
						// Remaining lines if needed
                        for (; i < 12; i++) {
        				    text1.push('');
						}
                        
                        
                        if (warning_message.length > 0) {
	                        text2 = warning_message
                        	text2_style = warning_style;
						} else {
	                        text2 = '.';
                        	text2_style = {visibility: 'hidden'};
                        }
                        if (error_message.length > 0) {
	                        text2 = error_message
                        	text2_style = error_style;
                        }

                        self.setState({
                                message1: update(self.state.message1, {$set: text1})  
                        });
                        self.setState({
                                message2: update(self.state.message2, {$set: text2}) 
                        });
                        self.setState({
                                message2_style: update(self.state.message2_style, {$set: text2_style}) 
                        });
                });
        }, 250)
        setTimeout(() => {
                var self = this;

        		var text1 = [];
        		for (var i=0; i < 12; i++) {
        			text1.push('');
				}
                
				var text2 = '.';
	            var text2_style = {visibility: 'hidden'};
				
                self.setState({
                	message1: update(self.state.message1, {$set: text1})  
                });
                self.setState({
                	message2: update(self.state.message2, {$set: text2}) 
                });
                self.setState({
                	message2_style: update(self.state.message2_style, {$set: text2_style}) 
                });
        }, 15000)
        window.location = "#";
    }
    
    render() {
        return (
        	<div>
        		<Collapsible
        		 trigger="Querying"
        		 className="Collapsible"
        		 openedClassName="Collapsible-opened"
        		 triggerClassName="Collapsible__trigger"
        		 triggerOpenedClassName="Collapsible__trigger-opened"
        		 >
					<div class="greenOuterBox">
                        <div class="greenInputBox">
                        	<form>
                                <label for="query">Query:</label>
                                <input type="text" 
                                 id="query" name="query" defaultValue={this.state.query}
                                 onChange={this.handleChange}/>
                                <button onClick={this.handleSubmit}>Submit</button>
                          	</form>
                    	</div>
                    </div>
                    <div class="greenOuterBox">     
                        <div class="greenOutputBox">
                            <code>
                                <Styles>
                                	<pre>
                                        <Table data={this.state.message1} />
                                    </pre>
                                </Styles>
                            </code>
                        	<p style={this.state.message2_style}>{this.state.message2}</p>
                    	</div>
                    </div>
        		</Collapsible>
        	</div>
        );
    }
}

export default Querying;
