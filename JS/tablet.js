/* SISTEMA DE TABLET - Sistema de Fábrica de Vidro
   Gerencia sustentabilidade, pedidos e pesquisas */

// ===============================
// AVISO VISUAL (SUBSTITUI ALERT)
// ===============================
function mostrarAviso(texto, tempo = 3000) {
    const container = document.getElementById("avisosContainer");
    if (!container) return;

    const aviso = document.createElement("div");
    aviso.className = "aviso-visual";
    aviso.textContent = texto;

    container.appendChild(aviso);

    // trigger fade-in
    setTimeout(() => {
        aviso.classList.add("mostrar");
    }, 20);

    // remover com fade-out
    setTimeout(() => {
        aviso.classList.add("sumir");
        setTimeout(() => aviso.remove(), 500);
    }, tempo);
};

const TabletSistema = {
    estado: {
        creditosPesquisa: 0,
        sustentabilidade: 0,
        pedidos: [
            {
                id: 1,
                cliente: "Sucos ABC",
                foto: "IMG/icone-cliente.png",
                titulo: "Pedido de Garrafas 500ml",
                descricao: "Fornecimento regular para envase",
                palletsNecessarios: { pallet_garrafa500: 3 },
                recompensa: 15,
                concluido: false,
                timestamp: Date.now()
            },
            {
                id: 2,
                cliente: "Restaurante Estrela", 
                foto: "IMG/icone-cliente.png",
                titulo: "Encomenda de Pratos",
                descricao: "Pratos para evento especial",
                palletsNecessarios: { pallet_prato: 4 },
                recompensa: 20,
                concluido: false,
                timestamp: Date.now()
            },
            {
                id: 3,
                cliente: "Laboratório Químico",
                foto: "IMG/icone-cliente.png",
                titulo: "Refratários Especiais",
                descricao: "Para equipamentos de alta temperatura",
                palletsNecessarios: { pallet_refratario: 2 },
                recompensa: 10,
                concluido: false,
                timestamp: Date.now()
            }
        ],
        pedidosConcluidos: [], // Para controlar os contadores
        pesquisas: [
            { 
                id: 1, 
                nome: "Otimização Energética", 
                nivel: 0, 
                maxNivel: 3, 
                custo: 10, 
                sustentabilidade: 3,
                descricao: "Reduz o consumo de energia nos processos de fabricação através de melhorias na eficiência dos equipamentos.",
                beneficios: "A otimização energética nas fábricas de vidro ajuda o planeta ao reduzir o consumo de energia, o que significa menos poluição no ar e menos recursos retirados da natureza. É como usar a energia de forma mais inteligente para proteger o meio ambiente.", 
            },
            { 
                id: 2, 
                nome: "Reciclagem de Materiais", 
                nivel: 0, 
                maxNivel: 3, 
                custo: 15, 
                sustentabilidade: 4,
                descricao: "Implementa sistemas avançados de reciclagem para reutilizar materiais e reduzir desperdícios.",
                beneficios: "A reciclagem de materiais em fábricas de vidro é um grande benefício para o meio ambiente. Ela transforma vidro usado em produtos novos, reduzindo a quantidade de lixo que vai para a natureza e poupando recursos como a areia, que precisaria ser retirada do meio ambiente para fazer vidro novo. Dessa forma, a reciclagem ajuda a fechar o ciclo de forma sustentável, protegendo o planeta.", 
            },
            { 
                id: 3, 
                nome: "Redução de Emissões de Gases Poluentes", 
                nivel: 0, 
                maxNivel: 3, 
                custo: 20, 
                sustentabilidade: 5,
                descricao: "Desenvolve tecnologias para reduzir emissões de carbono e outros poluentes atmosféricos.",
                beneficios: "As tecnologias de redução de emissões em fábricas de vidro beneficiam o meio ambiente ao filtrar e capturar os poluentes liberados durante a produção. Isso resulta em ar mais limpo, com menos fumaça e partículas nocivas, protegendo a saúde das pessoas e da natureza. Essas tecnologias são essenciais para minimizar o impacto ambiental da indústria."
            },
            { 
                id: 4, 
                nome: "Economia de Água", 
                nivel: 0, 
                maxNivel: 3, 
                custo: 12, 
                sustentabilidade: 3,
                descricao: "Otimiza o uso de água nos processos industriais através de sistemas de recirculação.",
                beneficios: "A economia de água em fábricas de vidro beneficia o meio ambiente ao reduzir significativamente o consumo desse recurso vital, especialmente nos processos de resfriamento e limpeza. Isso preserva os mananciais hídricos, diminui a energia gasta no tratamento e distribuição de água, e contribui para a sustentabilidade dos ecossistemas locais.",
            },
            { 
                id: 5, 
                nome: "Gestão de Resíduos", 
                nivel: 0, 
                maxNivel: 3, 
                custo: 18, 
                sustentabilidade: 4,
                descricao: "Implementa sistema integrado de gestão de resíduos para minimizar impacto ambiental.",
                beneficios: "A gestão de resíduos em fábricas de vidro beneficia o meio ambiente ao reduzir drasticamente o descarte de materiais na natureza. Através da reutilização de cacos de vidro no processo produtivo e da destinação adequada de resíduos, evita-se a contaminação do solo e da água, economiza-se matéria-prima e diminui a necessidade de extração de novos recursos naturais."
            },
            { 
                id: 6, 
                nome: "Energia Renovável", 
                nivel: 0, 
                maxNivel: 3, 
                custo: 25, 
                sustentabilidade: 6,
                descricao: "Instala sistemas de energia solar e eólica para alimentar a fábrica com fontes renováveis.",
                beneficios: "O uso de energia renovável em fábricas de vidro beneficia o meio ambiente ao substituir fontes poluentes como combustíveis fósseis por opções limpas como energia solar e eólica. Isso **elimina emissões de gases de efeito estufa** durante a produção, reduz a pegada de carbono da indústria e preserva os recursos naturais, contribuindo para um futuro mais sustentável.", 
            },
            { 
                id: 7, 
                nome: "Logística Sustentável", 
                nivel: 0, 
                maxNivel: 3, 
                custo: 15, 
                sustentabilidade: 3,
                descricao: "Otimiza rotas e utiliza veículos elétricos para reduzir o impacto do transporte.",
                beneficios: "A logística sustentável em fábricas de vidro beneficia o meio ambiente ao otimizar rotas de transporte, reduzindo o consumo de combustível e as emissões de poluentes. Além disso, promove o uso de materiais de embalagem recicláveis e eficientes, diminuindo o desperdício de recursos e o impacto ambiental em toda a cadeia de suprimentos."
            },
            { 
                id: 8, 
                nome: "Embalagens Ecológicas", 
                nivel: 0, 
                maxNivel: 3, 
                custo: 22, 
                sustentabilidade: 5,
                descricao: "Desenvolve embalagens biodegradáveis e sustentáveis para os produtos.",
                beneficios: "A adoção de embalagens ecológicas em fábricas de vidro beneficia o meio ambiente ao reduzir o uso de plásticos e materiais descartáveis. Utilizando materiais reciclados, biodegradáveis ou minimalistas, diminui-se a geração de resíduos, o consumo de recursos naturais e a poluição em aterros e oceanos, fechando o ciclo de forma mais sustentável."
            },
            { 
                id: 9, 
                nome: "Eficiência Operacional", 
                nivel: 0, 
                maxNivel: 3, 
                custo: 20, 
                sustentabilidade: 4,
                descricao: "Aprimora processos operacionais para reduzir desperdícios e aumentar produtividade.",
                beneficios: "A eficiência operacional em fábricas de vidro beneficia o meio ambiente ao reduzir o consumo de recursos naturais (matéria-prima, água e energia), diminuir as emissões de gases poluentes e minimizar a geração de resíduos. Em essência, produz mais com menos impacto, promovendo uma operação mais limpa e sustentável.",
            },
            { 
                id: 10, 
                nome: "Inovação Sustentável", 
                nivel: 0, 
                maxNivel: 3, 
                custo: 30, 
                sustentabilidade: 7,
                descricao: "Pesquisa de ponta em tecnologias sustentáveis para revolucionar a indústria vidreira.",
                beneficios: "A inovação sustentável em fábricas de vidro beneficia o meio ambiente ao **desenvolver processos e produtos que minimizam impactos ambientais**. Através de novas tecnologias e métodos, reduz-se o consumo de energia e recursos naturais, promove-se a economia circular e cria-se soluções que aliam produtividade à preservação do planeta para futuras gerações."
            }
        ],
        ultimaGeracaoPedidos: Date.now(),
        pesquisaSelecionada: null,
        scrollPosition: 0,
        contadorAtivo: false // Novo estado para controlar contadores ativos
    },

    inicializar: function() {
        this.configurarEventos();
        this.atualizarDisplay();
        this.iniciarVerificacaoPedidos();
        
        // GARANTIR que a modal esteja fechada na inicialização
        this.fecharTablet();
    },

    iniciarVerificacaoPedidos: function() {
        // Verificar a cada segundo para atualizar contadores
        setInterval(() => {
            this.atualizarContadoresPedidos();
        }, 1000);
    },

    configurarEventos: function() {
        // Reconfigurar eventos quando a modal é aberta
        document.addEventListener('click', (e) => {
            if (e.target.id === 'btnFecharTablet') {
                this.fecharTablet();
            }
        });
    },

    // CORREÇÃO: Método simplificado para gerar novos pedidos
    gerarNovoPedidoUnico: function() {
        const clientes = [
            { nome: "Supermercado Local", foto: "IMG/icone-cliente.png" },
            { nome: "Restaurante Familiar", foto: "IMG/icone-cliente.png" },
            { nome: "Hotel Luxo", foto: "IMG/icone-cliente.png" },
            { nome: "Escola Municipal", foto: "IMG/icone-cliente.png" },
            { nome: "Empresa Tech", foto: "IMG/icone-cliente.png" },
            { nome: "Hospital Regional", foto: "IMG/icone-cliente.png" }
        ];

        const tiposProdutos = [
            'pallet_garrafa250', 'pallet_garrafa500', 'pallet_garrafa2_5',
            'pallet_prato', 'pallet_copo', 'pallet_refratario'
        ];

        const descricoes = [
            "Pedido para reposição de estoque",
            "Encomenda para evento corporativo",
            "Fornecimento mensal regular",
            "Pedido urgente para entrega",
            "Kit completo para inauguração",
            "Encomenda especial personalizada"
        ];

        const cliente = clientes[Math.floor(Math.random() * clientes.length)];
        const numPallets = Math.floor(Math.random() * 3) + 1; // 1-3 pallets
        const palletsNecessarios = {};
        let totalPallets = 0;

        // Gerar combinação de pallets
        while (totalPallets < numPallets) {
            const produto = tiposProdutos[Math.floor(Math.random() * tiposProdutos.length)];
            const quantidadeProduto = Math.min(
                Math.floor(Math.random() * 4) + 1, // 1-4 pallets por produto
                numPallets - totalPallets // Não ultrapassar o limite
            );

            if (palletsNecessarios[produto]) {
                palletsNecessarios[produto] += quantidadeProduto;
            } else {
                palletsNecessarios[produto] = quantidadeProduto;
            }

            totalPallets += quantidadeProduto;
        }

        // Calcular recompensa baseada no número total de pallets
        const recompensa = this.calcularRecompensa(totalPallets);

        const novoPedido = {
            id: Date.now(),
            cliente: cliente.nome,
            foto: cliente.foto,
            titulo: `Pedido de ${this.getTituloPedido(palletsNecessarios)}`,
            descricao: descricoes[Math.floor(Math.random() * descricoes.length)],
            palletsNecessarios: palletsNecessarios,
            recompensa: recompensa,
            concluido: false,
            timestamp: Date.now()
        };

        return novoPedido;
    },

    calcularRecompensa: function(totalPallets) {
        // Base de 5 créditos por pallet, com bônus para pedidos maiores
        const base = totalPallets * 5;
        const bonus = Math.floor(totalPallets / 3) * 10; // Bônus a cada 3 pallets
        return base + bonus;
    },

    getTituloPedido: function(palletsNecessarios) {
        const produtos = Object.keys(palletsNecessarios);
        if (produtos.length === 1) {
            return this.getNomePallet(produtos[0]);
        } else if (produtos.length === 2) {
            return `${this.getNomePallet(produtos[0])} e ${this.getNomePallet(produtos[1])}`;
        } else {
            return "Mix de Produtos";
        }
    },

    abrirTablet: function() {
        const modal = document.getElementById('modalTablet');
        const conteudo = document.getElementById('conteudoTablet');
        
        if (modal && conteudo) {
            conteudo.innerHTML = this.criarTelaPrincipal();
            modal.style.display = 'flex';
            this.atualizarDisplay();
            
            // Reconfigurar eventos dos botões dinamicamente
            this.reconfigurarEventosDinamicos();
        }
    },

    reconfigurarEventosDinamicos: function() {
        // Reconfigurar eventos para elementos criados dinamicamente
        setTimeout(() => {
            const btnFechar = document.getElementById('btnFecharTablet');
            const btnPedidos = document.getElementById('btnPedidosTablet');
            const btnPesquisas = document.getElementById('btnPesquisasTablet');
            const btnVoltar = document.getElementById('btnVoltarTablet');
            const btnAjuda = document.getElementById('btnAjudaTablet');
            
            if (btnFechar) {
                btnFechar.onclick = () => this.fecharTablet();
            }
            if (btnPedidos) {
                btnPedidos.onclick = () => this.mostrarPedidos();
            }
            if (btnPesquisas) {
                btnPesquisas.onclick = () => this.mostrarPesquisas();
            }
            if (btnVoltar) {
                btnVoltar.onclick = () => this.voltarMenuPrincipal();
            }
            if (btnAjuda) {
                btnAjuda.onclick = () => this.mostrarTutorial();
            }
        }, 100);
    },

    fecharTablet: function() {
        const modal = document.getElementById('modalTablet');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    criarTelaPrincipal: function() {
        return `
            <div class="tablet-container">
                <div class="tablet-header">
                    <div class="header-left">
                        <button class="btn-ajuda-tablet" id="btnAjudaTablet" title="Ajuda"><strong>?</strong></button>
                    </div>
                    <h2>Sistema de Gestão da Fábrica</h2>
                    <span class="fechar-tablet" id="btnFecharTablet"><image class="btnDesligarTablet" src="IMG/icone-desligar.png" alt="Desligar Tablet"></span>
                </div>
                
                <div class="tablet-content">
                    <!-- LADO ESQUERDO: Gráfico de Sustentabilidade -->
                    <div class="sustentabilidade-container">
                        <div class="sustentabilidade-titulo">Nível de <br>Sustentabilidade</div>
                        <div class="grafico-sustentabilidade">
                            <div class="circulo-grafico">
                                <div class="borda-grafico" id="bordaGrafico"></div>
                                <div class="valor-grafico" id="valorSustentabilidade">${this.estado.sustentabilidade}%</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- LADO DIREITO: Menu e Créditos -->
                    <div class="menu-tablet">
                        <div class="botoes-menu">
                            <button class="btn-tablet btn-pedidos" id="btnPedidosTablet">
                                📋 Pedidos Ativos (${this.getPedidosAtivosCount()})
                            </button>
                            <button class="btn-tablet btn-pesquisas" id="btnPesquisasTablet">
                                🔬 Pesquisas
                            </button>
                        </div>
                        
                        <div class="creditos-container">
                            <div class="creditos-titulo">Créditos de Pesquisa</div>
                            <div class="creditos-valor" id="valorCreditos">${this.estado.creditosPesquisa}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    criarTelaTutorial: function() {
        return `
            <div class="tablet-container-tutorial">
                <div class="tablet-header">
                    <button class="btn-voltar-tablet" id="btnVoltarTablet">← Voltar</button>
                    <h2>Tutorial da Fábrica</h2>
                    <span class="fechar-tablet" id="btnFecharTablet"><image class="btnDesligarTablet" src="IMG/icone-desligar.png" alt="Desligar Tablet"></span>
                </div>
                
                <div class="tutorial-content-area">
                    <div class="fluxo-maquinas">
                        <div class="maquina-tutorial" onclick="TabletSistema.mostrarDetalhesMaquina('misturador')">
                            <div class="icone-maquina">
                                <img src="IMG/misturador.png" alt="Misturador" class="imagem-maquina-tutorial">
                            </div>
                            <div class="nome-maquina">Misturador</div>
                        </div>
                        
                        <div class="seta-tutorial">→</div>
                        
                        <div class="maquina-tutorial" onclick="TabletSistema.mostrarDetalhesMaquina('forno')">
                            <div class="icone-maquina">
                                <img src="IMG/forno.png" alt="Forno" class="imagem-maquina-tutorial">
                            </div>
                            <div class="nome-maquina">Forno</div>
                        </div>
                        
                        <div class="seta-tutorial">→</div>
                        
                        <div class="maquina-tutorial" onclick="TabletSistema.mostrarDetalhesMaquina('maquina-is')">
                            <div class="icone-maquina">
                                <img src="IMG/IS.png" alt="Máquina IS" class="imagem-maquina-tutorial">
                            </div>
                            <div class="nome-maquina">Máquina IS</div>
                        </div>
                        
                        <div class="seta-tutorial">→</div>
                        
                        <div class="maquina-tutorial" onclick="TabletSistema.mostrarDetalhesMaquina('scanner')">
                            <div class="icone-maquina">
                                <img src="IMG/scanner.png" alt="Scanner" class="imagem-maquina-tutorial">
                            </div>
                            <div class="nome-maquina">Scanner</div>
                        </div>
                    </div>
                    
                    <div class="instrucao-selecao">
                        <p>Clique na imagem de qualquer máquina para ver seu tutorial detalhado</p>
                    </div>
                </div>
            </div>
        `;
    },

    mostrarTutorial: function() {
        const conteudo = document.getElementById('conteudoTablet');
        if (conteudo) {
            conteudo.innerHTML = this.criarTelaTutorial();
            this.reconfigurarEventosDinamicos();
        }
    },

    criarTelaDetalhesMaquina: function(tipoMaquina) {
        const maquinas = {
            'misturador': {
                nome: 'Misturador',
                imagem: 'IMG/misturador.png',
                descricao: 'No Misturador, você prepara a mistura de vidro selecionando os materiais corretos e pesando as quantidades exatas. Use a balança para medir cada material conforme a receita selecionada.',
                passos: [
                    '1. Selecione uma receita de vidro',
                    '2. Adicione os materiais na balança utilizando o botão direito do mouse',
                    '3. Atinga o peso exato de cada material',
                    '4. Misture os componentes',
                    '5. Colete a mistura preparada'
                ]
            },
            'forno': {
                nome: 'Forno',
                imagem: 'IMG/forno.png',
                descricao: 'No Forno, você funde a mistura de vidro controlando cuidadosamente a temperatura. Mantenha a temperatura na zona ideal (1550-1600°C) por tempo suficiente para obter vidro de qualidade.',
                passos: [
                    '1. Coloque a mistura no forno',
                    '2. Controle a temperatura utilizando os botões de aquecimento e resfriamento',
                    '3. Mantenha na zona ideal por 30 segundos',
                    '4. Espere o processo de fusão completar',
                    '5. Colete o vidro fundido'
                ]
            },
            'maquina-is': {
                nome: 'Máquina IS',
                imagem: 'IMG/IS.png',
                descricao: 'Na Máquina IS (Injetora e Sopradora), você molda o vidro fundido em produtos específicos. Use o minigame de sopro para inflar o vidro no molde, mantendo a pressão na zona ideal.',
                passos: [
                    '1. Selecione o molde do produto desejado',
                    '2. Controle a temperatura utilizando os botões de aquecimento e resfriamento',
                    '3. Regule a pressão do sopro utilizando a barra de pressão',
                    '4. Mantenha a pressão na zona ideal',
                    '5. Finalize o produto moldado'
                ]
            },
            'scanner': {
                nome: 'Scanner',
                imagem: 'IMG/scanner.png',
                descricao: 'No Scanner, você classifica a qualidade dos produtos finais. Raspe a superfície para revelar defeitos e classifique cada produto conforme sua qualidade.',
                passos: [
                    '1. Coloque o produto no scanner',
                    '2. Escaneie a superfície para inspecionar',
                    '3. Identifique possíveis defeitos',
                    '4. Classifique a qualidade do produto de acordo com as características reveladas',
                    '5. Ao final, produza um pallet com os produtos classificados'
                ]
            }
        };

        const maquina = maquinas[tipoMaquina] || maquinas['misturador'];
        const passosHTML = maquina.passos.map(passo => `<li>${passo}</li>`).join('');

        return `
            <div class="tablet-container-detalhes-maquina">
                <div class="tablet-header">
                    <button class="btn-voltar-tablet" onclick="TabletSistema.mostrarTutorial()">← Voltar</button>
                    <h2>Tutorial: ${maquina.nome}</h2>
                    <span class="fechar-tablet" id="btnFecharTablet"><image class="btnDesligarTablet" src="IMG/icone-desligar.png" alt="Desligar Tablet"></span>
                </div>
                
                <div class="detalhes-maquina-content">
                    <div class="maquina-imagem-container">
                        <img src="${maquina.imagem}" alt="${maquina.nome}" class="imagem-maquina-detalhes">
                    </div>
                    
                    <div class="maquina-info-container">
                        <div class="maquina-descricao">
                            <h3>Como Funciona</h3>
                            <p>${maquina.descricao}</p>
                        </div>
                        
                        <div class="maquina-passos">
                            <h3>Passo a Passo</h3>
                            <ul>${passosHTML}</ul>
                        </div>
                        
                        <div class="dica-maquina">
                            <strong>Dica:</strong> Preste atenção nos indicadores visuais para melhor desempenho!
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    mostrarDetalhesMaquina: function(tipoMaquina) {
        const conteudo = document.getElementById('conteudoTablet');
        if (conteudo) {
            conteudo.innerHTML = this.criarTelaDetalhesMaquina(tipoMaquina);
            this.reconfigurarEventosDinamicos();
        }
    },

    getPedidosAtivosCount: function() {
        return this.estado.pedidos.filter(p => !p.concluido).length;
    },

    mostrarPedidos: function() {
        const conteudo = document.getElementById('conteudoTablet');
        if (conteudo) {
            // Salvar a posição atual do scroll antes de mudar o conteúdo
            this.salvarPosicaoScroll();
            
            conteudo.innerHTML = this.criarTelaPedidos();
            this.atualizarDisplay();
            this.reconfigurarEventosDinamicos();
            
            // Restaurar a posição do scroll após um pequeno delay
            setTimeout(() => {
                this.restaurarPosicaoScroll();
            }, 50);
        }
    },

    criarTelaPedidos: function() {
        const pedidosAtivos = this.estado.pedidos.filter(p => !p.concluido).slice(0, 3);
        const slotsDisponiveis = 3 - pedidosAtivos.length;
        
        let pedidosHTML = '';
        
        // Mostrar pedidos ativos
        pedidosAtivos.forEach(pedido => {
            pedidosHTML += `
                <div class="pedido-item">
                    <div class="pedido-cliente">
                        <div class="foto-cliente-container">
                            <img src="${pedido.foto}" alt="${pedido.cliente}" class="foto-cliente">
                        </div>
                        <div class="cliente-nome">${pedido.cliente}</div>
                    </div>
                    <div class="pedido-info">
                        <h4 class="pedido-titulo">${pedido.titulo}</h4>
                        <p class="pedido-descricao">${pedido.descricao}</p>
                        <div class="pedido-requisitos">
                            <div class="requisitos-titulo">Pallets necessários:</div>
                            ${Object.entries(pedido.palletsNecessarios).map(([pallet, quantidade]) => `
                                <div class="requisito-pallet-linha">
                                    ${this.getNomePallet(pallet)} — ${quantidade}x
                                </div>
                            `).join('')}
                        </div>
                        <div class="pedido-recompensa">
                            Recompensa: ${pedido.recompensa} créditos
                        </div>
                        <button class="btn-aceitar-pedido" onclick="TabletSistema.aceitarPedido(${pedido.id})"
                                ${this.podeAceitarPedido(pedido) ? '' : 'disabled'}>
                            ${this.podeAceitarPedido(pedido) ? '✅ Entregar Pedido' : '❌ Pallets Insuficientes'}
                        </button>
                    </div>
                </div>
            `;
        });

        // Mostrar contadores para slots vazios
        const contadoresParaMostrar = Math.min(slotsDisponiveis, this.estado.pedidosConcluidos.length);
        
        for (let i = 0; i < contadoresParaMostrar; i++) {
            const contador = this.estado.pedidosConcluidos[i];
            const minutos = Math.floor(contador.tempoRestante / 60);
            const segundos = contador.tempoRestante % 60;
            
            pedidosHTML += `
                <div class="pedido-item pedido-contador" data-contador-id="${contador.id}">
                    <div class="pedido-cliente">
                        <div class="foto-cliente-container">
                            <div class="contador-icon">⏰</div>
                        </div>
                        <div class="cliente-nome">Novo Pedido</div>
                    </div>
                    <div class="pedido-info">
                        <h4 class="pedido-titulo">Aguardando Novo Pedido</h4>
                        <p class="pedido-descricao">Um novo pedido estará disponível em:</p>
                        <div class="contador-tempo">
                            <div class="tempo-restante">${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}</div>
                            <div class="contador-label">minutos</div>
                        </div>
                        <div class="pedido-recompensa">
                            Próximo pedido em breve...
                        </div>
                        <button class="btn-aceitar-pedido" disabled>
                            ⏳ Aguardando
                        </button>
                    </div>
                </div>
            `;
        }

        // Mostrar slots completamente vazios
        const slotsVazios = slotsDisponiveis - contadoresParaMostrar;
        for (let i = 0; i < slotsVazios; i++) {
            pedidosHTML += `
                <div class="pedido-item pedido-vazio">
                    <div class="pedido-cliente">
                        <div class="foto-cliente-container">
                            <div class="vazio-icon">📭</div>
                        </div>
                        <div class="cliente-nome">Slot Vazio</div>
                    </div>
                    <div class="pedido-info">
                        <h4 class="pedido-titulo">Aguardando Pedido</h4>
                        <p class="pedido-descricao">Novos pedidos aparecerão automaticamente.</p>
                        <div class="pedido-recompensa">
                            Disponível para novos pedidos
                        </div>
                        <button class="btn-aceitar-pedido" disabled>
                            📋 Aguardando
                        </button>
                    </div>
                </div>
            `;
        }

        if (pedidosAtivos.length === 0 && slotsVazios === 3) {
            pedidosHTML = `
                <div class="sem-pedidos">
                    <h3>📭 Nenhum Pedido Disponível</h3>
                    <p>Novos pedidos aparecerão automaticamente a cada 5 minutos.</p>
                    <p>Continue produzindo para atender futuras demandas!</p>
                </div>
            `;
        }

        return `
            <div class="tablet-container-pedidos">
                <div class="tablet-header">
                    <button class="btn-voltar-tablet" id="btnVoltarTablet">← Voltar</button>
                    <h2>Pedidos Ativos</h2>
                    <span class="fechar-tablet" id="btnFecharTablet"><image class="btnDesligarTablet" src="IMG/icone-desligar.png" alt="Desligar Tablet"></span>
                </div>
                
                <div class="pedidos-content-area">
                    <div class="pedidos-container" id="pedidosScrollContainer">
                        ${pedidosHTML}
                    </div>
                    ${this.estado.pedidosConcluidos.length > 0 ? `
                        <div class="info-tempo-pedidos">
                            ⏰ ${this.estado.pedidosConcluidos.length} novo(s) pedido(s) em preparação
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    getTotalPallets: function(palletsNecessarios) {
        return Object.values(palletsNecessarios).reduce((total, qtd) => total + qtd, 0);
    },

    getNomePallet: function(tipoPallet) {
        const nomes = {
            'pallet_garrafa250': 'Garrafa 250ml',
            'pallet_garrafa500': 'Garrafa 500ml', 
            'pallet_garrafa2_5': 'Garrafa 2,5L',
            'pallet_prato': 'Prato',
            'pallet_copo': 'Copo',
            'pallet_refratario': 'Refratário'
        };
        return nomes[tipoPallet] || tipoPallet;
    },

    temPalletSuficiente: function(pallet, quantidadeNecessaria) {
        return SistemaInventario.obterQuantidade(pallet) >= quantidadeNecessaria;
    },

    podeAceitarPedido: function(pedido) {
        return Object.entries(pedido.palletsNecessarios).every(([pallet, quantidade]) => 
            this.temPalletSuficiente(pallet, quantidade)
        );
    },

    aceitarPedido: function(pedidoId) {
        const pedidoIndex = this.estado.pedidos.findIndex(p => p.id === pedidoId);
        if (pedidoIndex === -1) return;
        
        const pedido = this.estado.pedidos[pedidoIndex];
        if (pedido && !pedido.concluido && this.podeAceitarPedido(pedido)) {
            // Remover pallets do inventário
            Object.entries(pedido.palletsNecessarios).forEach(([pallet, quantidade]) => {
                SistemaInventario.remover(pallet, quantidade);
            });

            // Concluir pedido e dar recompensa
            pedido.concluido = true;
            this.estado.creditosPesquisa += pedido.recompensa;
            
            // Adicionar contador para novo pedido (3 minutos = 180 segundos)
            this.estado.pedidosConcluidos.push({
                id: Date.now(), // Usar ID único baseado no timestamp
                tempoRestante: 180, // 3 minutos em segundos
                timestamp: Date.now()
            });
            
            // Remover pedido concluído da lista imediatamente
            this.estado.pedidos.splice(pedidoIndex, 1);
            
            // Atualizar display imediatamente
            this.atualizarDisplay();
            
            // Recarregar a tela de pedidos se estiver aberta
            if (document.getElementById('conteudoTablet') && 
                document.getElementById('conteudoTablet').querySelector('.pedidos-container')) {
                this.mostrarPedidos();
            }
            
            const totalPallets = this.getTotalPallets(pedido.palletsNecessarios);
            mostrarAviso(`✅ Pedido entregue com sucesso! ${totalPallets} pallets entregues. +${pedido.recompensa} créditos de pesquisa.`);
        }
    },

    // CORREÇÃO: Método completamente reformulado para atualizar contadores
    atualizarContadoresPedidos: function() {
        const agora = Date.now();
        let contadoresExpirados = [];

        // Atualizar todos os contadores e identificar os que expiraram
        this.estado.pedidosConcluidos = this.estado.pedidosConcluidos.filter(contador => {
            const tempoPassado = Math.floor((agora - contador.timestamp) / 1000);
            const tempoRestante = Math.max(0, 180 - tempoPassado);
            
            // Atualizar o tempo restante
            contador.tempoRestante = tempoRestante;
            
            // Se o contador expirou, marcar para remoção
            if (tempoRestante <= 0) {
                contadoresExpirados.push(contador.id);
                return false; // Remove o contador da lista
            }
            
            return true;
        });

        // CORREÇÃO: Gerar APENAS UM pedido novo para cada contador expirado
        if (contadoresExpirados.length > 0) {
            console.log(`Contadores expirados: ${contadoresExpirados.length}`);
            
            // Gerar apenas um pedido novo
            const novoPedido = this.gerarNovoPedidoUnico();
            this.estado.pedidos.push(novoPedido);
            
            console.log(`Novo pedido gerado: ${novoPedido.titulo}`);
            
            // Atualizar a tela se estiver na tela de pedidos
            if (document.getElementById('conteudoTablet') && 
                document.getElementById('conteudoTablet').querySelector('.pedidos-container')) {
                this.mostrarPedidos();
            }
        }

        // Atualizar os contadores na tela (se houver mudanças visíveis)
        if (this.estado.pedidosConcluidos.length > 0 && 
            document.getElementById('conteudoTablet') && 
            document.getElementById('conteudoTablet').querySelector('.pedidos-container')) {
            this.atualizarContadoresNaTela();
        }
    },

    // CORREÇÃO: Método melhorado para atualizar contadores na tela
    atualizarContadoresNaTela: function() {
        const contadores = document.querySelectorAll('.pedido-contador');
        
        contadores.forEach(contadorElement => {
            const tempoElement = contadorElement.querySelector('.tempo-restante');
            const contadorId = parseInt(contadorElement.getAttribute('data-contador-id'));
            
            if (tempoElement && contadorId) {
                // Encontrar o contador correspondente no estado
                const contadorEstado = this.estado.pedidosConcluidos.find(c => c.id === contadorId);
                
                if (contadorEstado) {
                    const minutos = Math.floor(contadorEstado.tempoRestante / 60);
                    const segundos = contadorEstado.tempoRestante % 60;
                    const tempoFormatado = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
                    
                    // Só atualizar se o tempo mudou
                    if (tempoElement.textContent !== tempoFormatado) {
                        tempoElement.textContent = tempoFormatado;
                        
                        // Adicionar efeito visual quando estiver perto do fim
                        if (contadorEstado.tempoRestante <= 10) {
                            tempoElement.style.color = '#e74c3c';
                            tempoElement.style.animation = 'pulsar 1s infinite';
                        } else if (contadorEstado.tempoRestante <= 30) {
                            tempoElement.style.color = '#f39c12';
                        } else {
                            tempoElement.style.color = '#f1c40f';
                            tempoElement.style.animation = 'none';
                        }
                    }
                } else {
                    // Se o contador não existe mais no estado, remover da tela
                    contadorElement.remove();
                }
            }
        });
    },

    mostrarPesquisas: function() {
        const conteudo = document.getElementById('conteudoTablet');
        if (conteudo) {
            // Salvar a posição atual do scroll antes de mudar o conteúdo
            this.salvarPosicaoScroll();
            
            conteudo.innerHTML = this.criarTelaPesquisas();
            this.atualizarDisplay();
            this.reconfigurarEventosDinamicos();
            
            // Restaurar a posição do scroll após um pequeno delay
            setTimeout(() => {
                this.restaurarPosicaoScroll();
            }, 50);
        }
    },

    criarTelaPesquisas: function() {
        if (this.estado.pesquisaSelecionada) {
            return this.criarDetalhesPesquisa();
        }

        const pesquisasHTML = this.estado.pesquisas.map(pesquisa => `
            <div class="pesquisa-item ${pesquisa.nivel >= pesquisa.maxNivel ? 'maximizada' : ''}" 
                onclick="TabletSistema.selecionarPesquisa(${pesquisa.id})">
                <div class="pesquisa-info">
                    <h4 class="pesquisa-nome">${pesquisa.nome}</h4>
                    <div class="pesquisa-status">
                        <span class="pesquisa-nivel">Nível: ${pesquisa.nivel}/${pesquisa.maxNivel}</span>
                        <span class="pesquisa-custo">${pesquisa.custo} créditos</span>
                        <span class="pesquisa-sustentabilidade">+${pesquisa.sustentabilidade} sustentabilidade</span>
                    </div>
                    <div class="pesquisa-descricao-curta">${pesquisa.descricao.substring(0, 100)}...</div>
                </div>
                <div class="pesquisa-acoes">
                    ${pesquisa.nivel < pesquisa.maxNivel ? 
                        `<div class="pesquisa-disponivel">Disponível</div>` :
                        '<div class="pesquisa-maxima">⭐ Máximo</div>'
                    }
                </div>
            </div>
        `).join('');

        return `
            <div class="tablet-container-pesquisas">
                <div class="tablet-header">
                    <button class="btn-voltar-tablet" id="btnVoltarTablet">← Voltar</button>
                    <h2>Pesquisas Disponíveis</h2>
                    <span class="fechar-tablet" id="btnFecharTablet"><image class="btnDesligarTablet" src="IMG/icone-desligar.png" alt="Desligar Tablet"></span>
                </div>
                
                <div class="pesquisas-content-area">
                    <div class="pesquisas-container" id="pesquisasScrollContainer">
                        ${pesquisasHTML}
                    </div>
                </div>
            </div>
        `;
    },

    selecionarPesquisa: function(pesquisaId) {
        this.estado.pesquisaSelecionada = this.estado.pesquisas.find(p => p.id === pesquisaId);
        this.mostrarPesquisas();
    },

    criarDetalhesPesquisa: function() {
        const pesquisa = this.estado.pesquisaSelecionada;
        if (!pesquisa) return this.criarTelaPesquisas();

        return `
            <div class="tablet-container-detalhes">
                <div class="tablet-header">
                    <button class="btn-voltar-tablet" onclick="TabletSistema.voltarListaPesquisas()">← Voltar</button>
                    <h2>${pesquisa.nome}</h2>
                    <span class="fechar-tablet" id="btnFecharTablet"><image class="btnDesligarTablet" src="IMG/icone-desligar.png" alt="Desligar Tablet"></span>
                </div>
                
                <div class="detalhes-content-area">
                    <div class="detalhes-pesquisa-container">
                        <div class="pesquisa-header">
                            <div class="pesquisa-status-detalhes">
                                <span class="nivel-detalhes">Nível ${pesquisa.nivel}/${pesquisa.maxNivel}</span>
                                <span class="custo-detalhes">${pesquisa.custo} créditos</span>
                                <span class="sust-detalhes">+${pesquisa.sustentabilidade} sustentabilidade</span>
                            </div>
                        </div>
                        
                        <div class="pesquisa-descricao-completa">
                            <h4>Descrição</h4>
                            <p>${pesquisa.descricao}</p>
                        </div>
                        
                        <div class="pesquisa-beneficios">
                            <h4>Benefícios</h4>
                            <p>${pesquisa.beneficios}</p>
                        </div>
                        
                        <div class="pesquisa-investimento">
                            ${pesquisa.nivel < pesquisa.maxNivel ? 
                                `<button class="btn-investir-pesquisa" 
                                        onclick="TabletSistema.realizarPesquisa(${pesquisa.id})"
                                        ${this.estado.creditosPesquisa < pesquisa.custo ? 'disabled' : ''}>
                                    Investir ${pesquisa.custo} créditos
                                </button>` :
                                '<div class="pesquisa-maximizada">⭐ Pesquisa Maximizada</div>'
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    voltarListaPesquisas: function() {
        this.estado.pesquisaSelecionada = null;
        this.mostrarPesquisas();
    },

    realizarPesquisa: function(pesquisaId) {
        const pesquisa = this.estado.pesquisas.find(p => p.id === pesquisaId);
        
        if (!pesquisa || pesquisa.nivel >= pesquisa.maxNivel) return;
        
        if (this.estado.creditosPesquisa >= pesquisa.custo) {
            this.estado.creditosPesquisa -= pesquisa.custo;
            pesquisa.nivel++;
            this.estado.sustentabilidade += pesquisa.sustentabilidade;
            
            // Limitar sustentabilidade a 100%
            if (this.estado.sustentabilidade > 100) {
                this.estado.sustentabilidade = 100;
            }
            
            this.atualizarDisplay();
            this.verificarSustentabilidade();
            
            mostrarAviso(`🔬 Pesquisa "${pesquisa.nome}" realizada! Nível atual: ${pesquisa.nivel}`);
            
            // Voltar para a lista após realizar a pesquisa
            this.estado.pesquisaSelecionada = null;
            this.mostrarPesquisas();
        } else {
            mostrarAviso("❌ Créditos de pesquisa insuficientes!");
        }
    },

    voltarMenuPrincipal: function() {
        const conteudo = document.getElementById('conteudoTablet');
        if (conteudo) {
            // Resetar posição do scroll ao voltar ao menu principal
            this.estado.scrollPosition = 0;
            
            conteudo.innerHTML = this.criarTelaPrincipal();
            this.atualizarDisplay();
            this.reconfigurarEventosDinamicos();
        }
    },

    // MÉTODOS PARA CONTROLAR SCROLL
    salvarPosicaoScroll: function() {
        const pedidosContainer = document.querySelector('.pedidos-container');
        const pesquisasContainer = document.querySelector('.pesquisas-container');
        
        if (pedidosContainer) {
            this.estado.scrollPosition = pedidosContainer.scrollTop;
        } else if (pesquisasContainer) {
            this.estado.scrollPosition = pesquisasContainer.scrollTop;
        }
    },

    restaurarPosicaoScroll: function() {
        const pedidosContainer = document.querySelector('.pedidos-container');
        const pesquisasContainer = document.querySelector('.pesquisas-container');
        
        if (pedidosContainer && this.estado.scrollPosition > 0) {
            pedidosContainer.scrollTop = this.estado.scrollPosition;
        } else if (pesquisasContainer && this.estado.scrollPosition > 0) {
            pesquisasContainer.scrollTop = this.estado.scrollPosition;
        }
    },

    atualizarDisplay: function() {
        // Atualizar gráfico de sustentabilidade
        const bordaGrafico = document.getElementById('bordaGrafico');
        const valorSustentabilidade = document.getElementById('valorSustentabilidade');
        const valorCreditos = document.getElementById('valorCreditos');
        
        if (bordaGrafico) {
            const porcentagem = this.estado.sustentabilidade;
            bordaGrafico.style.background = `conic-gradient(
                #27ae60 0% ${porcentagem}%,
                #34495e ${porcentagem}% 100%
            )`;
        }
        
        if (valorSustentabilidade) {
            valorSustentabilidade.textContent = `${this.estado.sustentabilidade}%`;
        }
        
        if (valorCreditos) {
            valorCreditos.textContent = this.estado.creditosPesquisa;
        }
    },

    adicionarCreditos: function(quantidade) {
        this.estado.creditosPesquisa += quantidade;
        this.atualizarDisplay();
    },

    verificarSustentabilidade: function() {
        if (this.estado.sustentabilidade >= 90) {
            // Redirecionar para página de créditos após um breve delay
            setTimeout(() => {
                window.location.href = 'creditos.html';
            }, 10000);
            
            // Opcional: Mostrar mensagem de congratulação
            mostrarAviso('🎉 Parabéns! Você atingiu 90% de sustentabilidade em sua fábrica e recebeu reconhecimento internacional!', 10000);
        }
    },
};

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    TabletSistema.inicializar();
});

// Torna global
window.TabletSistema = TabletSistema;