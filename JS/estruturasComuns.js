/* ESTRUTURAS COMUNS - Sistema de Fábrica de Vidro
    Contém templates padronizados para elementos repetitivos nas máquinaa*/

const EstruturasComuns = {
    /*Cria grid de seleção padronizado para receitas, misturas ou produtos*/
    criarGridSelecao: function(itens, tipo, prefixoId) {
        return `
            <div class="${tipo}-container">
                <div class="misturas-grid">
                    ${itens.map(item => `
                        <div class="mistura-item" data-${tipo}="${item.id}">
                            <div class="mistura-icon">
                                <img src="${item.icone}" alt="${item.nome}">
                            </div>
                            <div class="mistura-nome">${item.nome}</div>
                            <div class="mistura-quantidade">Disponível: <span id="${prefixoId}${this.capitalizeFirst(item.id)}">0</span></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /*Cria informações de seleção padronizada*/
    criarInfoSelecao: function(id, tipo) {
        return `
            <div class="info-selecao">
                <div class="info-receita-selecionada" id="infoReceitaSelecionada${this.capitalizeFirst(id)}" style="display: none;"></div>
                <div class="status-${tipo}" id="status${this.capitalizeFirst(tipo)}">Selecione um ${tipo} para começar</div>
                <button class="btn-iniciar-processo" id="btnIniciar${this.capitalizeFirst(tipo)}" disabled>
                    Iniciar Processo do ${this.capitalizeFirst(tipo)} Selecionado
                </button>
            </div>
        `;
    },

    /*Cria controle de temperatura padronizado*/
    criarControleTemperatura: function(sufixo, zonaMin, zonaMax, temperaturaMax, metaSegundos) {
        return `
            <div class="controle-container">
                <div class="termometro-container">
                    <div class="termometro-titulo">Controle de Temperatura</div>
                    <div class="termometro-completo">
                        <div class="termometro-visual">
                            <img src="IMG/fundo-termometro.png" alt="Termômetro" id="fundoTermometro${sufixo}" class="imagem-termometro-fundo">
                            <div class="termometro-barra">
                                <div class="zona-ideal" id="zonaVerde${sufixo}"></div>
                                <div class="barra-temperatura" id="barraTemperatura${sufixo}"></div>
                            </div>
                        </div>
                        <div class="termometro-info">
                            <div class="temperatura-display">
                                <span class="temperatura-valor" id="temperaturaAtual${sufixo}">25°C</span>
                                <div class="status-temperatura" id="statusTemperatura${sufixo}">Pronto para iniciar</div>
                            </div>
                            <div class="zona-info">Zona Ideal: ${zonaMin}°C - ${zonaMax}°C</div>
                            <div class="tempo-estavel-container">
                                <div class="tempo-estavel" id="tempoEstavel${sufixo}">Tempo estável acumulado: 0s</div>
                                <div class="progresso-estabilidade">
                                    <div class="barra-progresso">
                                        <div class="preenchimento-progresso" id="preenchimentoProgresso${sufixo}"></div>
                                    </div>
                                    <span class="meta-estabilidade">Meta: ${metaSegundos}s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="controles-temperatura">
                    <button class="btn-esquentar" id="btnEsquentar${sufixo}">🔥 Esquentar</button>
                    <button class="btn-resfriar" id="btnResfriar${sufixo}">❄️ Resfriar</button>
                </div>
            </div>
        `;
    },

    /*Cria resultado final padronizado*/
    criarResultadoFinal: function(tipo) {
        return `
            <div class="fase-resultado" id="faseResultado${this.capitalizeFirst(tipo)}" style="display: none;">
                <div class="resultado-container">
                    <h3>Processo Concluído!</h3>
                    
                    <div class="produto-resultado">
                        <img id="imagemProdutoFinal${this.capitalizeFirst(tipo)}" src="" alt="Produto Final" class="imagem-produto-final">
                    </div>
                    
                    <div class="resultado-sucesso" id="resultadoSucesso${this.capitalizeFirst(tipo)}">
                        ✅ Processo concluído com sucesso!
                    </div>
                    
                    <div class="botoes-resultado">
                        <button class="btn-fechar-resultado" id="btnFecharResultado${this.capitalizeFirst(tipo)}">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /*Capitaliza a primeira letra de uma string*/
    capitalizeFirst: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

window.EstruturasComuns = EstruturasComuns;