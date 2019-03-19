import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, Header, Button, Icon, Content } from 'native-base';
import CustomTitle from '../common/customTitle';
import CustomChatActions from './chat/CustomChatActions';
import { GiftedChat, Composer } from 'react-native-gifted-chat';

a = false;
class Chat extends Component {

  static navigationOptions = {
	header: null
  };

  state = {
    messages: [],
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Are you safe?',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'EMS',
            avatar: 'http://www.capecodfoundation.org/wp-content/uploads/2014/03/EMS-image.png',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    const fakeMessages = [{
      _id: 3,
      text: 'Where are you right now?',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'EMS',
        avatar: 'http://www.capecodfoundation.org/wp-content/uploads/2014/03/EMS-image.png',
      },
    }];
    if (!a) {
      a = true;
      setTimeout(() => {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, fakeMessages),
        }))
      }, 5000);
    }
  }

  renderContent() {
    return (
		<GiftedChat
			messages={this.state.messages}
			renderSend={this.renderCustomActions}
			renderComposer={this.renderComposer}
			onSend={messages => this.onSend(messages)}
			user={{
			_id: 1,
			}}
		/>
    )
  }

  renderCustomActions(props) {
    return <CustomChatActions {...props} onSend={this.onSendFromUser} />;
  }

  renderComposer(props) {
    return (
      <Composer
        {...props}
        textInputProps={{
		  blurOnSubmit: false,
          returnKeyType: 'send',
          multiline: false,
          onSubmitEditing: event => {
            props.onSend({ text: event.nativeEvent.text.trim() }, true);
          },
        }}
      />
    );
  }

  render() {
	let title = "Frida Chat";
	const { params } = this.props.navigation.state;
	if (params && params.title) {
		let { title } = this.props.navigation.state.params;
	}
	return (
		<Container style={styles.container}>
			<Header>
				<Button onPress={() => this.props.navigation.pop()}
						transparent>
					<Icon name="ios-arrow-back" />
				</Button>

				<CustomTitle>
					{title}
				</CustomTitle>

				<Button transparent>
					<Icon name="ios-notifications-outline" style={{color: 'transparent'}}/>
				</Button>
			</Header>
			<View style={styles.content}>
				{ this.renderContent.bind(this)() }
			</View>
		</Container>
	);
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	content: {
		flex: 1,
		backgroundColor: '#fff',
		paddingBottom: 20
	}
});

export default Chat;
