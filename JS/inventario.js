/*SISTEMA DE INVENTÁRIO - Sistema de Fábrica de Vidro
   Gerencia o estoque de misturas, vidros e produtos finais*/

const SistemaInventario = {
    /*Estado atual do inventário*/
    estado: {
        // Misturas
        misturaGarrafa250: 0,
        misturaGarrafa500: 0,
        misturaGarrafa2_5: 0,
        misturaPrato: 0,
        misturaCopo: 0,
        misturaRefratario: 0,
        
        // Vidros Fundidos
        vidroGarrafa250: 0,
        vidroGarrafa500: 0,
        vidroGarrafa2_5: 0,
        vidroPrato: 0,
        vidroCopo: 0,
        vidroRefratario: 0,
        
        // Produtos Finais
        garrafa250: 0,
        garrafa500: 0,
        garrafa2_5: 0,
        prato: 0,
        copo: 0,
        refratario: 0,

        // Pallets
        pallet_garrafa250: 0,
        pallet_garrafa500: 0,
        pallet_garrafa2_5: 0,
        pallet_prato: 0,
        pallet_copo: 0,
        pallet_refratario: 0
    },

    /*Inicializa o sistema de inventário*/
    inicializar: function() {
        this.atualizarDisplay();
    },

    /*Adiciona item ao inventário*/
    adicionar: function(item, quantidade = 1) {
        if (this.estado[item] !== undefined) {
            this.estado[item] += quantidade;
            this.atualizarDisplay();
            return true;
        }
        return false;
    },

    /*Remove item do inventário*/
    remover: function(item, quantidade = 1) {
        if (this.estado[item] >= quantidade) {
            this.estado[item] -= quantidade;
            this.atualizarDisplay();
            return true;
        }
        return false;
    },

    /*Verifica se há quantidade suficiente de um item*/
    tem: function(item, quantidade = 1) {
        return this.estado[item] >= quantidade;
    },

    /*Obtém a quantidade de um item*/
    obterQuantidade: function(item) {
        return this.estado[item] || 0;
    },
    
    /*Atualiza todos os displays de quantidade na interface*/
    atualizarDisplay: function() {
        const displays = {
            // Misturas
            'misturaGarrafa250': 'quantidadeMisturaGarrafa250',
            'misturaGarrafa500': 'quantidadeMisturaGarrafa500',
            'misturaGarrafa2_5': 'quantidadeMisturaGarrafa2_5',
            'misturaPrato': 'quantidadeMisturaPrato',
            'misturaCopo': 'quantidadeMisturaCopo',
            'misturaRefratario': 'quantidadeMisturaRefratario',
            
            // Vidros
            'vidroGarrafa250': 'quantidadeVidroGarrafa250',
            'vidroGarrafa500': 'quantidadeVidroGarrafa500',
            'vidroGarrafa2_5': 'quantidadeVidroGarrafa2_5',
            'vidroPrato': 'quantidadeVidroPrato',
            'vidroCopo': 'quantidadeVidroCopo',
            'vidroRefratario': 'quantidadeVidroRefratario',
            
            // Produtos
            'garrafa250': 'quantidadeGarrafa250',
            'garrafa500': 'quantidadeGarrafa500',
            'garrafa2_5': 'quantidadeGarrafa2_5',
            'prato': 'quantidadePrato',
            'copo': 'quantidadeCopo',
            'refratario': 'quantidadeRefratario',
    
            // Pallets - GARANTIR QUE TODOS OS DISPLAYS ESTÃO MAPEADOS
            'pallet_garrafa250': 'quantidadePalletGarrafa250',
            'pallet_garrafa500': 'quantidadePalletGarrafa500',
            'pallet_garrafa2_5': 'quantidadePalletGarrafa2_5',
            'pallet_prato': 'quantidadePalletPrato',
            'pallet_copo': 'quantidadePalletCopo',
            'pallet_refratario': 'quantidadePalletRefratario'
        };

        for (const [item, id] of Object.entries(displays)) {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.textContent = this.obterQuantidade(item);
                // Forçar reflow para garantir que a atualização é visível
                elemento.style.display = 'inline-block';
            }
        }
        
        // Atualizar também os displays no tablet se estiver aberto
        this.atualizarDisplaysTablet();
    },

    /*Atualiza displays específicos do tablet*/
    atualizarDisplaysTablet: function() {
        // Atualizar displays nos pedidos do tablet
        const pedidoElements = document.querySelectorAll('.estoque-atual');
        pedidoElements.forEach(element => {
            const texto = element.textContent;
            const match = texto.match(/Estoque: (\d+)/);
            if (match) {
                // Encontrar qual pallet este elemento representa
                const palletNome = this.extrairNomePalletDoElemento(element);
                if (palletNome) {
                    const quantidade = this.obterQuantidade(palletNome);
                    element.textContent = `(Estoque: ${quantidade})`;
                }
            }
        });
    },

    /*Extrai o nome do pallet baseado no contexto do elemento*/
    extrairNomePalletDoElemento: function(element) {
        // Procura pelo nome do pallet nos elementos pais
        const palletElement = element.closest('.requisito-pallet');
        if (palletElement) {
            const nomeElement = palletElement.querySelector('.pallet-nome');
            if (nomeElement) {
                const nomeDisplay = nomeElement.textContent.toLowerCase();
                // Mapear nome de display para chave do inventário
                const mapeamento = {
                    'garrafa 250ml': 'pallet_garrafa250',
                    'garrafa 500ml': 'pallet_garrafa500',
                    'garrafa 2,5l': 'pallet_garrafa2_5',
                    'prato': 'pallet_prato',
                    'copo': 'pallet_copo',
                    'refratário': 'pallet_refratario'
                };
                return mapeamento[nomeDisplay];
            }
        }
        return null;
    },

    /*Reseta completamente o inventário*/
    resetar: function() {
        Object.keys(this.estado).forEach(key => {
            this.estado[key] = 0;
        });
        this.atualizarDisplay();
    },

    /*Verifica se possui algum item de uma lista*/
    temAlgumDos: function(itens) {
        return itens.some(item => this.tem(item));
    },

    /*Verifica se possui alguma mistura*/
    temAlgumaMistura: function() {
        const misturas = [
            'misturaGarrafa250', 'misturaGarrafa500', 'misturaGarrafa2_5',
            'misturaPrato', 'misturaCopo', 'misturaRefratario'
        ];
        return this.temAlgumDos(misturas);
    },

    /*Verifica se possui algum vidro*/
    temAlgumVidro: function() {
        const vidros = [
            'vidroGarrafa250', 'vidroGarrafa500', 'vidroGarrafa2_5',
            'vidroPrato', 'vidroCopo', 'vidroRefratario'
        ];
        return this.temAlgumDos(vidros);
    },

    /*Verifica se possui algum produto final*/
    temAlgumProdutoFinal: function() {
        const produtos = [
            'garrafa250', 'garrafa500', 'garrafa2_5',
            'prato', 'copo', 'refratario'
        ];
        return this.temAlgumDos(produtos);
    },

    /*Verifica se possui algum pallet*/
    temAlgumPallet: function() {
        const pallets = [
            'pallet_garrafa250', 'pallet_garrafa500', 'pallet_garrafa2_5',
            'pallet_prato', 'pallet_copo', 'pallet_refratario'
        ];
        return this.temAlgumDos(pallets);
    },

    temPallet: function(produto) {
        const palletKey = 'pallet_' + produto;
        return this.tem(palletKey);
    },

    adicionarPallet: function(produto, quantidade = 1) {
        const palletKey = 'pallet_' + produto;
        return this.adicionar(palletKey, quantidade);
    },

    removerPallet: function(produto, quantidade = 1) {
        const palletKey = 'pallet_' + produto;
        return this.remover(palletKey, quantidade);
    }
};

/*Cria métodos de conveniência para cada item do inventário*/
[
    // Misturas
    'MisturaGarrafa250', 'MisturaGarrafa500', 'MisturaGarrafa2_5', 
    'MisturaPrato', 'MisturaCopo', 'MisturaRefratario',
    
    // Vidros
    'VidroGarrafa250', 'VidroGarrafa500', 'VidroGarrafa2_5', 
    'VidroPrato', 'VidroCopo', 'VidroRefratario',
    
    // Produtos
    'Garrafa250', 'Garrafa500', 'Garrafa2_5', 
    'Prato', 'Copo', 'Refratario',
    
    // Pallets - ADICIONADOS AQUI
    'PalletGarrafa250', 'PalletGarrafa500', 'PalletGarrafa2_5',
    'PalletPrato', 'PalletCopo', 'PalletRefratario'
].forEach(item => {
    // Para pallets, precisamos mapear corretamente para as chaves do estado
    let key;
    if (item.startsWith('Pallet')) {
        // Converte "PalletGarrafa250" para "pallet_garrafa250"
        const produto = item.replace('Pallet', '');
        key = 'pallet_' + produto.charAt(0).toLowerCase() + produto.slice(1);
    } else {
        key = item.charAt(0).toLowerCase() + item.slice(1);
    }
    
    SistemaInventario[`adicionar${item}`] = (qtd = 1) => SistemaInventario.adicionar(key, qtd);
    SistemaInventario[`remover${item}`] = (qtd = 1) => SistemaInventario.remover(key, qtd);
    SistemaInventario[`tem${item}`] = () => SistemaInventario.tem(key);
    SistemaInventario[`obterQuantidade${item}`] = () => SistemaInventario.obterQuantidade(key);
});

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => SistemaInventario.inicializar());

// Torna global
window.SistemaInventario = SistemaInventario;
window.inventario = SistemaInventario;