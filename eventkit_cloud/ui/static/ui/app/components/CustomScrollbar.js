import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

export class CustomScrollbar extends Component {
    constructor(props, ...rest) {
        super(props, ...rest);
    }

    renderThumb({style, ...props}) {
        const thumbStyle = {backgroundColor: '#8A898B', opacity: '0.7', borderRadius: '5px'};
        return (
            <div style={{...style, ...thumbStyle}} {...props}/>
        );
    }
    scrollToBottom() {
        return this.refs.scrollBar.scrollToBottom();
    }
    
    render() {
        return (
            <Scrollbars
                ref="scrollBar"
                renderThumbVertical={this.renderThumb}
                {...this.props}/>
        );
    }
}

export default CustomScrollbar;
