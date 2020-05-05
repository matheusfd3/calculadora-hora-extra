var tabelaDeHoras = $('#minha-tabela');
var arrayInformacoesDia = [];

function adicionarDia() {
	var inputHoras = $('.horas-mascara');
	if(validarCampos(inputHoras)) {
		var dia = $('#dia').val();
		var horasDeExpediente = inputHoras.filter('#horas-de-expediente').val();
		var horasDeAlmoco = inputHoras.filter('#horas-de-almoco').val();
		var horaDeEntrada = inputHoras.filter('#hora-de-entrada').val();
		var horaDeSaida = inputHoras.filter('#hora-de-saida').val();
		var horasTrabalhadas = transformarMinutosEmHoras((transformarHorasEmMinutos(horaDeSaida) - transformarHorasEmMinutos(horaDeEntrada)) - transformarHorasEmMinutos(horasDeAlmoco));
		var horaExtra = transformarMinutosEmHoras(transformarHorasEmMinutos(horasTrabalhadas) - transformarHorasEmMinutos(horasDeExpediente));
		arrayInformacoesDia.push({
					"dia": dia,
					"expediente": horasDeExpediente,
					"entrou": horaDeEntrada,
					"almoco": horasDeAlmoco,
					"saiu": horaDeSaida,
					"trabalhou": horasTrabalhadas,
					"horaExtra": horaExtra
		});
		adicionarLinhaTabela(tabelaDeHoras, arrayInformacoesDia);
		adicionarLinhaTotalExtra(tabelaDeHoras, arrayInformacoesDia);
		exibirTabela();
		habilitarBotaoSalvar();
	}
}

function removerDia(index) {
	arrayInformacoesDia.splice(index, 1);
	adicionarLinhaTabela(tabelaDeHoras, arrayInformacoesDia);
	adicionarLinhaTotalExtra(tabelaDeHoras, arrayInformacoesDia);
	if(arrayInformacoesDia.length == 0) {
		esconderTabela();
		desabilitarBotaoSalvar();
	}else {
		habilitarBotaoSalvar();
	}
}

function salvarArquivoJson() {
	desabilitarBotaoSalvar();
	var tabelaJson = JSON.stringify({"informacoesDia":arrayInformacoesDia});
	var blob = new Blob([tabelaJson], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "horaExtra.json");
}

function carregarArquivoJson() {
	var fileJson = $("#input-abrir-arquivo");
	var reader = new FileReader();
	reader.readAsText(fileJson[0].files[0]);
	reader.onload = function(e) {
		var getJson =  JSON.parse(e.target.result);
		arrayInformacoesDia = getJson.informacoesDia;
		adicionarLinhaTabela(tabelaDeHoras, arrayInformacoesDia);
		adicionarLinhaTotalExtra(tabelaDeHoras, arrayInformacoesDia);
		exibirTabela();
		fileJson.val("");
	};
}

function exibirTabela() {
	$(".meu-container-tabela").show();
}

function esconderTabela() {
	$(".meu-container-tabela").hide();
}

function habilitarBotaoSalvar() {
	var botaoSalvar = $("#botao-salvar-arquivo");
	botaoSalvar.removeAttr("disabled");
}

function desabilitarBotaoSalvar() {
	var botaoSalvar = $("#botao-salvar-arquivo");
	botaoSalvar.attr("disabled", true);
}

function transformarHorasEmMinutos(hora) {
	var array = hora.split(":");
	if(array[0].match(/-/)) {
		return parseInt("-" + ((parseInt(Math.abs(array[0])) * 60) + parseInt(Math.abs(array[1]))));
	}else {
		return(parseInt(array[0]) * 60) + parseInt(array[1]);
	}
}

function transformarMinutosEmHoras(minutos) {
	var hora =  Math.trunc(minutos/60);
	var minutos = minutos % 60;
	if((Math.sign(hora) == -1) || (Math.sign(minutos) == -1)) {
		hora = ("00" + Math.abs(hora)).slice(-2);
		minutos = ("00" + Math.abs(minutos)).slice(-2);
		return "-" + hora + ":" + minutos;
	}else {
		hora = ("00" + hora).slice(-2);
		minutos = ("00" + minutos).slice(-2);
		return hora + ":" + minutos;
	}
}

function adicionarLinhaTabela(tabela, arrayInformacoesDia) {
	var qtdInformacoesDia = arrayInformacoesDia.length;
	tabela.find('.tabela-informacoes-dia').remove();
	for(var i = 0; i < qtdInformacoesDia; i++) {
		var linha = '<tr class="tabela-informacoes-dia">' + 
						'<td><strong>' + arrayInformacoesDia[i].dia + '</strong></td>' +
						'<td>' + arrayInformacoesDia[i].expediente + '</td>' +
						'<td>' + arrayInformacoesDia[i].entrou + '</td>' +
						'<td>' + arrayInformacoesDia[i].almoco + '</td>' +
						'<td>' + arrayInformacoesDia[i].saiu + '</td>' +
						'<td>' + arrayInformacoesDia[i].trabalhou  + '</td>' +
						'<td>' + arrayInformacoesDia[i].horaExtra + '</td>' +
						'<td class="td-remove-dia" onclick="removerDia('+ i +')"><svg width="10px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="#000" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg></td>' +
					'</tr>';
		tabela.append(linha);
	}
}

function adicionarLinhaTotalExtra(tabela, arrayInformacoesDia) {
	tabela.find('#tabela-total-horas-extras').remove();
	var linha = '<tr id="tabela-total-horas-extras">' +
					'<td colspan="8"><b>Total de Extra:</b> ' + calcularTotalHorasExtras(arrayInformacoesDia) + '</td>' +
				'</tr>';
	tabela.append(linha);
}

function calcularTotalHorasExtras(arrayInformacoesDia) {
	var totalHorasExtras = 0;
	arrayInformacoesDia.forEach(function(item) {
		totalHorasExtras += transformarHorasEmMinutos(item.horaExtra);
	});
	return transformarMinutosEmHoras(totalHorasExtras);
}