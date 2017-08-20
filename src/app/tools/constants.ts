import emailMask from 'text-mask-addons/dist/emailMask.js'

const cnst = {
	API_URL: "http://api.emkd.ru",
	SOCKET_API_URL: "http://api.emkd.ru:8081",


	URLS: {
		index: '/',
		login: '',
		search: 'search',

		timeline: 'timeline',
		profile: {
			index: 'profile',
			edit: 'profile/edit',
			confirm: 'profile/confirm',
			cnfrmLetter: 'profile/confirm/letter',
			cnfrmPayment: 'profile/confirm/payment',
			cnfrmEmail: 'email/confirm',
		},
		estate: {
			add: 'estate/add'
		},
		counters: {
			index: 'counters',
			history: 'counters/history',
		},
		payments: {
			index: 'payments',
		},

		chessmate: 'chessmate',
		forum: 'forum',
		servicedesk: 'servicedesk',
		video: 'video',
		archive: 'archive',
		voting: 'voting',
		news: 'news',
		finance: 'finance',
	},


	adaptive: {
		mobile: 760,
	},


	nbsp: ' ',

	PHONE_PLCHLDR: '+7 (___) ___-__-__',
	PHONE_MASK: ['+', '7', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],

	EMAIL_PLCHLDR: 'xxxxxx@xxxx.xx',
	EMAIL_MASK: emailMask,

	TABLE_CELL_PLCHLDR: '---',

	ERROR_MSGS: {
		token_notprovide: 'Token not provided.',
		token_invalid: 'Token invalid.',
		token_blacklisted: 'The token has been blacklisted',
	}
	
};

export default cnst;