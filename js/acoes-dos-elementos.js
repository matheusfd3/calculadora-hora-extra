$(document).ready(function(){
	$('#botao-abrir-arquivo').click(function() {
		$('#input-abrir-arquivo').trigger('click');
	});
	$('#input-abrir-arquivo').change(function() {
		carregarArquivoJson();
	});
	$('#botao-salvar-arquivo').click(function() {
		salvarArquivoJson();
	});
	$('#botao-adicionar-dia').click(function() {
		adicionarDia();
	});
	$('.horas-mascara').mask('00:00');
});