WinMain.on("load", function() {
	var datePicker = WinMain.doc.getByCssClass("js-widget-datepicker");
	datePicker.setCallback(function(date) {
		js.ua.System.alert(date);
	});
});