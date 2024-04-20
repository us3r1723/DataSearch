function mergeDados(dados) {
    // Cria um mapa para armazenar os dados mesclados
    const mapa = new Map();

    // Itera sobre cada conjunto de dados na matriz
    dados.forEach((conjunto) => {
        // Verifica se já existe um conjunto similar no mapa usando o CPF_FAKE como chave de identificação
        let conjuntoExistente = mapa.get(conjunto.CPF_FAKE);
        
        if (!conjuntoExistente) {
            // Se não existir, adiciona o conjunto ao mapa
            mapa.set(conjunto.CPF_FAKE, conjunto);
        } else {
            // Se existir, mescla os campos
            Object.keys(conjunto).forEach((chave) => {
                // Evita mesclar o campo CPF_FAKE
                if (chave !== 'CPF_FAKE') {
                    // Mescla apenas se o campo já não existir
                    if (!conjuntoExistente.hasOwnProperty(chave)) {
                        conjuntoExistente[chave] = conjunto[chave];
                    }
                }
            });
        }
    });

    // Retorna os valores mesclados do mapa como uma matriz
    return Array.from(mapa.values());
}

module.exports = mergeDados;
