message = "" + //
// "Lorem ipsum dolor sit amet, nonumes docendi mel te, id illum corpora quo, sale facilis ius ex.\n" + //
// "Senserit argumentum sed no, usu te epicuri invidunt prodesset, tacimates patrioque eu eos.\n" + //
// "Sea nostrum reformidans ex. Vero nonumes officiis eam eu, munere legendos pri ei.\n" + //
// "Ea adhuc omittam convenire qui, cum ei nisl referrentur, cu vis quis exerci pertinacia.\n" + //
// "Mei prompta vulputate id. Qui congue ignota veritus no.\n" + //
// "Adhuc consequat moderatius his te, soluta euismod at usu.\n" + //
"Impetus docendi salutatus mei ex, pro ex honestatis.";

WinMain.on("load", function() {
	$E("button.alert.format").on("click", function() {
		js.ua.System.alert("String value: '%s', Numeric value=%d", "string", 1964);
	}, this);

	$E("button.alert.callback").on("click", function() {
		js.ua.System.alert(message, function() {
			alert('alert callback')
		}, this);
	}, this);

	$E("button.toast").on("click", function() {
		js.ua.System.toast(message);
	}, this);

	$E("button.prompt").on("click", function() {
		js.ua.System.prompt(message, function(message) {

		});
	}, this);

	$E("button.confirm").on("click", function() {
		js.ua.System.confirm(message, function(ok) {

		});
	}, this);
});