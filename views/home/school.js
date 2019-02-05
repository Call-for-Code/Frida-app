import React, { Component } from 'react';
import { View, StyleSheet, Image, Text} from 'react-native';
import { Container, Header, Button, Icon, Content, Card, CardItem, Left, Body, Right, Title } from 'native-base';
import CustomTitle from '../common/customTitle';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
var WS = require('websocket').w3cwebsocket;

class School extends Component {

	static navigationOptions = {
		header: null
	};

  constructor(props) {
		super(props);
		this.state = {
			sensor1: true,
            sensor2: true,
            sensor3: true,
            sensor4: true,
            firstPath: true,
            secondPath: false,
            thirdPath: false,
            fourthPath: false
		};
  }

  componentWillMount() {
	this.connectSocket();
  
}

connectSocket() {
	const that = this;
	var client = new WS('ws://iot-image-analysis.mybluemix.net/ws/receiveMessage');
	client.onerror = function(e) {
		console.log('Connection Error', e);
	};
	client.onopen = function() {

		// print closing message
		client.onclose = function() {
			setTimeout(function(){
				that.connectSocket();
			},
			5000);
		};

		// print receiving message
		client.onmessage = function(e) {
			if (typeof e.data === 'string') {
				const socketAlerts = JSON.parse(e.data);
				const device = socketAlerts.deviceNumber;
				const alertStatus = socketAlerts.triggerAlert;
				if (alertStatus === that.state[device]){
					switch(device) {
						case "sensor1":
							that.setState({ sensor1: !alertStatus }) ;
							break;
						case "sensor2":
							that.setState({ sensor2: !alertStatus }) ;
							break;
						case "sensor3":
							that.setState({ sensor3: !alertStatus }) ;
							break;
						case "sensor4":
							that.setState({ sensor4: !alertStatus }) ;
							break;
						default:
							console.log("Invalid sensor");
					}
					that.computePath();
				}
			}
		};
	};
}

computePath(){
	const possiblePath1=["sensor1", "sensor4"];
	const possiblePath2=["sensor2", "sensor4"];
	const possiblePath3=["sensor2", "sensor3"];
	const possiblePath4=["sensor3"];
	const pathOptionByDistance=[{"firstPath": possiblePath1},
	{"secondPath": possiblePath2},
	{"thirdPath": possiblePath3},
	{"fourthPath": possiblePath4}];
	// delect existing paths
	this.setState({
		firstPath: false,
		secondPath: false,
		thirdPath: false,
		fourthPath: false
	});

	// find the shortest with sensor as weighth
	for (let index=0; index < pathOptionByDistance.length; index++) {
		const pathName = Object.keys(pathOptionByDistance[index])[0];
		const sensorData = pathOptionByDistance[index][pathName];
		let allSensorsUp = true;
		for (let index1=0; index1< sensorData.length; index1++) {
			if (!this.state[sensorData[index1]]) {
				allSensorsUp=false;
			}
		}
		if(allSensorsUp) {
			switch(pathName) {
			case "firstPath":
				this.setState({ firstPath: true }) ;
				break;
			case "secondPath":
				this.setState({ secondPath: true }) ;
				break;
			case "thirdPath":
				this.setState({ thirdPath: true }) ;
				break;
			case "fourthPath":
				this.setState({ fourthPath: true }) ;
				break;
			default:
				console.log("Invalid path");
		}
			break;
		}
	}
}

mapSection() {
	return(
		<View style={styles.mainContainer}>
			<View style={styles.containerMap}>
				<View style={styles.entry}>
					<Text style={styles.roomText}>
						<MaterialIcon name="directions-run" size={30} color="#4F8EF7" />
					</Text>
				</View>

				<View style={styles.roomsContainer}>
					<View style={styles.section1}>
						<View style = {styles.section1Partial1}><Text style={styles.roomText}><FontAwesome name="fire-extinguisher" size={20} color="red" /></Text></View>
						<View style = {styles.section1Hidden}>
							{this.state.firstPath ?
							<Text style={styles.pathDirectionUp}><EntypoIcon name="arrow-long-up" size={20} color="#5aa700" /></Text>: null}
							{ this.state.secondPath || this.state.thirdPath || this.state.fourthPath ? <Text style={styles.pathDirectionDown}><EntypoIcon name="arrow-long-down" size={20} color="#5aa700" /></Text> : null}
							{ this.state.fourthPath ? <Text style={styles.pathDirectionDown1}><EntypoIcon name="arrow-long-down" size={20} color="#5aa700" /></Text> : null}
							{ this.state.fourthPath ? <Text style={styles.pathDirectionDown1}><EntypoIcon name="arrow-long-down" size={20} color="#5aa700" /></Text> : null}
						</View>
						<View style = {styles.section1Partial2}></View>
					</View>

					<View style={styles.section2}>
						<View style={styles.roomsSection}>
							<View style={styles.area1}>
								<View style={styles.block1}>
									<View style={styles.smallRoomSec1}>
										<Text style={styles.roomText}>Room 1</Text>
										{this.state.sensor1 ? <Text style={styles.roomText}><MaterialCommunityIcon name="check-circle" size={20} color="#5aa700" /></Text> : null}
										{!this.state.sensor1 ?  <Text style={styles.roomText}><MaterialCommunityIcon name="close-circle" size={20} color="#e71d32" /></Text>: null}
									</View>
									<View style={styles.smallRoomSec2}>
										<View style={styles.smallRoomSec2_1}></View>
										<View style={styles.smallRoomSec2_2}></View>
										<View style={styles.smallRoomSec2_3}></View>
									</View>
								</View>
								<View style={styles.block2}>
									{this.state.firstPath ? <Text style={styles.pathLeftDirection1}> <EntypoIcon name="arrow-long-right" size={20} color="#5aa700" /></Text>: null}
									{/* {this.state.firstPath ? <Text style={styles.pathLeftDirection}> <EntypoIcon name="arrow-long-right" size={20} color="#5aa700" /></Text> : null} */}
								</View>
								<View style={styles.block3}>
									<View style={styles.smallRoomSec1}>
										<Text style={styles.roomText}>Room 2</Text>
										{this.state.sensor2 ? <Text style={styles.roomText}><MaterialCommunityIcon name="check-circle" size={20} color="#5aa700" /></Text>: null}
										{!this.state.sensor2 ? <Text style={styles.roomText}><MaterialCommunityIcon name="close-circle" size={20} color="#e71d32" /></Text>: null }
									</View>
										<View style={styles.smallRoomSec2}>
											<View style={styles.smallRoomSec2_1}></View>
											<View style={styles.smallRoomSec2_2}></View>
											<View style={styles.smallRoomSec2_3}></View>
										</View>
									</View>
								<View style={styles.block4}>
									{this.state.secondPath || this.state.thirdPath? <Text style={styles.pathLeftDirection}> <EntypoIcon name="arrow-long-right" size={20} color="#5aa700" /></Text> : null}
									{this.state.secondPath ? <Text style={styles.pathLeftDirection}> <EntypoIcon name="arrow-long-right" size={20} color="#5aa700" /></Text> : null}
								</View>
							</View>
							<View style={styles.area2}>
								{this.state.firstPath || this.state.secondPath ?<Text style={styles.pathDirectionCenter}> <EntypoIcon name="arrow-long-right" size={20} color="#5aa700" /></Text> : null}
								{this.state.secondPath ? <Text style={styles.pathDirectionUpward}> <EntypoIcon name="arrow-long-up" size={20} color="#5aa700" /></Text> : null}
								{this.state.secondPath ? <Text style={styles.pathDirectionUpward}> <EntypoIcon name="arrow-long-up" size={20} color="#5aa700" /></Text>: null}

							</View>
							<View style={styles.area3}>
								<View style = {styles.area3Hidden1}>
									<Text style={styles.roomText}>Room 4</Text>
									{this.state.sensor4 ? <Text style={styles.roomText}><MaterialCommunityIcon name="check-circle" size={20} color="#5aa700" /></Text>: null}
									{!this.state.sensor4 ? <Text style={styles.roomText}><MaterialCommunityIcon name="close-circle" size={20} color="#e71d32" /></Text>: null}
								</View>
								<View style = {styles.area3Hidden2}>
									{this.state.firstPath || this.state.secondPath ? <Text style={styles.pathRightDirection}> <EntypoIcon name="arrow-long-right" size={20} color="#5aa700" /></Text>: null}
								</View>
								<View style = {styles.area3Hidden3}></View>
							</View>
						</View>
						<View style={styles.room}>
							<View style={styles.roomDSec1}></View>
							<View style={styles.roomDSec2}>
								{ this.state.thirdPath ? <Text style={styles.pathDirectionNoPadding}> <EntypoIcon name="arrow-long-down" size={20} color="#5aa700" /></Text>: null }
							</View>
							<View style={styles.roomDSec3}>
								<Text style={styles.roomText}>Room 3</Text>
								{this.state.sensor3 ? <Text style={styles.roomText}><MaterialCommunityIcon name="check-circle" size={20} color="#5aa700" /></Text>: null}
								{!this.state.sensor3 ? <Text style={styles.roomText}><MaterialCommunityIcon name="close-circle" size={20} color="#e71d32" /></Text>: null}
							</View>
						</View>
						<View style={styles.path}>
							{this.state.fourthPath ? <Text style={styles.pathDirectionExtremeRight}> <EntypoIcon name="arrow-long-right" size={20} color="#5aa700" /></Text> : null }
							{!this.state.fourthPath ? <Text style={styles.pathDirectionExtremeRight2}></Text> : null}
							{this.state.thirdPath || this.state.fourthPath ?<Text style={styles.pathDirectionRight}> <EntypoIcon name="arrow-long-right" size={20} color="#5aa700" /></Text> : null }
							{this.state.thirdPath || this.state.fourthPath ?<Text style={styles.pathDirectionRight}> <EntypoIcon name="arrow-long-right" size={20} color="#5aa700" /></Text>: null}
							{this.state.thirdPath || this.state.fourthPath ?<Text style={styles.pathDirectionRight}> <EntypoIcon name="arrow-long-right" size={20} color="#5aa700" /></Text>: null}
						</View>
					</View>

					<View style={styles.section3}>
						<View style = {styles.section2Partial1}></View>
						<View style = {styles.section1Hidden}>
							{this.state.firstPath || this.state.secondPath ?<Text style={styles.pathDirectionDown2}> <EntypoIcon name="arrow-long-down" size={20} color="#5aa700" /></Text> : null }
							{this.state.thirdPath || this.state.fourthPath ?<Text style={styles.pathDirectionUp2}> <EntypoIcon name="arrow-long-up" size={20} color="#5aa700" /></Text> : null}
						</View>
						<View style = {styles.section2Partial2}>
							{this.state.thirdPath || this.state.fourthPath ?<Text style={styles.pathDirectionUp3}> <EntypoIcon name="arrow-long-up" size={20} color="#5aa700" /></Text>: null}
							{this.state.thirdPath || this.state.fourthPath ?<Text style={styles.pathDirectionUp3}> <EntypoIcon name="arrow-long-up" size={20} color="#5aa700" /></Text>: null}
						</View>
					</View>
				</View>

				<View style={styles.exit}><Text style={styles.roomText}><MaterialCommunityIcon name="door" size={30} color="#4F8EF7" /></Text></View>
			</View>
		</View>
	);
}

  renderContent() {
	  const { showEscapeRoute } = this.props.navigation.state.params;
	  let img = <Image style={{ marginBottom: 2 }} source={require('../../assets/school-example.png')} />;
	  if (showEscapeRoute) {
		img = <Image style={{ marginBottom: 2, height: 400, width: 370}} source={require('../../assets/school-example-route.png')} />;
	  }
	  return (
		<View style={styles.innerContentContainer}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>
					Marlborough School
				</Text>
				<Text style={styles.headerDescription}>
					Los Angeles, CA
				</Text>
				<Text style={styles.headerDropdown}>
					My School Exits
				</Text>
			</View>
			{this.mapSection()}
			
		</View>
	  );
  }

  render() {
		return (
			<Container style={styles.container}>
				<Header>
					<Button onPress={() => this.props.navigation.pop()}
							transparent>
						<Icon name="ios-arrow-back" />
					</Button>

					<CustomTitle>
						My School
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
	},
	header: {
		padding: 20,
		alignItems: 'center',
		backgroundColor: '#FFF'
	},
	headerTitle: {
		fontSize: 22,
		color: '#091A33'
	},
	headerDescription: {
		fontSize: 13,
		color: '#B7B7B7'
	},
	headerDropdown: {
		color: '#09B961',
		fontSize: 14,
		fontWeight: 'bold',
		paddingTop: 10
	},
	innerContentContainer: {
		backgroundColor: '#FAFAFA'
	},
	padder: {height: '10%'},
    pathDirection: {paddingLeft: '0%'},
    pathDirectionRight: {paddingLeft: '10%'},
    pathDirectionExtremeRight: {paddingLeft: '5%'},
    pathDirectionExtremeRight2: {paddingLeft: '20%'},
    pathDirectionUp: {paddingLeft: '30%'},
    pathDirectionUp2: {paddingLeft: '10%',paddingTop: '100%'},
    pathDirectionUp3: {paddingLeft: '10%',paddingTop: '70%'},
    pathDirectionDown: {paddingLeft: '30%',paddingTop: '100%'},
    pathDirectionDown1: {paddingLeft: '30%',paddingTop: '62%'},
    pathDirectionDown2: {paddingLeft: '10%',paddingTop: '0%'},
    pathDirectionNoPadding: {justifyContent: 'center'},
    pathLeftDirection: {paddingLeft: '12%'},
    pathLeftDirection1: {paddingLeft: '30%'},
    pathDirectionCenter: {paddingLeft: '12%', paddingTop: '260%'},
    pathDirectionUpward: {paddingTop: '30%', paddingTop: '60%'},
    pathRightDirection: {},
    mainContainer: {
        width: '100%',
        borderWidth: 0,
        overflow: 'hidden',
        
    },
    containerMap: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        borderWidth: 0,
        overflow: 'hidden',
    },
    entry: {
        width: 40,
        height: 66,
        borderWidth: 4,
        borderColor: 'grey',
		borderRightWidth: 0,
		borderLeftWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',

    },
    exit: {
        height: 66,
        width: 40,
        borderWidth: 4,
        borderColor: 'grey',
		borderLeftWidth: 0,
		borderRightWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    roomsContainer: {
        height: 300,
        width: 250,
        borderWidth: 0,
        flexDirection: "row",
        overflow: 'hidden'
    },
    section1: {
        width: '15%',
        height:'100%',
        borderWidth: 0,
        borderColor: 'grey',
        borderTopWidth: 4,
        borderBottomWidth: 4
    },
    section1Hidden: {
        width: '100%',
        height: '20%',
        borderWidth: 0,
        overflow: 'visible'
    },
    section1Partial1: {
        width: '100%',
        height: '40%',
        borderWidth:0,
        borderLeftWidth: 4,
        borderColor: 'grey',
    },
    section1Partial2: {
        width: '100%',
        height: '41%',
        borderWidth:0,
        borderLeftWidth: 4,
        borderColor: 'grey',
    },
    section2Partial1: {
        width: '100%',
        height: '40%',
        borderWidth:0,
        borderColor: 'grey',
        borderRightWidth: 4,
        overflow:'visible'
    },
    section2Partial2: {
        width: '100%',
        height: '41%',
        borderWidth:0,
        borderColor: 'grey',
        borderRightWidth: 4,
    },
    section3: {
        width: '15%',
        height:'100%',
        borderWidth: 0,
        borderTopWidth: 4,
        borderBottomWidth: 4,
        borderColor: 'grey',
    },
    section2: {
        width: '70%',
        height:'100%',
        borderWidth: 0,
        borderTopWidth: 4,
        borderBottomWidth: 4,
        borderColor: 'grey',
        flexDirection: "column"
    },
    room: {
        borderWidth: 0,
        height: '17%',
        width: '100%',
        flexDirection: 'row'
    },
    roomDSec1: {
        borderWidth: 4,
        borderColor: 'grey',
        borderRightWidth: 0, 
        height: '100%',
        width: '18%'
    },
    roomDSec2: {
        borderWidth: 0,
        height: '100%',
        width: '10%'
    },
    roomDSec3:{
        borderWidth: 4,
        borderColor: 'grey',
        borderLeftWidth:0, 
        height: '100%',
        width: '72%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    roomText: {
        color: 'grey'
    },
    path: {
        borderWidth: 0,
        height: '8%',
        width: '100%',
        flexDirection: 'row'
    },
    roomsSection: {
        borderWidth: 0,
        height: '75%',
        width: '100%',
        flexDirection: "row"
    },
    area2: {
        borderWidth: 0,
        height: '100%',
        width: '15%'
    },
    area3: {
        borderColor: 'grey',
        borderBottomWidth: 0,
        borderTopWidth: 0,
        height: '100%',
        width: '40%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    area3Hidden1: {
        height: '40%',
        width: '100%',
        borderWidth: 4,
        borderColor: 'grey',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    area3Hidden2: {
        borderWidth: 0,
        borderColor: 'grey',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        height: '10%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    area3Hidden3: {
        borderWidth: 4,
        borderColor: 'grey',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        height: '50%',
        width: '100%'
    },
    area1: {
        height: '100%',
        width: '45%'
    },
    block1: {
        borderWidth: 0,
        width: '100%',
        height: '40%',
    },
    smallRoomSec1: {borderWidth: 4, height: '80%', width: '100%', borderColor: 'grey', borderTopWidth: 0,borderBottomWidth: 0,  justifyContent: 'flex-start', alignItems: 'center',},
    smallRoomSec2: {borderWidth: 0, flexDirection: 'row', height: '20%', width: '100%'},
    smallRoomSec2_1: {borderWidth: 4, height: '100%', width: '40%', borderColor: 'grey', borderTopWidth: 0,borderRightWidth: 0},
    smallRoomSec2_2: {borderWidth: 0, height: '100%', width: '20%'},
    smallRoomSec2_3: {borderWidth: 4, height: '100%', width: '40%', borderColor: 'grey', borderTopWidth: 0,borderLeftWidth: 0},
    block2: {
        width: '100%',
        height: '10%',
        flexDirection: 'row'
    },
    block3: {
        borderTopWidth: 4,
        borderColor: 'grey',
        width: '100%',
        height: '40%',
    },
    block4: {
        width: '100%',
        height: '10%',
        flexDirection: 'row'
    }
});

export default School;