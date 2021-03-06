const ArgumentDataType = {
	STRING: 'String',
	BOOLEAN: 'Boolean',
	HASH160: 'Hash160',
	HASH256: 'Hash256',
	INTEGER: 'Integer',
	BYTEARRAY: 'ByteArray',
	ARRAY: 'Array',
	ADDRESS: 'Address',
};

const EventName = {
	READY: 'READY',
	ACCOUNT_CHANGED: 'ACCOUNT_CHANGED',
	CONNECTED: 'CONNECTED',
	DISCONNECTED: 'DISCONNECTED',
	NETWORK_CHANGED: 'NETWORK_CHANGED',
	BLOCK_HEIGHT_CHANGED: 'BLOCK_HEIGHT_CHANGED',
	TRANSACTION_CONFIRMED: 'TRANSACTION_CONFIRMED',
};

export { ArgumentDataType, EventName };
