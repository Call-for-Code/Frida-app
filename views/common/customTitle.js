import React, { Component } from 'react';
import { Title } from 'native-base';
import { Dimensions, Platform } from 'react-native';

class CustomTitle extends Component {
	render() {
		return(
			<Title style={{ flex: 1, marginTop: 12 }}>
				{this.props.children}
			</Title>
		);
	}
}
export default CustomTitle;
