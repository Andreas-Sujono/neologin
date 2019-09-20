import connectToParent from 'penpal/lib/connectToParent';
import Neon from "@cityofzion/neon-js";
import { server } from './config';
import React from 'react'
import ReactDOM from 'react-dom'
import LoginButton from './Views/LoginButton'
import UserData from './Views/UserData';
import RequestAcceptance from './Views/RequestAcceptance'
import { u } from '@cityofzion/neon-js';
import { v4 as uuid } from 'uuid';

let acct = null;
let defaultNetwork = "MainNet";
const supportedNetworks = ["MainNet", "TestNet"];

let totalRequests = 0
let calledLogin = false
let calledPermission = false
let userGivesPermission = false

let rawMethods = {
	getProvider,
	getNetworks,
	getAccount,
	getPublicKey,
	getBalance,
	getStorage,
	invokeRead,
	getBlock,
	getBlockHeight,
	getTransaction,
	getApplicationLog,
	send,
	invoke,
	invokeMulti,
	signMessage,
	deploy,
	//Methods implemented in the client SDK
	//addEventListener,
	//removeEventListener
};

let methods = {};

const unathenticatedMethods = ['getProvider', 'getNetworks', 'getBalance', 'getStorage', 'getBlock', 'getBlockHeight', 'getTransaction', 'getApplicationLog'];

Object.keys(rawMethods).map((key) => {
	methods[key] = (...args) => {
		if (acct || unathenticatedMethods.includes(key)) {
			return rawMethods[key](...args);
		} else {
			return signIn().then(() => rawMethods[key](...args)).catch((e) => Promise.reject(e))
		}
	}
})

const connection = connectToParent({
	methods
});

connection.promise.then(parent => {
	parent.sendEvent('READY', providerInfo);
	//TODO: Add event listeners for CONNECTED, BLOCK_HEIGHT_CHANGED and TRANSACTION_CONFIRMED

	//parent.add(3, 1).then(total => console.log(total));
});

function signIn() {
	return new Promise((resolve, reject) => {
		if (!calledLogin) {
			console.log('inn')
			calledLogin = true
			let storedPrivkey = window.localStorage.getItem('privkey');
			if (storedPrivkey === null) {
				window.addEventListener("message",
					(event) => {
						console.log(event.origin, server)
						if (event.origin !== server || !event.data.privkey) {
							return;
						}
						acct = Neon.create.account(event.data.privkey);
						if (event.data.rememberMe) {
							// Store privkey in localStore and restore later 
							window.localStorage.setItem('privkey', event.data.privkey);
						}
						successfulSignIn(acct)
						resolve();
					},
					false
				);
				showLoginButton();
			} else {
				acct = Neon.create.account(storedPrivkey);
				successfulSignIn(acct)
				resolve();
			}
		}
		else {
			reject()
		}
	});
}

const providerInfo = {
	name: 'NeoLogin',
	website: 'https://neologin.io',
	version: 'v0.1',
	compatibility: [],
	extra: {
		theme: null,
		currency: null
	}
};

// Does NOT need to be accepted
function getProvider() {
	return Promise.resolve(providerInfo);
}

// Does NOT need to be accepted
function getNetworks() {
	return Promise.resolve({
		networks: supportedNetworks,
		defaultNetwork: defaultNetwork
	});
}

// Needs to be accepted once
function getAccount(...args) {
	return new Promise((resolve, reject) => {
		requestAcceptance('Do you want to give access to your address?').then(() => {
			resolve({
				address: acct.address,
				label: 'My Spending Wallet'
			})
		}).catch(() => {
			reject({
				type: 'CONNECTION_DENIED',
				description: 'The user rejected the request to connect with your dApp.',
				data: ''
			});
		})
	})
}

// Needs to be accepted once
function getPublicKey() {
	return new Promise((resolve, reject) => {
		requestAcceptance('Do you want to give access to your public key?').then(() => {
			resolve({
				address: acct.address,
				publicKey: acct.publicKey
			})
		}).catch(() => {
			reject({
				type: 'CONNECTION_DENIED',
				description: 'The user rejected the request to connect with your dApp.',
				data: ''
			});
		})
	})
}

// Does NOT need to be accepted
function getBalance(balanceArgs) {
	return new Promise((resolve, reject) => {
	})
}

// Does NOT need to be accepted
function getStorage(storageArgs) {
	return new Promise((resolve, reject) => {
		//foo().then(() => resolve({ result: 'hello world' })).catch(() => {
		//	reject({
		//		type: 'RPC_ERROR',
		//		description: 'There was an error when broadcasting this transaction to the network.',
		//		data: ''
		//	});
		//})
		resolve({ result: 'hello world' })
	})
} //{ scriptHash: string, key: string, network?: string }){

// Needs to be accepted once
function invokeRead(invokeArgs) {
	return new Promise((resolve, reject) => {
		if (!acct)
			reject({
				type: 'CONNECTION_REFUSED',
				description: 'Connection dApp not connected. Please call the "connect" function.',
				data: ''
			})
		else
			//foo().then(() => resolve({ ... })).catch(() => {
			//	reject({
			//		type: 'RPC_ERROR',
			//		description: 'There was an error when broadcasting this transaction to the network.',
			//		data: ''
			//	});
			//})
			resolve({
				script: '8h89fh398f42f.....89hf2894hf9834',
				state: 'HALT, BREAK',
				gas_consumed: '0.13',
				stack: [
					{
						type: 'Integer',
						value: '1337'
					}
				]
			})
	})
}

// Does NOT need to be accepted
function getBlock(blockArgs) {
	//return new Promise((resolve, reject) => {
	//	foo().then(() => resolve({ ... })).catch(() => {
	//		reject({
	//			type: 'RPC_ERROR',
	//			description: 'There was an error when broadcasting this transaction to the network.',
	//			data: ''
	//		});
	//	})
	//})
}

// Does NOT need to be accepted
function getBlockHeight(blockHeightArgs) {
	//return client.getBlockCount();

	//return new Promise((resolve, reject) => {
	//	foo().then(() => resolve({ "result": 2619690 })).catch(() => {
	//		reject({
	//			type: 'RPC_ERROR',
	//			description: 'There was an error when broadcasting this transaction to the network.',
	//			data: ''
	//		});
	//	})
	//})
}

// Does NOT need to be accepted
function getTransaction(txArgs) {
	//return new Promise((resolve, reject) => {
	//	foo().then(() => resolve({ ... })).catch(() => {
	//		reject({
	//			type: 'RPC_ERROR',
	//			description: 'There was an error when broadcasting this transaction to the network.',
	//			data: ''
	//		});
	//	})
	//})
}

// Does NOT need to be accepted
function getApplicationLog(appLogArgs) {
	//return new Promise((resolve, reject) => {
	//	foo().then(() => resolve({ ... })).catch(() => {
	//		reject({
	//			type: 'RPC_ERROR',
	//			description: 'There was an error when broadcasting this transaction to the network.',
	//			data: ''
	//		});
	//	})
	//})
}

// Needs to be accepted every time
function send(sendArgs) {
	return new Promise((resolve, reject) =>
		requestAcceptance('This website is requesting access to your account').then(() =>//TODO DIFFERENT FOR TRANSACTION
			alert('sent!')
			//foo().then(() => resolve( { txid:'', nodeUrl:'' } )).catch((err) => {
			//	let err_response = {}
			//	err_response.type = error
			//	switch (error) {
			//		case 'SEND_ERROR':
			//			err_response.description = 'There was an error when broadcasting this transaction to the network.'
			//			break;
			//		case 'MALFORMED_INPUT':
			//			err_response.description = 'The receiver address provided is not valid.'
			//			break;
			//		case 'INSUFFICIENT_FUNDS':
			//			err_response.description = 'The user has insufficient funds to execute this transaction.'
			//			break;
			//	}
			//	reject(err_response);
			//})
		).catch(() =>
			reject({
				type: 'CANCELED',
				description: 'There was an error when broadcasting this transaction to the network.',
				data: ''
			})
		)
	)
}

// Needs to be accepted every time
function invoke(invokeArgs) {
	return new Promise((resolve, reject) =>
		requestAcceptance(JSON.stringify(invokeArgs)).then(() =>
			alert('sent!')
			//	foo().then(() => resolve({ ... })).catch(() => {
			//		reject({
			//			type: 'RPC_ERROR',
			//			description: 'There was an error when broadcasting this transaction to the network.',
			//			data: ''
			//		});
			//	})
		).catch(() =>
			reject({
				type: 'CANCELED',
				description: 'There was an error when broadcasting this transaction to the network.',
				data: ''
			})
		)
	)
}

// Needs to be accepted every time
function invokeMulti(invokeMultiArgs) {
	return new Promise((resolve, reject) =>
		requestAcceptance(JSON.stringify(invokeMultiArgs)).then(() =>
			alert('sent!')
			//	foo().then(() => resolve({ ... })).catch(() => {
			//		reject({
			//			type: 'RPC_ERROR',
			//			description: 'There was an error when broadcasting this transaction to the network.',
			//			data: ''
			//		});
			//	})
		).catch(() =>
			reject({
				type: 'CANCELED',
				description: 'There was an error when broadcasting this transaction to the network.',
				data: ''
			})
		)
	)
}

// Needs to be accepted every time
function signMessage(signArgs) {
	return requestAcceptance(signArgs.message)
		.then(() => {
			return new Promise((resolve, reject) => {
				const salt = uuid().replace(/-/g, '');
				const parameterHexString = u.str2hexstring(salt + signArgs.message);
				const lengthHex = u.num2VarInt(parameterHexString.length / 2);
				const concatenatedString = lengthHex + parameterHexString;
				const messageHex = '010001f0' + concatenatedString + '0000';

				//reject({
				//	type: 'UNKNOWN_ERROR',
				//	description: 'There was an unknown error.',
				//	data: ''
				//})
				resolve({
					publicKey: acct.publicKey, // Public key of account that signed message
					message: signArgs.message, // Original message signed
					salt: salt, // Salt added to original message as prefix, before signing
					data: messageHex, // Signed message
				});

			})
		})
}

// Needs to be accepted every time
function deploy(deployArgs) {
	return requestAcceptance(JSON.stringify(deployArgs))
		.then(() => {
			return new Promise((resolve, reject) => {
				alert('sent!')

				//reject({
				//	type: 'UNKNOWN_ERROR',
				//	description: 'There was an unknown error.',
				//	data: ''
				//})
				resolve({
					txid: null,
					nodeUrl: null
				})
			})
		})
}

function closeWidget() {
	connection.promise.then((parent) => parent.closeWidget())
}

function displayWidget(wheight) {
	connection.promise.then((parent) => parent.displayWidget(wheight))
	console.log('displayed!!')
}

function showLoginButton() {
	ReactDOM.render(<LoginButton closeWidget={() => { closeWidget(); calledLogin = false; }} />, document.getElementById('content'), () =>
		displayWidget(document.getElementById('content').clientHeight)
	);
}

function successfulSignIn(account) {
	window.document.getElementById('content').innerHTML = '';
	closeWidget()
	//ReactDOM.render(<UserData account={account} closeWidget={closeWidget} />, document.getElementById('content'), () => {
	//	displayWidget(document.getElementById('content').clientHeight)
	//});
}

function requestAcceptance(message) {
	var requestContainer = document.createElement("div");
	requestContainer.id = 'request-' + totalRequests
	requestContainer.style.top = '0'
	requestContainer.style.position = 'fixed'
	requestContainer.style.width = '100%'
	requestContainer.style.background = 'white'
	var mainContainer = document.getElementById("root");
	mainContainer.appendChild(requestContainer);
	return new Promise((resolve, reject) => {
		if (!calledPermission || userGivesPermission) {
			calledPermission = true
			if (userGivesPermission)
				resolve()
			else
				ReactDOM.render(<RequestAcceptance message={message} resolve={() => { userGivesPermission = true; resolve() }} reject={reject} closeWidget={() => { calledPermission = false; closeWidget() }} closeRequest={closeRequest} contid={requestContainer.id} />, document.getElementById(requestContainer.id), () => {
					totalRequests++
					displayWidget(document.getElementById(requestContainer.id).clientHeight)
				});
		}
	});
}

function closeRequest() {
	totalRequests--
}
