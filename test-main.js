const http = require('http');
const consultarDados = require('./conexoes/conexao.js');
const merge = require('./tratamento/merge.js');

// Porta que o servidor irá escutar
const PORT = 3000;

// Criando o servidor HTTP
const server = http.createServer(async (req, res) => {
  // Manipulando a requisição
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString(); // Concatenando os dados recebidos
  });
  req.on('end', async () => {
    console.log(`Recebido: ${body}`); // Imprimindo no console

    try {
      // Verificando se o corpo da requisição está vazio
      if (!body) {
        throw new Error('Nenhum dado recebido na requisição.');
      }

      // Parseando o body para obter tipo e valor
      const { tipo, valor } = JSON.parse(body);

      // Chamando a função consultarDados com os dois parâmetros
      let bruto = await consultarDados(tipo, valor);
      let resultado = merge(bruto);

      // Respondendo à requisição com os resultados tratados
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(resultado));
    } catch (error) {
      console.log("falha na busca ", error);
      res.statusCode = 500; // Definindo código de status HTTP 500 para indicar erro interno do servidor
      res.end('Erro ao processar a solicitação.'); // Respondendo à requisição com uma mensagem de erro
    }
  });
});

// Iniciando o servidor para escutar na porta definida
server.listen(PORT, () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});
