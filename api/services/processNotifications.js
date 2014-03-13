module.exports = function(notifications, sSection){
	var sOutput = "";
	if(notifications && notifications[sSection]){
		sOutput+= '<ul class="notifications">';
		Object.keys(notifications[sSection]).forEach(function(notification){ 
		  sOutput+= '<li>'+ JSON.stringify(notifications[sSection][notification]) + '</li>';
		});
		sOutput+= '</ul>';
	}
	return sOutput;
}