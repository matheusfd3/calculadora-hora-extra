function validarCampos(inputHoras) {
	inputHoras.removeClass('borda-vermelha');
	var qtdInputHoras = inputHoras.length;
	var aprovado = true;

	for(var i = 0; i < qtdInputHoras; i++){
		if(!verificarFormatoHora($(inputHoras[i]).val())) {
			$(inputHoras[i]).addClass('borda-vermelha');
			aprovado = false;
		}
	}

	if(!aprovado) {
		exibirMensagem('w3-red', 'Atenção', 'As horas devem ser inseridas no <b>formato 24 horas</b> e seguir o padrão "<b>00:00</b>", ou seja, <b>1 hora</b> deve ser representada como "<b>01:00</b>"');
	}

	return aprovado;
}

function verificarFormatoHora(hora) {
	var regexHora = new RegExp(/^([0-9]|0[0-9]|1[0-9]|2[0-9]):[0-5][0-9]$/);
	if(regexHora.test(hora)) {
		return true
	}
	return false;
}

function exibirMensagem(classeBackground, titulo, mensagem) {
	var divMensagem = $("#mensagem");
	divMensagem.find('h3').remove();
	divMensagem.find('p').remove();
	divMensagem.removeClass('w3-red');
	divMensagem.removeClass('w3-green');
	divMensagem.addClass(classeBackground);
	divMensagem.append('<h3>'+ titulo +'</h3>');
	divMensagem.append('<p>'+ mensagem +'</p>');
	divMensagem.slideDown();
}