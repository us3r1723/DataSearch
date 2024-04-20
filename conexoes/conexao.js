const fs = require('fs');
const mariadb = require('mariadb');

async function consultarDados(tipoDado, valorConsulta) {
    let resultados = []; // Inicializa o array de resultados dentro da função
 
    try {
        // Lendo o arquivo JSON
        const jsonData = fs.readFileSync('conexoes/config/csvjson.json', 'utf8');
        const configDB = JSON.parse(jsonData);

        // Verificando se o tipo de dado existe no JSON
        if (!configDB || !Array.isArray(configDB)) {
            throw new Error('O arquivo JSON não contém um array válido.');
        }

        // Filtrando configurações que correspondem ao tipo fornecido
        const configFiltrado = configDB.filter(config => config.tipo === tipoDado);

        // Verificando se há configurações para o tipo fornecido
        if (configFiltrado.length === 0) {
            console.log(`Não há configurações disponíveis para o tipo '${tipoDado}'.`);
            return resultados;
        }

        // Iterando sobre as configurações filtradas
        for (const dbConfig of configFiltrado) {
            // Verificando se as configurações mínimas são fornecidas
            if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
                console.error("As configurações de conexão estão incompletas.");
                continue;
            }

            // Estabelecendo conexão com o banco de dados apenas se o tipo for correspondente
            if (dbConfig.tipo === tipoDado) {
                const connection = await mariadb.createConnection({
                    host: dbConfig.host,
                    user: dbConfig.user,
                    password: dbConfig.password,
                    database: dbConfig.database
                });

                // Verificando se há uma tabela e coluna específica a ser consultada
                if (dbConfig.table && dbConfig.columnToSearch) {
                    // Construindo a consulta SQL com base nas configurações do JSON
                    const query = `SELECT * FROM ${dbConfig.table} WHERE ${dbConfig.columnToSearch} = ?`;
                    // Executando a consulta com o valor especificado
                    const rows = await connection.query(query, [valorConsulta]);
                    resultados.push(...rows); // Adiciona todos os resultados ao array 'resultados'
                    // Exibindo os resultados
                    //console.log("Resultado da consulta:", rows);
                } else {
                    console.log("Nenhuma tabela ou coluna especificada para consulta.");
                }

                // Fechando a conexão com o banco de dados atual
                await connection.end();
            } else {
                console.log(`O tipo '${tipoDado}' não corresponde ao tipo configurado para esta conexão.`);
            }
        }
        console.table(resultados)
        return resultados;
    } catch (error) {
        console.error('Erro ao conectar no banco de dados:', error);
        throw error; // Lança o erro para o código cliente lidar com ele
    }
}

module.exports = consultarDados;
