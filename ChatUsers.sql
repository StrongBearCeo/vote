id:{
			type: "integer",
			primaryKey: true
		},
		username:{
			type: "string"
		},
		rating: {
			type: "integer"
		},
		favorites: {
			type: "integer"
		},
		time: {
			type: "integer", // seconds
			defaultsTo: 60
		},
		status: {
			type: "string",
			in: ["viewing", "queuing", "speaking"],
			defaultsTo: "viewing"
		},
CREATE TABLE ChatUsers(
	id INT,
	username nvarchar( 50 ) ,
	rating INT,
	favorites INT,
	TIME INT DEFAULT 60,
	STATUS ENUM(  'viewing',  'queuing',  'speaking' ) DEFAULT  'viewing'
)