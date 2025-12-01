/* MÁQUINAS - Sistema de Fábrica de Vidro
    Define a classe base para todas as máquinas do sistema */

function Maquina(context, imagem, x, y, largura, altura, tipo, titulo) {
    this.context = context;
    this.imagem = imagem;
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.tipo = tipo;
    this.titulo = titulo;
    this.ligada = false;
    this.receitaSelecionada = null;
}

Maquina.prototype = {
    /* Desenha a máquina no canvas*/
    desenhar: function() {
        this.context.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
    },

    cliqueDentro: function(mouseX, mouseY) {
        return mouseX >= this.x && mouseX <= this.x + this.largura &&
               mouseY >= this.y && mouseY <= this.y + this.altura;
    },

    podeAcessar: function() {
        const verificacoes = {
            'forno': () => SistemaInventario.temAlgumaMistura(),
            'IS': () => SistemaInventario.temAlgumVidro(),
            'scanner': () => SistemaInventario.temAlgumProdutoFinal(),
            'misturador': () => true // Misturador sempre acessível
        };
        
        return verificacoes[this.tipo] ? verificacoes[this.tipo]() : true;
    },

    /*Verifica se tem recursos necessário*/
    temRecursosNecessarios: function() {
        return this.podeAcessar();
    },

    /*Obtém mensagem sobre recursos necessários*/
    getMensagemRecursosNecessarios: function() {
        const mensagens = {
            'forno': "❌ Você precisa produzir pelo menos uma mistura no Misturador antes de usar o Forno.",

            'IS': "❌ Você precisa produzir pelo menos um vidro fundido no Forno antes de usar a Máquina IS.",
            'scanner': "❌ Você precisa criar pelo menos um produto antes de usar o Scanner.",
            'misturador': "✅ Máquina disponível para uso."
        };
        return mensagens[this.tipo] || "Máquina disponível para uso.";
    },

    /*Obtém a mensagem inicial do status baseada no tipo de máquina*/
    getMensagemStatusInicial: function() {
        const mensagens = {
            'misturador': 'Selecione uma receita para começar',
            'forno': 'Selecione uma mistura para começar',
            'IS': 'Selecione um molde para começar',
            'scanner': 'Selecione um produto para escanear'
        };
        return mensagens[this.tipo] || 'Selecione um item para começar';
    },

    /*Obtém conteúdo HTML para a modal da máquina*/
    getConteudoModal: function() {
        const conteudosIniciais = {
            'misturador': `
                <div class="tela-misturador">
                    <!-- TELA INICIAL -->
                    <div class="tela-inicial" id="telaInicialMisturador">
                        <h2>Misturador de Matérias-Primas</h2>
                        <div class="maquina-inicial">
                            <img src="IMG/misturador.png" alt="Misturador" class="imagem-maquina-inicial">
                            <div class="status-maquina" id="statusInicialMisturador">Misturador</div>
                        </div>
                        <button class="btn-ligar-maquina" id="btnLigarMisturador">Ligar Misturador</button>
                        <div class="info-inicial">
                            <p>⚡ Esta máquina mistura areia, barrilha e calcário para criar misturas específicas.</p>
                            <p>📋 Selecione uma receita e prepare os materiais nas quantidades corretas.</p>
                            <p>⏱️ O processo leva aproximadamente 2 minutos.</p>
                        </div>
                    </div>
                    
                    <!-- CONTEÚDO DO PROCESSO -->
                    <div class="conteudo-processo" id="conteudoProcessoMisturador" style="display: none;">

                        <!-- FASE DE SELEÇÃO DE RECEITAS -->
                        <div class="fase-receitas" id="faseReceitas">
                            <h3 class="titulo-selecao">Selecione uma Receita</h3>
                            <div class="selecao-container">
                                <div class="grid-selecao">
                                    <div class="item-selecao" data-receita="garrafa250">
                                        <div class="item-icon">
                                            <img src="IMG/garrafa-250.png" alt="Garrafa 250ml">
                                        </div>
                                        <div class="item-nome">Garrafa 250ml</div>
                                        <div class="item-info">150g total</div>
                                    </div>
                                    
                                    <div class="item-selecao" data-receita="garrafa500">
                                        <div class="item-icon">
                                            <img src="IMG/garrafa-500.png" alt="Garrafa 500ml">
                                        </div>
                                        <div class="item-nome">Garrafa 500ml</div>
                                        <div class="item-info">350g total</div>
                                    </div>
                                    
                                    <div class="item-selecao" data-receita="garrafa2_5">
                                        <div class="item-icon">
                                            <img src="IMG/garrafa-2-5.png" alt="Garrafa 2,5L">
                                        </div>
                                        <div class="item-nome">Garrafa 2,5L</div>
                                        <div class="item-info">1Kg total</div>
                                    </div>
                                    
                                    <div class="item-selecao" data-receita="prato">
                                        <div class="item-icon">
                                            <img src="IMG/prato.png" alt="Prato">
                                        </div>
                                        <div class="item-nome">Prato</div>
                                        <div class="item-info">700g total</div>
                                    </div>
                                    
                                    <div class="item-selecao" data-receita="copo">
                                        <div class="item-icon">
                                            <img src="IMG/copo.png" alt="Copo">
                                        </div>
                                        <div class="item-nome">Copo</div>
                                        <div class="item-info">400g total</div>
                                    </div>
                                    
                                    <div class="item-selecao" data-receita="refratario">
                                        <div class="item-icon">
                                            <img src="IMG/refratario.png" alt="Refratário">
                                        </div>
                                        <div class="item-nome">Refratário</div>
                                        <div class="item-info">1,5Kg total</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="controles-preparacao">
                                <div class="info-selecao">
                                    <div class="info-receita-selecionada" id="infoReceitaSelecionadaMisturador" style="display: none;"></div>
                                    <div class="status-selecao aguardando" id="statusMisturador">${this.getMensagemStatusInicial()}</div>
                                </div>
                                <button class="btn-iniciar-preparacao" id="btnIniciarPreparacaoMisturador" disabled>
                                    Iniciar Preparação da Receita Selecionada
                                </button>
                            </div>
                        </div>
                        
                        <!-- FASE DE SELEÇÃO DE MATERIAIS -->
                        <div class="fase-selecao" id="faseSelecao" style="display: none;">
                            <div class="info-receita-selecionada" id="infoReceitaSelecionada"></div>
                            <button class="btn-voltar-receitas" id="btnVoltarReceitas">← Voltar para Receitas</button>
                            
                            <div class="materiais-container">
                                <div class="materiais-primas">
                                    <div class="material" data-material="areia">
                                        <img src="IMG/areia.png" alt="Areia Sílica">
                                        <div class="material-nome">Areia Sílica</div>
                                        <div class="material-peso">Necessário: <span class="peso-valor" id="qtdeAreiaNecessaria">0</span>g</div>
                                    </div>
                                    
                                    <div class="material" data-material="barrilha">
                                        <img src="IMG/barrilha.png" alt="Barrilha">
                                        <div class="material-nome">Barrilha</div>
                                        <div class="material-peso">Necessário: <span class="peso-valor" id="qtdeBarrilhaNecessaria">0</span>g</div>
                                    </div>
                                    
                                    <div class="material" data-material="calcario">
                                        <img src="IMG/calcario.png" alt="Calcário">
                                        <div class="material-nome">Calcário</div>
                                        <div class="material-peso">Necessário: <span class="peso-valor" id="qtdeCalcarioNecessaria">0</span>g</div>
                                    </div>
                                </div>
                                
                                <div class="area-pesagem-centralizada">
                                    <div class="balanca-container-centralizado">
                                        <div class="balanca-centralizada" id="balanca">
                                            <img src="IMG/balanca.png" alt="Balança" class="imagem-balanca">
                                            <!-- VISOR DA BALANÇA - POSICIONADO EM CIMA DA IMAGEM -->
                                            <div class="visor-balança">
                                                <div class="display-peso" id="displayPeso">0g</div>
                                            </div>
                                            <div class="status-peso" id="statusPeso">Selecione material</div>
                                        </div>
                                        <div class="botoes-pesagem-centralizados">
                                            <button class="btn-despejar" id="btnDespejar" disabled>Despejar</button>
                                            <button class="btn-descartar" id="btnDescartar" disabled>Descartar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- FASE DE MISTURA -->
                        <div class="fase-mistura" id="faseMistura" style="display: none;">
                            <div class="misturador-container">
                                <div class="misturador-centralizado">
                                    <img src="IMG/misturador.png" alt="Misturador" id="imgMisturador" class="imagem-misturador">
                                </div>
                                <button class="btn-misturar-coletar" id="btnMisturarColetar">Iniciar Mistura</button>
                            </div>
                            <div class="contador" id="contador"></div>
                        </div>
                        
                    </div>
                </div>
            `,

            'forno': `
                <div class="tela-forno">
                    <!-- TELA INICIAL -->
                    <div class="tela-inicial" id="telaInicialForno">
                        <h2>Forno de Fusão</h2>
                        <div class="maquina-inicial">
                            <img src="IMG/forno.png" alt="Forno" class="imagem-maquina-inicial">
                            <div class="status-maquina" id="statusInicialForno">
                                ${this.podeAcessar() ? 'Forno Disponível' : 'Forno Indisponível'}
                            </div>
                        </div>
                        ${this.temRecursosNecessarios() ? 
                            '<button class="btn-ligar-maquina" id="btnLigarForno">Ligar Forno</button>' :
                            '<div class="aviso-sem-recursos">' + this.getMensagemRecursosNecessarios() + '</div>'
                        }
                        <div class="info-inicial">
                            ${this.temRecursosNecessarios() ? 
                                '<p>✅ Você tem misturas disponíveis no inventário!</p>' :
                                '<p>ℹ️ Use o Misturador para criar misturas antes de usar esta máquina.</p>'
                            }
                            <p>🔥 Transforme misturas em vidro fundido através de altas temperaturas.</p>
                            <p>🎯 Mantenha a temperatura entre 1550°C and 1600°C para gerar vidro fundido.</p>
                        </div>
                    </div>
                    
                    <!-- CONTEÚDO DO PROCESSO -->
                    <div class="conteudo-processo" id="conteudoProcessoForno" style="display: none;">
                    
                        <!-- FASE DE SELEÇÃO DE MISTURA -->
                        <div class="fase-selecao-mistura" id="faseSelecaoMistura">
                            <h3 class="titulo-selecao">Selecione uma Mistura para Fundir</h3>
                            <div class="selecao-container">
                                <div class="grid-selecao">
                                    <div class="item-selecao" data-mistura="misturaGarrafa250">
                                        <div class="item-icon">
                                            <img src="IMG/garrafa-250.png" alt="Garrafa 250ml">
                                        </div>
                                        <div class="item-nome">Garrafa 250ml</div>
                                        <div class="item-info">Disponível: <span id="quantidadeMisturaGarrafa250">0</span></div>
                                    </div>
                                    
                                    <div class="item-selecao" data-mistura="misturaGarrafa500">
                                        <div class="item-icon">
                                            <img src="IMG/garrafa-500.png" alt="Garrafa 500ml">
                                        </div>
                                        <div class="item-nome">Garrafa 500ml</div>
                                        <div class="item-info">Disponível: <span id="quantidadeMisturaGarrafa500">0</span></div>
                                    </div>
                                    
                                    <div class="item-selecao" data-mistura="misturaGarrafa2_5">
                                        <div class="item-icon">
                                            <img src="IMG/garrafa-2-5.png" alt="Garrafa 2,5L">
                                        </div>
                                        <div class="item-nome">Garrafa 2,5L</div>
                                        <div class="item-info">Disponível: <span id="quantidadeMisturaGarrafa2_5">0</span></div>
                                    </div>
                                    
                                    <div class="item-selecao" data-mistura="misturaPrato">
                                        <div class="item-icon">
                                            <img src="IMG/prato.png" alt="Prato">
                                        </div>
                                        <div class="item-nome">Prato</div>
                                        <div class="item-info">Disponível: <span id="quantidadeMisturaPrato">0</span></div>
                                    </div>
                                    
                                    <div class="item-selecao" data-mistura="misturaCopo">
                                        <div class="item-icon">
                                            <img src="IMG/copo.png" alt="Copo">
                                        </div>
                                        <div class="item-nome">Copo</div>
                                        <div class="item-info">Disponível: <span id="quantidadeMisturaCopo">0</span></div>
                                    </div>
                                    
                                    <div class="item-selecao" data-mistura="misturaRefratario">
                                        <div class="item-icon">
                                            <img src="IMG/refratario.png" alt="Refratário">
                                        </div>
                                        <div class="item-nome">Refratário</div>
                                        <div class="item-info">Disponível: <span id="quantidadeMisturaRefratario">0</span></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="controles-forno">
                                <div class="info-selecao">
                                    <div class="info-receita-selecionada" id="infoReceitaSelecionadaForno" style="display: none;"></div>
                                    <div class="status-selecao aguardando" id="statusForno">${this.getMensagemStatusInicial()}</div>
                                    <button class="btn-colocar-mistura" id="btnColocarMisturaForno" disabled>Colocar Mistura Selecionada</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- FASE DE CONTROLE DE TEMPERATURA -->
                        <div class="fase-controle-temperatura" id="faseControleTemperatura" style="display: none;">
                            ${EstruturasComuns.criarControleTemperatura('', 1500, 1600, 2100, 30)}
                        </div>
                        
                        <!-- FASE DE COLETA -->
                        <div class="fase-coleta" id="faseColeta" style="display: none;">
                            <div class="coleta-container">
                                <div class="forno-area">
                                    <img src="IMG/forno.png" alt="Forno" class="forno-img">
                                    <div class="status-forno" id="statusFornoFinal">Vidro Fundido Pronto!</div>
                                </div>
                                <button class="btn-coletar-vidro" id="btnColetarVidro">Coletar Vidro Fundido</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,

            'IS': `
                <div class="tela-is">
                    <!-- TELA INICIAL -->
                    <div class="tela-inicial" id="telaInicialIS">
                        <h2>Máquina IS - Moldagem de Garrafas</h2>
                        <div class="maquina-inicial">
                            <img src="IMG/IS.png" alt="Máquina IS" class="imagem-maquina-inicial">
                            <div class="status-maquina" id="statusInicialIS">
                                ${this.podeAcessar() ? 'Máquina Disponível' : 'Máquina Indisponível'}
                            </div>
                        </div>
                        ${this.temRecursosNecessarios() ? 
                            '<button class="btn-ligar-maquina" id="btnLigarIS">Ligar Máquina IS</button>' :
                            '<div class="aviso-sem-recursos">' + this.getMensagemRecursosNecessarios() + '</div>'
                        }
                        <div class="info-inicial">
                            ${this.temRecursosNecessarios() ? 
                                '<p>✅ Você tem vidro fundido disponível no inventário!</p>' :
                                '<p>ℹ️ Use o Forno para criar vidro fundido antes de usar esta máquina.</p>'
                            }
                            <p>🍶 Transforme vidro fundido em produtos através de sopro e moldagem.</p>
                            <p>🌡️ Mantenha a pressão e a temperatura adequadas.</p>
                        </div>
                    </div>
                    
                    <!-- CONTEÚDO DO PROCESSO -->
                    <div class="conteudo-processo" id="conteudoProcessoIS" style="display: none;">
                        <!-- FASE DE SELEÇÃO DE MOLDES -->
                        <div class="fase-selecao-molde" id="faseSelecaoMolde">
                            <h3 class="titulo-selecao">Selecione um Molde para Produzir</h3>
                            <div class="selecao-container">
                                <div class="grid-selecao">
                                    <div class="item-selecao" data-vidro="vidroGarrafa250">
                                        <div class="item-icon">
                                            <img src="IMG/molde-garrafa.png" alt="Garrafa 250ml">
                                        </div>
                                        <div class="item-nome">Garrafa 250ml</div>
                                        <div class="item-info">Disponível: <span id="quantidadeVidroGarrafa250">0</span></div>
                                    </div>
                                    
                                    <div class="item-selecao" data-vidro="vidroGarrafa500">
                                        <div class="item-icon">
                                            <img src="IMG/molde-garrafa.png" alt="Garrafa 500ml">
                                        </div>
                                        <div class="item-nome">Garrafa 500ml</div>
                                        <div class="item-info">Disponível: <span id="quantidadeVidroGarrafa500">0</span></div>
                                    </div>
                                    
                                    <div class="item-selecao" data-vidro="vidroGarrafa2_5">
                                        <div class="item-icon">
                                            <img src="IMG/molde-garrafa.png" alt="Garrafa 2,5L">
                                        </div>
                                        <div class="item-nome">Garrafa 2,5L</div>
                                        <div class="item-info">Disponível: <span id="quantidadeVidroGarrafa2_5">0</span></div>
                                    </div>
                                    
                                    <div class="item-selecao" data-vidro="vidroPrato">
                                        <div class="item-icon">
                                            <img src="IMG/molde-prato.png" alt="Prato">
                                        </div>
                                        <div class="item-nome">Prato</div>
                                        <div class="item-info">Disponível: <span id="quantidadeVidroPrato">0</span></div>
                                    </div>
                                    
                                    <div class="item-selecao" data-vidro="vidroCopo">
                                        <div class="item-icon">
                                            <img src="IMG/molde-copo.png" alt="Copo">
                                        </div>
                                        <div class="item-nome">Copo</div>
                                        <div class="item-info">Disponível: <span id="quantidadeVidroCopo">0</span></div>
                                    </div>
                                    
                                    <div class="item-selecao" data-vidro="vidroRefratario">
                                        <div class="item-icon">
                                            <img src="IMG/molde-refratario.png" alt="Refratário">
                                        </div>
                                        <div class="item-nome">Refratário</div>
                                        <div class="item-info">Disponível: <span id="quantidadeVidroRefratario">0</span></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="controles-preparacao">
                                <div class="info-selecao">
                                    <div class="info-receita-selecionada" id="infoReceitaSelecionadaIS" style="display: none;"></div>
                                    <div class="status-selecao aguardando" id="statusMolde">${this.getMensagemStatusInicial()}</div>
                                </div>
                                <button class="btn-iniciar-moldagem" id="btnIniciarMoldagemIS" disabled>
                                    Iniciar Moldagem do Molde Selecionado
                                </button>
                                <button class="btn-voltar-selecao" id="btnVoltarSelecao" style="display: none;">← Voltar para Seleção</button>
                            </div>
                        </div>
                        
                        <!-- FASE DE SOPRO (BARRA COM SETA ABAIXO - CORRIGIDA) -->
                        <div class="fase-sopro" id="faseSoproIS" style="display: none;">
                            <div class="sopro-container">
                                <h3>Controle de Sopro</h3>
                                <div class="instrucoes">Clique no botão quando a seta estiver na zona verde!</div>
                                
                                <div class="minigame-sopro">
                                    <!-- BARRA PRINCIPAL -->
                                    <div class="barra-sopro">
                                        <div class="zona-alvo-sopro" id="zonaAlvoSopro"></div>
                                    </div>
                                    
                                    <!-- CONTAINER DA SETA (TRIÂNGULO) ABAIXO DA BARRA -->
                                    <div class="seta-container">
                                        <div class="seta-sopro" id="setaSopro"></div>
                                    </div>
                                    
                                    <div class="contador-cliques">
                                        Acertos: <span id="acertosAtuais">0</span>/4
                                    </div>
                                    <button class="btn-clique-sopro" id="btnCliqueSopro">Injetar Ar</button>
                                </div>
                                
                                <div class="info-sopro">
                                    <div class="tentativas-restantes">
                                        Tentativas restantes: <span id="tentativasRestantes">3</span>
                                    </div>
                                    <div class="dica-sopro">
                                        💡 Dica: O triângulo fica mais rápido a cada acerto e a zona verde muda de lugar!
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- FASE DE TEMPERATURA IS CORRIGIDA -->
                        <div class="fase-temperatura-is" id="faseTemperaturaIS" style="display: none;">
                            <div class="controle-container">
                                <div class="termometro-container">
                                    <div class="termometro-titulo">Controle de Temperatura - Máquina IS</div>
                                    <div class="termometro-completo">
                                        <div class="termometro-visual">
                                            <!-- IMAGEM DO TERMÔMETRO POR CIMA DA BARRA -->
                                            <img src="IMG/fundo-termometro.png" alt="Termômetro" class="imagem-termometro-fundo" id="fundoTermometroIS">
                                            <div class="termometro-barra">
                                                <div class="zona-ideal" style="height: ${(650 - 600) / 800 * 100}%; bottom: ${600 / 800 * 100}%;"></div>
                                                <div class="barra-temperatura" id="barraTemperaturaIS" style="height: 0%;"></div>
                                            </div>
                                        </div>
                                        <div class="termometro-info">
                                            <div class="temperatura-display">
                                                <span class="temperatura-valor" id="temperaturaAtualIS">100°C</span>
                                                <div class="status-temperatura" id="statusTemperaturaIS">Temperatura baixa</div>
                                            </div>
                                            <div class="zona-info">
                                                Zona ideal: 600°C - 650°C
                                            </div>
                                            <div class="tempo-estavel-container">
                                                <div class="tempo-estavel" id="tempoEstavelIS">Tempo estável acumulado: 0s</div>
                                                <div class="progresso-estabilidade">
                                                    <div class="barra-progresso">
                                                        <div class="preenchimento-progresso" id="preenchimentoProgressoIS" style="width: 0%;"></div>
                                                    </div>
                                                    <div class="meta-estabilidade">Meta: 10s</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="controles-temperatura">
                                    <button class="btn-esquentar" id="btnEsquentarIS" disabled>🔥 Esquentar</button>
                                    <button class="btn-resfriar" id="btnResfriarIS" disabled>❄️ Resfriar</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- FASE DE RESULTADO -->
                        <div class="fase-resultado" id="faseResultadoIS" style="display: none;">
                            <div class="resultado-container">
                                <h3>Produção Concluída!</h3>
                                
                                <div class="produto-resultado">
                                    <img src="" alt="Produto Final" class="imagem-produto-final" id="imagemProdutoFinalIS">
                                </div>
                                
                                <div class="resultado-sucesso" id="resultadoSucessoIS">
                                    Produto produzido com sucesso!
                                </div>
                                
                                <div class="botoes-resultado">
                                    <button class="btn-fechar-resultado" id="btnFecharResultadoIS">
                                        Finalizar Produção
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,

            'scanner': `
                <div class="tela-scanner">
                    <!-- TELA INICIAL -->
                    <div class="tela-inicial" id="telaInicialScanner">
                        <h2>Scanner de Qualidade</h2>
                        <div class="maquina-inicial">
                            <img src="IMG/scanner.png" alt="Scanner" class="imagem-maquina-inicial">
                            <div class="status-maquina" id="statusInicialScanner">
                                ${this.podeAcessar() ? 'Scanner Disponível' : 'Scanner Indisponível'}
                            </div>
                        </div>
                        ${this.temRecursosNecessarios() ? 
                            '<button class="btn-ligar-maquina" id="btnLigarScanner">Ligar Scanner</button>' :
                            '<div class="aviso-sem-recursos">' + this.getMensagemRecursosNecessarios() + '</div>'
                        }
                        <div class="info-inicial">
                            ${this.temRecursosNecessarios() ? 
                                '<p>✅ Você tem produtos disponíveis no inventário!</p>' :
                                '<p>ℹ️ Crie produtos utilizando as outras máquinas antes de usar o Scanner.</p>'
                            }
                            <p>🔍 Analise a qualidade dos produtos através do escaneamento a laser.</p>
                            <p>📊 Classifique produtos em: Premium, Padrão ou Defeituoso.</p>
                            <p>🎯 Revele características ocultas através do escaneamento.</p>
                        </div>
                    </div>
                    
                    <!-- CONTEÚDO DO PROCESSO -->
                    <div class="conteudo-processo" id="conteudoProcessoScanner" style="display: none;">
                        <!-- FASE DE SELEÇÃO DE PRODUTOS -->
                        <div class="fase-selecao-produtos" id="faseSelecaoProdutos">
                            <h3 class="titulo-selecao">Selecione um Produto para Escanear</h3>
                            <div class="selecao-container">
                                <div class="grid-selecao">
                                    <div class="item-selecao" data-produto="garrafa250">
                                        <div class="item-icon">
                                            <img src="IMG/garrafa-250.png" alt="Garrafa 250ml">
                                        </div>
                                        <div class="item-nome">Garrafa 250ml</div>
                                        <div class="item-info">Disponível: <span id="quantidadeGarrafa250">0</span></div>
                                    </div>
                                    
                                    <div class="item-selecao" data-produto="garrafa500">
                                        <div class="item-icon">
                                            <img src="IMG/garrafa-500.png" alt="Garrafa 500ml">
                                        </div>
                                        <div class="item-nome">Garrafa 500ml</div>
                                        <div class="item-info">Disponível: <span id="quantidadeGarrafa500">0</span></div>
                                    </div>
                                    
                                    <div class="item-selecao" data-produto="garrafa2_5">
                                        <div class="item-icon">
                                            <img src="IMG/garrafa-2-5.png" alt="Garrafa 2,5L">
                                        </div>
                                        <div class="item-nome">Garrafa 2,5L</div>
                                        <div class="item-info">Disponível: <span id="quantidadeGarrafa2_5">0</span></div>
                                    </div>
                                    
                                    <div class="item-selecao" data-produto="prato">
                                        <div class="item-icon">
                                            <img src="IMG/prato.png" alt="Prato">
                                        </div>
                                        <div class="item-nome">Prato</div>
                                        <div class="item-info">Disponível: <span id="quantidadePrato">0</span></div>
                                    </div>
                                    
                                    <div class="item-selecao" data-produto="copo">
                                        <div class="item-icon">
                                            <img src="IMG/copo.png" alt="Copo">
                                        </div>
                                        <div class="item-nome">Copo</div>
                                        <div class="item-info">Disponível: <span id="quantidadeCopo">0</span></div>
                                    </div>
                                    
                                    <div class="item-selecao" data-produto="refratario">
                                        <div class="item-icon">
                                            <img src="IMG/refratario.png" alt="Refratário">
                                        </div>
                                        <div class="item-nome">Refratário</div>
                                        <div class="item-info">Disponível: <span id="quantidadeRefratario">0</span></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="controles-scanner">
                                <div class="info-selecao">
                                    <div class="info-receita-selecionada" id="infoReceitaSelecionadaScanner" style="display: none;"></div>
                                    <div class="status-selecao aguardando" id="statusScanner">${this.getMensagemStatusInicial()}</div>
                                    <button class="btn-iniciar-escaneamento" id="btnIniciarEscaneamentoScanner" disabled>
                                        Iniciar Escaneamento
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- FASE DE MINIGAME SCRATCH -->
                        <div class="fase-minigame-scanner" id="faseMinigameScanner" style="display: none;">
                            <h3>Escaneamento em Andamento</h3>
                            <div class="instrucoes-scanner">
                                <p>🔍 Passe o scanner sobre o produto para revelar defeitos</p>
                                <p>🎯 Complete o escaneamento para realizar sua análise</p>
                                <p>🖱️ Clique e arraste sobre a imagem para escanear</p>
                            </div>

                            <div class="scratch-container">
                                <!-- coluna esquerda: barra vertical -->
                                <div class="progresso-vertical">
                                    <div class="texto-progresso" id="textoProgressoScanner">0%</div>
                                    <div class="barra-progresso-vertical" aria-hidden="true">
                                        <div class="preenchimento-vertical" id="barraProgressoVertical"></div>
                                    </div>
                                </div>

                                <!-- área do scratch -->
                                <div style="display:flex; flex-direction:column; align-items:center;">
                                    <div class="scratch-area">
                                        <!-- imagem de fundo (produto) -->
                                        <img id="imgFundoScanner" src="" alt="Produto Base" class="imagem-fundo-scanner" style="display:block;">
                                        <!-- canvas que terá a imagem "coberta" por cima (para raspar) -->
                                        <canvas id="canvasScanner" width="400" height="400"></canvas>
                                        <!-- imagem-ferramenta que seguirá o mouse -->
                                        <img id="ferramentaScanner" src="IMG/scannerFerramenta.png" alt="Scanner" class="ferramenta-scanner">
                                    </div>

                                    <!-- Botões abaixo do scratch -->
                                    <div class="container-botoes-scanner">
                                        <button class="btn-prancheta" id="btnAbrirPrancheta">Abrir Prancheta (Critérios)</button>
                                        <button class="btn-enviar-classificacao" id="btnEnviarClassificacao" disabled>
                                            Enviar Classificação
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Modal da prancheta (sem botão de enviar) -->
                            <div class="modal-prancheta" id="modalPrancheta">
                                <div class="conteudo">
                                    <h3>Classificação de produtos</h3>
                                    <p>Marque a classificação correta com base nas características reveladas.</p>

                                    <div class="opcoes-classificacao">
                                        <label class="opcao-check">
                                            <input type="radio" name="classificacaoScanner" value="premium">
                                            <span class="caixa"></span>
                                            Premium - Sem defeitos visíveis
                                        </label>
                                        <label class="opcao-check">
                                            <input type="radio" name="classificacaoScanner" value="padrao">
                                            <span class="caixa"></span>
                                            Padrão - Riscos leves
                                        </label>
                                        <label class="opcao-check">
                                            <input type="radio" name="classificacaoScanner" value="defeituoso">
                                            <span class="caixa"></span>
                                            Defeituoso - Rachaduras e trincados 
                                        </label>
                                    </div>

                                    <div style="margin-top:14px; display:flex; gap:10px; justify-content: flex-end; align-items:center;">
                                        <button id="btnFecharPrancheta" class="btn-prancheta" style="background:#95a5a6">Fechar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- FASE DE RESULTADO (NOVA) -->
                        <div class="fase-resultado-scanner" id="faseResultadoScanner" style="display: none;">
                            <h3>Resultado da Classificação</h3>
                            
                            <div class="pallet-container">
                                <img id="imagemPalletScanner" src="" alt="Pallet do Produto" class="imagem-pallet">
                                <div class="info-pallet">
                                    <h4>Pallet Produzido</h4>
                                    <p>Produto classificado e embalado para envio</p>
                                </div>
                            </div>
                            
                            <div class="resultado-classificacao" id="resultadoClassificacaoScanner" style="display: none;"></div>
                            
                            <div class="controles-resultado">
                                <button class="btn-finalizar-lote" id="btnFinalizarLoteScanner">
                                    Finalizar Lote
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
        
        return conteudosIniciais[this.tipo] || `<h2>${this.titulo}</h2><p>Máquina em desenvolvimento</p>`;
    },

    /*Liga a máquina e mostra a interface de processo*/
    ligarMaquina: function() {
        this.ligada = true;
        
        const modal = document.getElementById('modalMaquina');
        const spanFechar = modal.querySelector('.fechar-modal');
        if (spanFechar) {
            spanFechar.style.display = 'none';
        }
        
        const tipoCapitalizado = this.tipo.charAt(0).toUpperCase() + this.tipo.slice(1);
        const telaInicial = document.getElementById(`telaInicial${tipoCapitalizado}`);
        const conteudoProcesso = document.getElementById(`conteudoProcesso${tipoCapitalizado}`);
        
        if (telaInicial && conteudoProcesso) {
            telaInicial.style.display = 'none';
            conteudoProcesso.style.display = 'block';
        }
        
        // Garante que o inventário está atualizado
        if (window.SistemaInventario) {
            SistemaInventario.atualizarDisplay();
        }
        
        // CORREÇÃO: Configurar primeiro a seleção de itens para garantir que o status seja inicializado corretamente
        this.configurarSelecaoItens();
        this.configurarBotoesProcesso();
        
        // CORREÇÃO ESPECÍFICA PARA O MISTURADOR: Garantir que o status inicial seja aplicado
        if (this.tipo === 'misturador') {
            setTimeout(() => {
                const statusElement = document.getElementById('statusMisturador');
                if (statusElement) {
                    statusElement.textContent = this.getMensagemStatusInicial();
                    statusElement.className = 'status-selecao aguardando';
                    console.log('Status do misturador inicializado:', {
                        text: statusElement.textContent,
                        classes: statusElement.className
                    });
                }
            }, 100);
        }
        
        if (typeof GerenciadorMaquinas !== 'undefined') {
            GerenciadorMaquinas.inicializarMaquina(this.tipo);
        }
    },

    /*Configura os botões de processo específicos de cada máquina*/
    configurarBotoesProcesso: function() {
        const tipoCapitalizado = this.tipo.charAt(0).toUpperCase() + this.tipo.slice(1);
        const conteudoProcesso = document.getElementById(`conteudoProcesso${tipoCapitalizado}`);
        
        if (!conteudoProcesso) return;
        
        // Configurar botão de iniciar processo - CORREÇÃO AQUI
        const botoesIniciar = {
            'misturador': 'btnIniciarPreparacaoMisturador',
            'forno': 'btnColocarMisturaForno',
            'IS': 'btnIniciarMoldagemIS',
            'scanner': 'btnIniciarEscaneamentoScanner'
        };
        
        const botaoId = botoesIniciar[this.tipo];
        if (botaoId) {
            const botao = conteudoProcesso.querySelector(`#${botaoId}`);
            if (botao) {
                // Remove event listeners existentes e adiciona novos
                const novoBotao = botao.cloneNode(true);
                botao.parentNode.replaceChild(novoBotao, botao);
                
                const botaoAtualizado = conteudoProcesso.querySelector(`#${botaoId}`);
                
                switch(this.tipo) {
                    case 'misturador':
                        botaoAtualizado.onclick = () => {
                            console.log('Botão misturador clicado');
                            if (window.MisturadorLogica && typeof MisturadorLogica.iniciarPreparacao === 'function') {
                                MisturadorLogica.iniciarPreparacao();
                            } else {
                                console.error('MisturadorLogica não encontrado');
                            }
                        };
                        break;
                    case 'forno':
                        botaoAtualizado.onclick = () => {
                            console.log('Botão forno clicado');
                            if (window.FornoLogica && typeof FornoLogica.colocarMistura === 'function') {
                                FornoLogica.colocarMistura();
                            } else {
                                console.error('FornoLogica não encontrado');
                            }
                        };
                        break;
                    case 'IS':
                        botaoAtualizado.onclick = () => {
                            console.log('Botão IS clicado');
                            if (window.ISLogica && typeof ISLogica.iniciarMoldagem === 'function') {
                                ISLogica.iniciarMoldagem();
                            } else {
                                console.error('ISLogica não encontrado');
                            }
                        };
                        break;
                    case 'scanner':
                        botaoAtualizado.onclick = () => {
                            console.log('Botão scanner clicado');
                            if (window.ScannerLogica && typeof ScannerLogica.iniciarEscaneamento === 'function') {
                                ScannerLogica.iniciarEscaneamento();
                            } else {
                                console.error('ScannerLogica não encontrado');
                            }
                        };
                        break;
                }
                
                console.log(`Botão ${botaoId} configurado para máquina ${this.tipo}`);
            } else {
                console.error(`Botão não encontrado: ${botaoId}`);
            }
        }
        
        // Configurar outros botões específicos
        this.configurarBotoesEspecificos();
    },

    /*Configura botões específicos de cada máquina*/
    configurarBotoesEspecificos: function() {
        const tipoCapitalizado = this.tipo.charAt(0).toUpperCase() + this.tipo.slice(1);
        const conteudoProcesso = document.getElementById(`conteudoProcesso${tipoCapitalizado}`);
        
        if (!conteudoProcesso) return;
        
        if (this.tipo === 'misturador') {
            // Botão voltar para receitas
            const btnVoltar = conteudoProcesso.querySelector('#btnVoltarReceitas');
            if (btnVoltar) {
                btnVoltar.onclick = () => {
                    this.mostrarFase('Receitas');
                };
            }
            
            // Botões de pesagem
            const btnDespejar = conteudoProcesso.querySelector('#btnDespejar');
            const btnDescartar = conteudoProcesso.querySelector('#btnDescartar');
            const btnMisturar = conteudoProcesso.querySelector('#btnMisturarColetar');
            
            if (btnDespejar) btnDespejar.onclick = () => {
                if (window.MisturadorLogica) MisturadorLogica.despejarMaterial();
            };
            if (btnDescartar) btnDescartar.onclick = () => {
                if (window.MisturadorLogica) MisturadorLogica.descartarMaterial();
            };
            if (btnMisturar) btnMisturar.onclick = () => {
                if (window.MisturadorLogica) MisturadorLogica.misturarOuColetar();
            };
        }
    },

    /*Inicia o processo da máquina (será sobrescrito pela lógica específica)*/
    iniciarProcesso: function() {
        console.log('Iniciando processo para:', this.tipo);
        // Será implementado pela lógica específica de cada máquina
    },

    /*Mostra uma fase específica da máquina*/
    mostrarFase: function(nomeFase) {
        const tipoCapitalizado = this.tipo.charAt(0).toUpperCase() + this.tipo.slice(1);
        const conteudoProcesso = document.getElementById(`conteudoProcesso${tipoCapitalizado}`);
        
        if (!conteudoProcesso) return;
        
        // Esconder todas as fases
        const fases = conteudoProcesso.querySelectorAll('[id^="fase"]');
        fases.forEach(fase => {
            fase.style.display = 'none';
        });
        
        // Mostrar a fase solicitada
        const faseAlvo = conteudoProcesso.querySelector(`#fase${nomeFase}`);
        if (faseAlvo) {
            faseAlvo.style.display = 'block';
        }
    },

    /*Desliga a máquina*/
    desligarMaquina: function() {
        this.ligada = false;
        
        const modal = document.getElementById('modalMaquina');
        if (modal) {
            const spanFechar = modal.querySelector('.fechar-modal');
            if (spanFechar) {
                spanFechar.style.display = 'block';
            }
        }
    },

    /*Abre a modal da máquina*/
    abrirModal: function() {
        const modal = document.getElementById('modalMaquina');
        const conteudoModal = document.getElementById('conteudoModal');

        conteudoModal.innerHTML = this.getConteudoModal();
        modal.style.display = 'block';
        
        this.ligada = false;
        
        this.configurarFechamentoModal(modal);
        this.configurarBotaoLigar();
        
        // Reinicia a seleção
        this.reiniciarSelecao();

        if (this.tipo === 'misturador') {
            const st = document.getElementById("statusMisturador");
            if (st) st.classList.add("aguardando");
        }
        
        // Atualizar o inventário ao abrir a modal
        if (window.SistemaInventario) {
            SistemaInventario.atualizarDisplay();
        }
    },

    /*Reinicia a seleção quando a modal é aberta*/
    reiniciarSelecao: function() {
        this.receitaSelecionada = null;
        
        const infoContainers = {
            'misturador': 'infoReceitaSelecionadaMisturador',
            'forno': 'infoReceitaSelecionadaForno',
            'IS': 'infoReceitaSelecionadaIS',
            'scanner': 'infoReceitaSelecionadaScanner'
        };
        
        const statusElements = {
            'misturador': 'statusMisturador',
            'forno': 'statusForno',
            'IS': 'statusMolde',
            'scanner': 'statusScanner'
        };
        
        const infoContainerId = infoContainers[this.tipo];
        const statusElementId = statusElements[this.tipo];
        
        if (infoContainerId) {
            const infoContainer = document.getElementById(infoContainerId);
            if (infoContainer) {
                infoContainer.style.display = 'none';
                infoContainer.innerHTML = '';
            }
        }
        
        if (statusElementId) {
            const statusElement = document.getElementById(statusElementId);
            if (statusElement) {
                statusElement.textContent = this.getMensagemStatusInicial();
                // CORREÇÃO: Garantir que as classes sejam aplicadas corretamente
                statusElement.className = 'status-selecao aguardando';
                
                // Debug: verificar se o elemento está visível e com as classes corretas
                console.log(`Status ${statusElementId}:`, {
                    text: statusElement.textContent,
                    classes: statusElement.className,
                    display: statusElement.style.display,
                    visible: statusElement.offsetParent !== null
                });
            }
        }
        
        // Remove seleção de todos os itens
        const tipoCapitalizado = this.tipo.charAt(0).toUpperCase() + this.tipo.slice(1);
        const conteudoProcesso = document.getElementById(`conteudoProcesso${tipoCapitalizado}`);
        if (conteudoProcesso) {
            const itens = conteudoProcesso.querySelectorAll('.item-selecao');
            itens.forEach(item => item.classList.remove('selecionado'));
        }
        
        this.atualizarBotaoIniciar(false);
    },

    /*Configura o botão de ligar da máquina*/
    configurarBotaoLigar: function() {
        const btnLigar = document.getElementById(`btnLigar${this.tipo.charAt(0).toUpperCase() + this.tipo.slice(1)}`);
        const maquina = this;
        
        if (btnLigar) {
            btnLigar.onclick = function() {
                maquina.ligarMaquina();
            };
        }
    },

    /*Configura o fechamento da modal*/
    configurarFechamentoModal: function(modal) {
        const spanFechar = modal.querySelector('.fechar-modal');
        const maquina = this;
        
        spanFechar.onclick = function() {
            if (!maquina.ligada) {
                modal.style.display = 'none';
            }
        };
        
        window.onclick = function(event) {
            if (event.target == modal && !maquina.ligada) {
                modal.style.display = 'none';
            }
        };
    },
    
    /*Configura os eventos de clique na máquina*/
    configurarClique: function(canvas) {
        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            
            if (this.cliqueDentro(mouseX, mouseY)) {
                this.abrirModal();
            }
        });
    },
        
    configurarSelecaoItens: function() {
        const maquina = this;
        const tipoCapitalizado = this.tipo.charAt(0).toUpperCase() + this.tipo.slice(1);
        const conteudoProcesso = document.getElementById(`conteudoProcesso${tipoCapitalizado}`);
        
        if (!conteudoProcesso) return;
        
        // Usar delegação de eventos para funcionar com elementos dinâmicos
        conteudoProcesso.addEventListener('click', function(event) {
            const item = event.target.closest('.item-selecao');
            if (item) {
                // Encontrar o grid pai
                const grid = item.closest('.grid-selecao');
                if (grid) {
                    // Remove seleção de todos os itens do mesmo grid
                    const itens = grid.querySelectorAll('.item-selecao');
                    itens.forEach(i => i.classList.remove('selecionado'));
                    
                    // Adiciona seleção ao item clicado
                    item.classList.add('selecionado');
                    
                    // Atualiza a interface baseada no tipo de máquina
                    maquina.atualizarInterfaceSelecao(item);
                }
            }
        });
    },
    
    /*Atualiza a interface quando um item é selecionado*/
    atualizarInterfaceSelecao: function(itemSelecionado) {
        const tipo = this.tipo;
        const dataAttr = itemSelecionado.getAttribute('data-receita') || 
                        itemSelecionado.getAttribute('data-mistura') ||
                        itemSelecionado.getAttribute('data-vidro') ||
                        itemSelecionado.getAttribute('data-produto');
        
        if (!dataAttr) return;
        
        // Atualiza o botão de iniciar processo
        this.atualizarBotaoIniciar(true);
        
        // Atualiza a informação da receita selecionada
        this.mostrarInfoReceitaSelecionada(dataAttr, itemSelecionado);
        
        // Armazena a receita selecionada para uso posterior
        this.receitaSelecionada = dataAttr;
    },

    /*Atualiza o estado do botão de iniciar processo*/
    atualizarBotaoIniciar: function(habilitar) {
        const botoes = {
            'misturador': 'btnIniciarPreparacaoMisturador',
            'forno': 'btnColocarMisturaForno',
            'IS': 'btnIniciarMoldagemIS',
            'scanner': 'btnIniciarEscaneamentoScanner'
        };
        
        const botaoId = botoes[this.tipo];
        if (botaoId) {
            const botao = document.getElementById(botaoId);
            if (botao) {
                botao.disabled = !habilitar;
            }
        }
    },

    /*Mostra informações da receita selecionada - CORREÇÃO COMPLETA*/
    mostrarInfoReceitaSelecionada: function(receitaId, elemento) {
        // Impede que o status seja sobrescrito se não há elemento selecionado
        if (!elemento || !receitaId) return;
        
        const infoContainers = {
            'misturador': 'infoReceitaSelecionadaMisturador',
            'forno': 'infoReceitaSelecionadaForno',
            'IS': 'infoReceitaSelecionadaIS',
            'scanner': 'infoReceitaSelecionadaScanner'
        };
        
        const statusElements = {
            'misturador': 'statusMisturador',
            'forno': 'statusForno',
            'IS': 'statusMolde',
            'scanner': 'statusScanner'
        };
        
        const infoContainerId = infoContainers[this.tipo];
        const statusElementId = statusElements[this.tipo];
        
        if (!infoContainerId || !statusElementId) return;
        
        const infoContainer = document.getElementById(infoContainerId);
        const statusElement = document.getElementById(statusElementId);
        
        if (!infoContainer || !statusElement) return;
        
        // CORREÇÃO CRÍTICA: Garantir que o infoContainer NÃO receba classes de status
        // Reset completo das classes para evitar conflitos
        infoContainer.className = 'info-receita-selecionada';
        infoContainer.classList.remove('aguardando', 'pronto', 'selecionado');
        
        // Obtém informações do elemento selecionado
        const nome = elemento.querySelector('.item-nome').textContent;
        const info = elemento.querySelector('.item-info').textContent;
        
        // Conteúdo HTML para a informação da receita
        let conteudoHTML = `
            <div class="receita-titulo">${nome}</div>
            <div class="receita-descricao">${info}</div>
        `;
        
        // Adiciona informações específicas baseadas no tipo de máquina
        if (this.tipo === 'misturador') {
            const receitas = {
                'garrafa250': { areia: 100, barrilha: 30, calcario: 20 },
                'garrafa500': { areia: 230, barrilha: 70, calcario: 50 },
                'garrafa2_5': { areia: 700, barrilha: 200, calcario: 100 },
                'prato': { areia: 500, barrilha: 120, calcario: 80 },
                'copo': { areia: 280, barrilha: 80, calcario: 40 },
                'refratario': { areia: 1050, barrilha: 300, calcario: 150 }
            };
            
            const receita = receitas[receitaId];
            if (receita) {
                conteudoHTML += `
                    <div class="receita-materiais">
                        <div class="material-item">
                            <span>Areia Sílica:</span>
                            <span>${receita.areia}g</span>
                        </div>
                        <div class="material-item">
                            <span>Barrilha:</span>
                            <span>${receita.barrilha}g</span>
                        </div>
                        <div class="material-item">
                            <span>Calcário:</span>
                            <span>${receita.calcario}g</span>
                        </div>
                    </div>
                `;
            }
        }
        
        infoContainer.innerHTML = conteudoHTML;
        infoContainer.style.display = 'block';
        
        // CORREÇÃO: Atualizar APENAS o status element - garantir que as classes sejam preservadas
        statusElement.textContent = `${nome} selecionado(a)`;
        
        // Remover todas as classes possíveis e adicionar apenas as corretas
        statusElement.className = 'status-selecao pronto';
        
        // Debug para verificar se as classes estão sendo aplicadas corretamente
        console.log(`Status atualizado - Texto: "${statusElement.textContent}", Classes: "${statusElement.className}"`);
    }
};