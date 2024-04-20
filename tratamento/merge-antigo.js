function removerRedundancias(dados) {
    // Cria um mapa para armazenar os dados únicos
    const mapa = new Map();

    // Itera sobre cada conjunto de dados na matriz
    dados.forEach((conjunto) => {
        // Verifica se já existe um conjunto similar no mapa
        let conjuntoExistente = mapa.get(conjunto.Nome_para_exibição);
        
        if (!conjuntoExistente) {
            // Se não existir, adiciona o conjunto ao mapa
            mapa.set(conjunto.Nome_para_exibição, conjunto);
        } else {
            // Se existir, mescla os campos
            Object.keys(conjunto).forEach((chave) => {
                if (!conjuntoExistente.hasOwnProperty(chave)) {
                    conjuntoExistente[chave] = conjunto[chave];
                }
            });
        }
    });

    // Retorna os valores únicos do mapa como uma matriz
    return Array.from(mapa.values());
}

module.exports = removerRedundancias;
