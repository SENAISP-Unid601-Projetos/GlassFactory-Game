/* LÓGICA DAS MÁQUINAS - Implementa a lógica de funcionamento de todas as máquinas*/

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
}

/*Base comum para todas as máquinas*/
const MaquinaBase = {
    estado: {},
    
    /*Inicializa a máquina*/
    inicializar: function() {
        this.configurarEventos();
        this.atualizarInterface();
    },
    
    /*Configura eventos da máquina (implementado por cada máquina)*/
    configurarEventos: function() {
        // Será implementado por cada máquina
    },
    
    /*Atualiza interface da máquina (implementado por cada máquina)*/
    atualizarInterface: function() {
        // Será implementado por cada máquina
    },
    
    /*Mostra uma fase específica*/
    mostrarFase: function(fase) {
        // Esconder todas as fases
        document.querySelectorAll('[id^="fase"]').forEach(el => {
            el.style.display = 'none';
        });
        
        // Converter para o formato correto (ex: "Selecao" vira "faseSelecao")
        const faseId = `fase${fase.charAt(0).toUpperCase() + fase.slice(1)}`;
        
        const faseElement = document.getElementById(faseId);
        if (faseElement) {
            faseElement.style.display = 'block';
        } else {
            console.error('Elemento da fase não encontrado:', faseId);
            // Listar todas as fases disponíveis para debug
            const todasFases = document.querySelectorAll('[id^="fase"]');
            console.log('Fases disponíveis:', Array.from(todasFases).map(f => f.id));
        }
        
        this.estado.fase = fase;
    },
    
    /*Inicia um timer*/
    iniciarTimer: function(duracao, callbackFinal) {
        let tempoRestante = duracao;
        this.estado.timer = setInterval(() => {
            tempoRestante--;
            if (tempoRestante <= 0) {
                clearInterval(this.estado.timer);
                callbackFinal();
            }
        }, 1000);
        return tempoRestante;
    },

    /*Configura um botão*/
    configurarBotao: function(id, callback, texto) {
        const botao = document.getElementById(id);
        if (botao) {
            // Remove event listeners existentes para evitar duplicação
            const novoBotao = botao.cloneNode(true);
            botao.parentNode.replaceChild(novoBotao, botao);
            
            const botaoAtualizado = document.getElementById(id);
            if (callback) {
                botaoAtualizado.addEventListener('click', callback);
            }
            if (texto !== undefined) {
                botaoAtualizado.textContent = texto;
            }
            return botaoAtualizado;
        }
        return null;
    },

    /*Atualiza barra de temperatura*/
    atualizarBarraTemperatura: function(temperaturaAtual, temperaturaMaxima, idBarra, ehIS = false) {
        const barra = document.getElementById(idBarra);
        if (!barra) return;
        
        const percentual = (temperaturaAtual / temperaturaMaxima) * 100;
        barra.style.width = percentual + '%';
        
        if (ehIS) {
            if (temperaturaAtual >= 630 && temperaturaAtual <= 670) {
                barra.style.backgroundColor = '#4CAF50';
            } else if (temperaturaAtual > 670) {
                barra.style.backgroundColor = '#ff9800';
            } else {
                barra.style.backgroundColor = '#2196F3';
            }
        } else {
            if (temperaturaAtual >= 1550 && temperaturaAtual <= 1600) {
                barra.style.backgroundColor = '#4CAF50';
            } else if (temperaturaAtual > 1600) {
                barra.style.backgroundColor = '#f44336';
            } else {
                barra.style.backgroundColor = '#2196F3';
            }
        }
    },

    /*Finaliza o processo da máquina*/
    finalizarProcesso: function() {
        // 1. Fechar a modal primeiro
        const modal = document.getElementById('modalMaquina');
        if (modal) {
            modal.style.display = 'none';
        }
        
        // 2. Resetar estado da máquina
        if (this.resetar) {
            this.resetar();
        }
        
        // 3. Notificar o gerenciador
        if (window.GerenciadorMaquinas && this.tipoMaquina) {
            GerenciadorMaquinas.finalizarProcesso(this.tipoMaquina);
        }
        
        // 4. Garantir que o botão de fechar seja restaurado
        this.restaurarBotaoFechar();
    },

    /*Restaura botão de fechar da modal*/
    restaurarBotaoFechar: function() {
        const modal = document.getElementById('modalMaquina');
        if (modal) {
            const spanFechar = modal.querySelector('.fechar-modal');
            if (spanFechar) {
                spanFechar.style.display = 'flex';
            }
        }
    },

    /*Atualiza elemento HTML*/
    atualizarElemento: function(id, valor) {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = valor;
    },

    /*Capitaliza primeira letra*/
    capitalizeFirst: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

// =============================================
// MISTURADOR - Lógica do Misturador de Matérias-Primas
// =============================================

const MisturadorLogica = {
    ...MaquinaBase,
    
    tipoMaquina: 'misturador',
    
    estado: {
        receitas: {
            'garrafa250': { nome: 'Garrafa 250ml', pesoTotal: 150, areia: 0.75, barrilha: 0.25, calcario: 0.05, icone: 'IMG/garrafa-250.png' },
            'garrafa500': { nome: 'Garrafa 500ml', pesoTotal: 350, areia: 0.75, barrilha: 0.25, calcario: 0.05, icone: 'IMG/garrafa-500.png' },
            'garrafa2_5': { nome: 'Garrafa 2,5L', pesoTotal: 1000, areia: 0.75, barrilha: 0.25, calcario: 0.05, icone: 'IMG/garrafa-2-5.png' },
            'prato': { nome: 'Prato', pesoTotal: 700, areia: 0.75, barrilha: 0.25, calcario: 0.05, icone: 'IMG/prato.png' },
            'copo': { nome: 'Copo', pesoTotal: 400, areia: 0.75, barrilha: 0.25, calcario: 0.05, icone: 'IMG/copo.png' },
            'refratario': { nome: 'Refratário', pesoTotal: 1500, areia: 0.75, barrilha: 0.25, calcario: 0.05, icone: 'IMG/refratario.png' }
        },
        receitaSelecionada: null,
        materiais: {
            areia: { necessaria: 0, atual: 0, adicionado: false },
            barrilha: { necessaria: 0, atual: 0, adicionado: false },
            calcario: { necessaria: 0, atual: 0, adicionado: false }
        },
        materialSelecionado: null,
        pesando: false,
        misturaPronta: false,
        misturando: false,
        intervaloPesagem: null
    },

    inicializar: function() {
        this.configurarEventos();
        this.atualizarInterface();
    },

    configurarEventos: function() {
        // Configurar eventos das receitas
        document.querySelectorAll('.item-selecao[data-receita]').forEach(receita => {
            receita.addEventListener('click', (e) => {
                const tipo = e.currentTarget.dataset.receita;
                this.selecionarReceita(tipo);
            });
        });

        // Botão para iniciar preparação - CORREÇÃO AQUI
        this.configurarBotao('btnIniciarPreparacaoMisturador', () => this.iniciarPreparacao(), "Iniciar Preparação da Receita Selecionada");

        // Eventos dos materiais e balança
        document.querySelectorAll('.material').forEach(material => {
            material.addEventListener('click', (e) => {
                const tipo = e.currentTarget.dataset.material;
                if (!this.estado.materiais[tipo].adicionado) {
                    this.selecionarMaterial(tipo);
                }
            });
        });

        const balanca = document.getElementById('balanca');
        if (balanca) {
            balanca.addEventListener('mousedown', () => this.iniciarPesagem());
            balanca.addEventListener('mouseup', () => this.pararPesagem());
            balanca.addEventListener('mouseleave', () => this.pararPesagem());
        }

        this.configurarBotao('btnDespejar', () => this.despejarMaterial());
        this.configurarBotao('btnDescartar', () => this.descartarMaterial());
        this.configurarBotao('btnMisturarColetar', () => this.misturarOuColetar());
        this.configurarBotao('btnVoltarReceitas', () => this.voltarParaReceitas());
    },

    selecionarReceita: function(receita) {
        if (!this.estado.receitas[receita]) return;
        
        this.estado.receitaSelecionada = receita;
        const receitaData = this.estado.receitas[receita];
        
        // Atualizar seleção visual
        document.querySelectorAll('.item-selecao[data-receita]').forEach(item => {
            item.classList.remove('selecionado');
        });
        document.querySelector(`[data-receita="${receita}"]`).classList.add('selecionado');
        
        // Atualizar informações da receita selecionada
        const infoReceita = document.getElementById('infoReceitaSelecionadaMisturador');
        if (infoReceita) {
            infoReceita.innerHTML = `
                <strong>Receita Selecionada:</strong> ${receitaData.nome}<br>
                <strong>Peso Total:</strong> ${receitaData.pesoTotal}g<br>
                <strong>Areia:</strong> ${Math.round(receitaData.pesoTotal * receitaData.areia)}g<br>
                <strong>Barrilha:</strong> ${Math.round(receitaData.pesoTotal * receitaData.barrilha)}g<br>
                <strong>Calcário:</strong> ${Math.round(receitaData.pesoTotal * receitaData.calcario)}g
            `;
            infoReceita.style.display = 'block';
        }
        
        this.atualizarInterface();
    },

    iniciarPreparacao: function() {
        const receitaData = this.estado.receitas[this.estado.receitaSelecionada];
        
        // Calcular quantidades necessárias baseadas nas porcentagens
        this.estado.materiais.areia.necessaria = Math.round(receitaData.pesoTotal * receitaData.areia);
        this.estado.materiais.barrilha.necessaria = Math.round(receitaData.pesoTotal * receitaData.barrilha);
        this.estado.materiais.calcario.necessaria = Math.round(receitaData.pesoTotal * receitaData.calcario);
        
        // Resetar estado dos materiais
        Object.keys(this.estado.materiais).forEach(material => {
            this.estado.materiais[material].atual = 0;
            this.estado.materiais[material].adicionado = false;
        });
        
        this.estado.materialSelecionado = null;
        this.estado.misturaPronta = false;
        this.estado.misturando = false;
        
        this.mostrarFase('Selecao');
        this.atualizarInterface();
    },

    selecionarMaterial: function(material) {
        if (!this.estado.receitaSelecionada) return;
        
        document.querySelectorAll('.material').forEach(m => m.classList.remove('selecionado'));
        
        const elementoMaterial = document.querySelector(`[data-material="${material}"]`);
        if (elementoMaterial) {
            elementoMaterial.classList.add('selecionado');
        }
        
        this.estado.materialSelecionado = material;
        this.atualizarBotoesPesagem();
        this.atualizarInterface();
    },

    iniciarPesagem: function() {
        if (!this.estado.receitaSelecionada || !this.estado.materialSelecionado || this.estado.pesando) return;
        
        this.estado.pesando = true;
        const balanca = document.getElementById('balanca');
        if (balanca) balanca.classList.add('pesando');
        
        this.estado.intervaloPesagem = setInterval(() => {
            const material = this.estado.materialSelecionado;
            if (this.estado.materiais[material].atual < 2000) {
                this.estado.materiais[material].atual += 10;
                this.atualizarBotoesPesagem();
                this.atualizarInterface();
            }
        }, 100);
    },

    pararPesagem: function() {
        if (!this.estado.pesando) return;
        
        this.estado.pesando = false;
        clearInterval(this.estado.intervaloPesagem);
        
        const balanca = document.getElementById('balanca');
        if (balanca) balanca.classList.remove('pesando');
        
        this.atualizarBotoesPesagem();
    },

    descartarMaterial: function() {
        if (!this.estado.materialSelecionado) return;
        
        const material = this.estado.materialSelecionado;
        const dados = this.estado.materiais[material];
        
        if (dados.atual > dados.necessaria) {
            dados.atual = dados.necessaria;
        } else {
            dados.atual = 0;
        }
        
        this.atualizarBotoesPesagem();
        this.atualizarInterface();
    },

    atualizarBotoesPesagem: function() {
        if (!this.estado.receitaSelecionada) {
            this.atualizarBotao('btnDespejar', true, "Despejar");
            this.atualizarBotao('btnDescartar', true, "Descartar");
            
            const statusPeso = document.getElementById('statusPeso');
            if (statusPeso) {
                statusPeso.textContent = "Selecione uma receita primeiro";
                statusPeso.className = 'status-peso';
            }
            return;
        }

        if (!this.estado.materialSelecionado) {
            this.atualizarBotao('btnDespejar', true, "Despejar");
            this.atualizarBotao('btnDescartar', true, "Descartar");
            
            const statusPeso = document.getElementById('statusPeso');
            if (statusPeso) {
                statusPeso.textContent = "Selecione um material";
                statusPeso.className = 'status-peso';
            }
            return;
        }

        const material = this.estado.materialSelecionado;
        const pesoAtual = this.estado.materiais[material].atual;
        const pesoNecessario = this.estado.materiais[material].necessaria;

        const podeDespejar = (pesoAtual === pesoNecessario);
        this.atualizarBotao('btnDespejar', !podeDespejar, "Despejar");

        const podeDescartar = (pesoAtual > 0);
        const textoDescartar = (pesoAtual > pesoNecessario) ? "Descartar Excesso" : "Descartar Tudo";
        this.atualizarBotao('btnDescartar', !podeDescartar, textoDescartar);

        this.atualizarStatusPeso(pesoAtual, pesoNecessario);
    },

    atualizarBotao: function(id, disabled, texto) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.disabled = disabled;
            if (texto !== undefined) {
                btn.textContent = texto;
            }
        }
    },

    atualizarStatusPeso: function(pesoAtual, pesoNecessario) {
        const statusPeso = document.getElementById('statusPeso');
        if (!statusPeso) return;

        if (pesoAtual === 0) {
            statusPeso.textContent = "Vazio";
            statusPeso.className = 'status-peso';
        } else if (pesoAtual === pesoNecessario) {
            statusPeso.textContent = "✅ Quantidade correta!";
            statusPeso.className = 'status-peso correto';
        } else if (pesoAtual < pesoNecessario) {
            statusPeso.textContent = `Faltam ${pesoNecessario - pesoAtual}g`;
            statusPeso.className = 'status-peso insuficiente';
        } else {
            statusPeso.textContent = `Excesso de ${pesoAtual - pesoNecessario}g`;
            statusPeso.className = 'status-peso excesso';
        }
    },

    despejarMaterial: function() {
        if (!this.estado.materialSelecionado) return;
        
        const material = this.estado.materialSelecionado;
        const dados = this.estado.materiais[material];
        
        if (dados.atual !== dados.necessaria) return;
        
        dados.adicionado = true;
        dados.atual = 0;
        this.estado.materialSelecionado = null;
        
        document.querySelectorAll('.material').forEach(m => m.classList.remove('selecionado'));
        
        this.atualizarInterface();
        this.verificarMisturaCompleta();
    },

    verificarMisturaCompleta: function() {
        const todosAdicionados = Object.values(this.estado.materiais).every(m => m.adicionado);
        if (todosAdicionados) {
            this.mostrarFase('Mistura');
            mostrarAviso("Todos os materiais adicionados! Pronto para misturar.");
        }
    },

    misturarOuColetar: function() {
        if (this.estado.misturando) return;
        
        if (this.estado.misturaPronta) {
            this.coletarMistura();
        } else {
            this.iniciarMistura();
        }
    },

    iniciarMistura: function() {
        if (this.estado.misturando || this.estado.misturaPronta) return;
        
        this.estado.misturando = true;
        
        let tempoRestante = 10;
        const contador = document.getElementById('contador');
        
        this.estado.timer = setInterval(() => {
            if (contador) {
                contador.textContent = `00:${tempoRestante.toString().padStart(2, '0')}`;
            }
            
            if (tempoRestante <= 0) {
                clearInterval(this.estado.timer);
                this.misturaFinalizada();
            }
            
            tempoRestante--;
        }, 1000);
        
        this.atualizarInterface();
    },

    misturaFinalizada: function() {
        this.estado.misturando = false;
        this.estado.misturaPronta = true;
        
        const contador = document.getElementById('contador');
        if (contador) {
            contador.textContent = "🎉 Concluído!";
        }
        
        this.atualizarInterface();
    },

    coletarMistura: function() {
        if (!this.estado.misturaPronta || !this.estado.receitaSelecionada) return;
        
        const mapeamentoReceitas = {
            'garrafa250': 'misturaGarrafa250',
            'garrafa500': 'misturaGarrafa500', 
            'garrafa2_5': 'misturaGarrafa2_5',
            'prato': 'misturaPrato',
            'copo': 'misturaCopo',
            'refratario': 'misturaRefratario'
        };
        
        const itemInventario = mapeamentoReceitas[this.estado.receitaSelecionada];
        
        if (itemInventario) {
            SistemaInventario.adicionar(itemInventario, 1);
            mostrarAviso(`Mistura para ${this.estado.receitas[this.estado.receitaSelecionada].nome} adicionada ao inventário!`);
            this.finalizarProcesso();
        }
    },

    voltarParaReceitas: function() {
        this.estado.receitaSelecionada = null;
        this.estado.materialSelecionado = null;
        this.mostrarFase('Receitas');
        this.atualizarInterface();
    },

    resetar: function() {
        clearInterval(this.estado.intervaloPesagem);
        clearInterval(this.estado.timer);
        
        this.estado.receitaSelecionada = null;
        Object.keys(this.estado.materiais).forEach(material => {
            this.estado.materiais[material] = {
                necessaria: 0,
                atual: 0,
                adicionado: false
            };
        });
        
        this.estado.materialSelecionado = null;
        this.estado.pesando = false;
        this.estado.misturaPronta = false;
        this.estado.misturando = false;
        
        const contador = document.getElementById('contador');
        if (contador) contador.textContent = '';
        
        this.mostrarFase('Receitas');
        this.atualizarInterface();
    },

    atualizarInterface: function() {
        // Atualizar botão de iniciar preparação
        const btnIniciarPreparacao = document.getElementById('btnIniciarPreparacaoMisturador');
        if (btnIniciarPreparacao) {
            btnIniciarPreparacao.disabled = !this.estado.receitaSelecionada;
        }

        // Atualizar status do misturador
        const statusMisturador = document.getElementById('statusMisturador');
        if (statusMisturador) {
            if (this.estado.receitaSelecionada) {
                const receitaData = this.estado.receitas[this.estado.receitaSelecionada];
                statusMisturador.textContent = `Selecionado: ${receitaData.nome} - ${receitaData.pesoTotal}g total`;
                statusMisturador.className = "status-misturador pronto";
            } else {
                statusMisturador.textContent = "Selecione uma receita para começar";
                statusMisturador.className = "status-misturador-aguardando";
            }
        }

        // Atualizar informações da receita selecionada na fase de seleção
        const infoReceita = document.getElementById('infoReceitaSelecionada');
        if (infoReceita) {
            if (this.estado.receitaSelecionada) {
                const receita = this.estado.receitas[this.estado.receitaSelecionada];
                infoReceita.innerHTML = `
                    <strong>Receita Selecionada:</strong> ${receita.nome}<br>
                    <strong>Peso Total:</strong> ${receita.pesoTotal}g<br>
                    <strong>Areia:</strong> ${this.estado.materiais.areia.necessaria}g<br>
                    <strong>Barrilha:</strong> ${this.estado.materiais.barrilha.necessaria}g<br>
                    <strong>Calcário:</strong> ${this.estado.materiais.calcario.necessaria}g
                `;
                infoReceita.style.display = 'block';
            } else {
                infoReceita.style.display = 'none';
            }
        }

        // Atualizar quantidades necessárias nos materiais
        this.atualizarElemento('qtdeAreiaNecessaria', this.estado.materiais.areia.necessaria);
        this.atualizarElemento('qtdeBarrilhaNecessaria', this.estado.materiais.barrilha.necessaria);
        this.atualizarElemento('qtdeCalcarioNecessaria', this.estado.materiais.calcario.necessaria);

        Object.keys(this.estado.materiais).forEach(material => {
            const elemento = document.querySelector(`[data-material="${material}"]`);
            const dados = this.estado.materiais[material];
            
            if (!elemento) return;
            
            elemento.classList.remove('correta', 'insuficiente', 'excesso', 'adicionado');
            
            if (dados.adicionado) {
                elemento.classList.add('correta', 'adicionado');
            } else if (dados.atual === dados.necessaria) {
                elemento.classList.add('correta');
            } else if (dados.atual < dados.necessaria) {
                elemento.classList.add('insuficiente');
            } else if (dados.atual > dados.necessaria) {
                elemento.classList.add('excesso');
            }
        });
        
        // ATUALIZAR DISPLAY DA BALANÇA
        const displayPeso = document.getElementById('displayPeso');
        if (displayPeso && this.estado.materialSelecionado) {
            const peso = this.estado.materiais[this.estado.materialSelecionado].atual;
            displayPeso.textContent = `${peso}g`;
            
            const necessaria = this.estado.materiais[this.estado.materialSelecionado].necessaria;
            if (peso === 0) {
                displayPeso.className = 'display-peso';
            } else if (peso === necessaria) {
                displayPeso.className = 'display-peso correto';
            } else if (peso < necessaria) {
                displayPeso.className = 'display-peso insuficiente';
            } else {
                displayPeso.className = 'display-peso excesso';
            }
        } else if (displayPeso) {
            displayPeso.textContent = "0g";
            displayPeso.className = 'display-peso';
        }
        
        const btnMisturar = document.getElementById('btnMisturarColetar');
        if (btnMisturar) {
            btnMisturar.classList.remove('misturando', 'pronto');
            
            if (this.estado.misturando) {
                btnMisturar.textContent = " Misturando...";
                btnMisturar.disabled = true;
                btnMisturar.classList.add('misturando');
            } else if (this.estado.misturaPronta) {
                btnMisturar.textContent = " Coletar Mistura";
                btnMisturar.disabled = false;
                btnMisturar.classList.add('pronto');
            } else {
                btnMisturar.textContent = " Iniciar Mistura";
                btnMisturar.disabled = !Object.values(this.estado.materiais).every(m => m.adicionado);
            }
        }

        // Atualizar botão voltar
        const btnVoltar = document.getElementById('btnVoltarReceitas');
        if (btnVoltar) {
            btnVoltar.style.display = this.estado.receitaSelecionada ? 'block' : 'none';
        }
        
        this.atualizarBotoesPesagem();
    }
};

// =============================================
// FORNO - Lógica do Forno de Fusão
// =============================================

const FornoLogica = {
    ...MaquinaBase,
    tipoMaquina: 'forno',

    estado: {
        fase: 'selecaoMistura',
        misturaSelecionada: null,
        temperatura: 25,
        temperaturaAlvo: { min: 1500, max: 1600 },
        tempoEstavel: 0,
        tempoEstavelTotal: 0,
        vidroPronto: false,
        misturaColocada: false,
        intervaloTemperatura: null,
        processoIniciado: false,
        aquecendo: false,
        resfriando: false,
        intervaloManual: null
    },

    inicializar: function() {
        this.configurarEventos();
        this.atualizarInterface();
        this.verificarMisturasDisponiveis();
    },

    configurarEventos: function() {
        // Seleção de mistura
        document.querySelectorAll('.item-selecao[data-mistura]').forEach(item => {
            item.addEventListener('click', (e) => {
                const tipoMistura = e.currentTarget.dataset.mistura;
                this.selecionarMistura(tipoMistura);
            });
        });

        // Botões principais - CORREÇÃO AQUI
        this.configurarBotao('btnColocarMisturaForno', () => this.colocarMistura());
        this.configurarBotao('btnLigarForno', () => this.ligarForno());
        
        // Botões de controle de temperatura
        const btnEsquentar = document.getElementById('btnEsquentar');
        const btnResfriar = document.getElementById('btnResfriar');
        
        if (btnEsquentar) {
            btnEsquentar.addEventListener('mousedown', () => this.iniciarAquecimento());
            btnEsquentar.addEventListener('mouseup', () => this.pararAquecimento());
            btnEsquentar.addEventListener('mouseleave', () => this.pararAquecimento());
        }
        
        if (btnResfriar) {
            btnResfriar.addEventListener('mousedown', () => this.iniciarResfriamento());
            btnResfriar.addEventListener('mouseup', () => this.pararResfriamento());
            btnResfriar.addEventListener('mouseleave', () => this.pararResfriamento());
        }

        this.configurarBotao('btnColetarVidro', () => this.coletarVidro());
    },

    verificarMisturasDisponiveis: function() {
        const misturas = [
            'misturaGarrafa250', 'misturaGarrafa500', 'misturaGarrafa2_5',
            'misturaPrato', 'misturaCopo', 'misturaRefratario'
        ];

        const temMistura = misturas.some(tipo => SistemaInventario.tem(tipo));
        const btnLigarInicial = document.getElementById('btnLigarForno');

        if (btnLigarInicial) {
            btnLigarInicial.disabled = !temMistura;
            btnLigarInicial.textContent = temMistura
                ? "Ligar Forno"
                : "Sem misturas disponíveis";
        }
    },

    selecionarMistura: function(tipoMistura) {
        if (this.estado.misturaColocada) return;

        if (SistemaInventario.tem(tipoMistura)) {
            this.estado.misturaSelecionada = tipoMistura;
            document.querySelectorAll('.item-selecao[data-mistura]').forEach(item => item.classList.remove('selecionado'));
            document.querySelector(`[data-mistura="${tipoMistura}"]`).classList.add('selecionado');
            this.atualizarBotoesForno();
        }
    },

    colocarMistura: function() {
        console.log('Forno: colocarMistura chamado');
        if (this.estado.misturaColocada) return;

        if (this.estado.misturaSelecionada && SistemaInventario.tem(this.estado.misturaSelecionada)) {
            SistemaInventario.remover(this.estado.misturaSelecionada, 1);
            this.estado.misturaColocada = true;

            this.mostrarFase('ControleTemperatura');
            this.estado.processoIniciado = true;

            // Inicia o aquecimento automático
            this.iniciarAquecimentoAutomatico();

            // Atualiza interface
            setTimeout(() => {
                this.atualizarBarraTemperatura();
                this.atualizarBotoesForno();
                
                // Ativar botões de temperatura manual
                const btnEsquentar = document.getElementById('btnEsquentar');
                const btnResfriar = document.getElementById('btnResfriar');
                if (btnEsquentar) btnEsquentar.disabled = false;
                if (btnResfriar) btnResfriar.disabled = false;
            }, 100);
        }
    },

    iniciarAquecimentoAutomatico: function() {
        this.pararControleManual();
        
        this.estado.intervaloTemperatura = setInterval(() => {
            // Aquecimento automático gradual apenas se não estiver em controle manual
            if (!this.estado.aquecendo && !this.estado.resfriando) {
                const variacao = 3 + (Math.random() * 4); // Variação entre 3 e 7 graus por segundo
                this.estado.temperatura = Math.min(1800, this.estado.temperatura + variacao);

                this.atualizarBarraTemperatura();
                this.verificarZonaIdeal();

                const temperaturaDisplay = document.getElementById('temperaturaAtual');
                if (temperaturaDisplay) {
                    temperaturaDisplay.textContent = `${Math.round(this.estado.temperatura)}°C`;
                }
            }

            if (this.estado.vidroPronto) {
                clearInterval(this.estado.intervaloTemperatura);
            }
        }, 1000);
    },

    // Métodos de controle de temperatura
    iniciarAquecimento: function() {
        if (!this.estado.processoIniciado) return;
        
        this.estado.aquecendo = true;
        this.estado.resfriando = false;
        
        // Parar controle automático temporariamente
        if (this.estado.intervaloTemperatura) {
            clearInterval(this.estado.intervaloTemperatura);
        }
    
        mostrarAviso("Dica: Mantenha o botão pressionado para aquecer continuamente.", 3000);
        this.iniciarControleManual();
    },

    pararAquecimento: function() {
        if (this.estado.aquecendo) {
            this.estado.aquecendo = false;
            this.pararControleManual();
            
            // Retomar aquecimento automático
            if (this.estado.processoIniciado && !this.estado.vidroPronto) {
                this.iniciarAquecimentoAutomatico();
            }
        }
    },

    iniciarResfriamento: function() {
        if (!this.estado.processoIniciado) return;
        
        this.estado.resfriando = true;
        this.estado.aquecendo = false;
        
        // Parar controle automático temporariamente
        if (this.estado.intervaloTemperatura) {
            clearInterval(this.estado.intervaloTemperatura);
        }

        mostrarAviso("Dica: Mantenha o botão pressionado para resfriar continuamente.", 3000);
        this.iniciarControleManual();
    },

    pararResfriamento: function() {
        if (this.estado.resfriando) {
            this.estado.resfriando = false;
            this.pararControleManual();
            
            // Retomar aquecimento automático
            if (this.estado.processoIniciado && !this.estado.vidroPronto) {
                this.iniciarAquecimentoAutomatico();
            }
        }
    },

    iniciarControleManual: function() {
        this.pararControleManual();
        
        this.estado.intervaloManual = setInterval(() => {
            let variacao = 0;
            
            if (this.estado.aquecendo) {
                variacao = 90;
            } else if (this.estado.resfriando) {
                variacao = -45;
            }
            
            // Aplicar variação de temperatura
            this.estado.temperatura = Math.max(25, Math.min(1800, this.estado.temperatura + variacao));
            
            // Atualizar interface
            this.atualizarBarraTemperatura();
            this.verificarZonaIdeal();

            const temperaturaDisplay = document.getElementById('temperaturaAtual');
            if (temperaturaDisplay) {
                temperaturaDisplay.textContent = `${Math.round(this.estado.temperatura)}°C`;
            }
            
        }, 1000);
    },

    pararControleManual: function() {
        if (this.estado.intervaloManual) {
            clearInterval(this.estado.intervaloManual);
            this.estado.intervaloManual = null;
        }
    },

    atualizarBotoesForno: function() {
        const btnColocarMistura = document.getElementById('btnColocarMisturaForno');
        const btnLigarForno = document.getElementById('btnLigarForno');

        if (btnColocarMistura) {
            const podeColocar = this.estado.misturaSelecionada && !this.estado.misturaColocada && !this.estado.processoIniciado;
            btnColocarMistura.disabled = !podeColocar;
        }

        if (btnLigarForno) {
            const podeLigar = this.estado.misturaColocada && !this.estado.processoIniciado;
            btnLigarForno.disabled = !podeLigar;
            btnLigarForno.textContent = podeLigar ? "🔥 Iniciar Fusão" : "Iniciar Fusão";
        }
    },

    ligarForno: function() {
        if (!this.estado.misturaColocada) return;

        if (!this.estado.processoIniciado) {
            this.estado.processoIniciado = true;
            this.iniciarAquecimentoAutomatico();
        }
    },

    atualizarBarraTemperatura: function() {
        const barra = document.getElementById('barraTemperatura');
        const fundoTermometro = document.getElementById('fundoTermometro');
        const temperaturaDisplay = document.getElementById('temperaturaAtual');
        const statusTemp = document.getElementById('statusTemperatura');

        if (!barra || !temperaturaDisplay) return;

        const percent = Math.min(100, (this.estado.temperatura / 1800) * 100);
        barra.style.height = `${percent}%`;

        // Cor fixa de preenchimento vermelho
        barra.style.background = '#e53935';
        barra.style.position = 'absolute';
        barra.style.bottom = '0';
        barra.style.left = '50%';
        barra.style.transform = 'translateX(-50%)';
        barra.style.width = '25px';
        barra.style.borderRadius = '5px';
        barra.style.transition = 'height 0.5s ease-in-out';

        // Usar imagem de fundo do termômetro
        if (fundoTermometro) {
            fundoTermometro.style.display = 'block';
            fundoTermometro.style.position = 'relative';
            fundoTermometro.style.zIndex = '0';
            barra.style.zIndex = '1';
        }

        // Atualiza texto e status
        temperaturaDisplay.textContent = `${Math.round(this.estado.temperatura)}°C`;

        if (this.estado.temperatura >= this.estado.temperaturaAlvo.min &&
            this.estado.temperatura <= this.estado.temperaturaAlvo.max) {
            if (statusTemp) {
                statusTemp.textContent = "Temperatura ideal!";
                statusTemp.style.color = "#27ae60";
            }
        } else if (this.estado.temperatura < this.estado.temperaturaAlvo.min) {
            if (statusTemp) {
                statusTemp.textContent = "Temperatura baixa";
                statusTemp.style.color = "#3498db";
            }
        } else {
            if (statusTemp) {
                statusTemp.textContent = "Temperatura alta";
                statusTemp.style.color = "#e74c3c";
            }
        }
    },

    verificarZonaIdeal: function() {
        const dentroZona = this.estado.temperatura >= this.estado.temperaturaAlvo.min && this.estado.temperatura <= this.estado.temperaturaAlvo.max;

        if (dentroZona) {
            this.estado.tempoEstavel++;
            this.estado.tempoEstavelTotal++;
            
            const tempoDisplay = document.getElementById('tempoEstavel');
            const progresso = document.getElementById('preenchimentoProgresso');
            
            if (tempoDisplay) {
                tempoDisplay.textContent = `Tempo estável acumulado: ${this.estado.tempoEstavelTotal}s`;
            }
            
            if (progresso) {
                const percentual = Math.min(100, (this.estado.tempoEstavelTotal / 30) * 100);
                progresso.style.width = percentual + '%';
            }

            // Quando acumula tempo suficiente, vidro fica pronto
            if (this.estado.tempoEstavelTotal >= 30 && !this.estado.vidroPronto) {
                this.estado.vidroPronto = true;
                this.mostrarFase('Coleta');
                
                // Parar todos os intervalos
                clearInterval(this.estado.intervaloTemperatura);
                this.pararControleManual();
            }
        } else {
            // Não resetar o tempoEstavelTotal quando sair da zona
            this.estado.tempoEstavel = 0;
            
            // Atualizar display para mostrar tempo total acumulado mesmo fora da zona
            const tempoDisplay = document.getElementById('tempoEstavel');
            const progresso = document.getElementById('preenchimentoProgresso');
            
            if (tempoDisplay) {
                tempoDisplay.textContent = `Tempo estável acumulado: ${this.estado.tempoEstavelTotal}s`;
            }
            
            if (progresso) {
                const percentual = Math.min(100, (this.estado.tempoEstavelTotal / 30) * 100);
                progresso.style.width = percentual + '%';
            }
        }
    },

    coletarVidro: function() {
        if (!this.estado.vidroPronto || !this.estado.misturaSelecionada) return;

        const conversao = {
            'misturaGarrafa250': 'vidroGarrafa250',
            'misturaGarrafa500': 'vidroGarrafa500',
            'misturaGarrafa2_5': 'vidroGarrafa2_5',
            'misturaPrato': 'vidroPrato',
            'misturaCopo': 'vidroCopo',
            'misturaRefratario': 'vidroRefratario'
        };

        const itemVidro = conversao[this.estado.misturaSelecionada];
        if (itemVidro) {
            SistemaInventario.adicionar(itemVidro, 1);
            mostrarAviso(`Vidro para ${this.getNomeMistura(this.estado.misturaSelecionada)} adicionado ao inventário!`);
            this.finalizarProcesso();
        }
    },

    resetar: function() {
        // Limpar todos os intervalos
        clearInterval(this.estado.intervaloTemperatura);
        this.pararControleManual();
        
        // Resetar estado
        this.estado = {
            fase: 'selecaoMistura',
            misturaSelecionada: null,
            temperatura: 25,
            temperaturaAlvo: { min: 1500, max: 1600 },
            tempoEstavel: 0,
            tempoEstavelTotal: 0,
            vidroPronto: false,
            misturaColocada: false,
            intervaloTemperatura: null,
            processoIniciado: false,
            aquecendo: false,
            resfriando: false,
            intervaloManual: null
        };
        
        this.mostrarFase('SelecaoMistura');
        this.atualizarInterface();
    },

    getNomeMistura: function(tipoMistura) {
        const nomes = {
            'misturaGarrafa250': 'Garrafa 250ml',
            'misturaGarrafa500': 'Garrafa 500ml',
            'misturaGarrafa2_5': 'Garrafa 2,5L',
            'misturaPrato': 'Prato',
            'misturaCopo': 'Copo',
            'misturaRefratario': 'Refratário'
        };
        return nomes[tipoMistura] || tipoMistura;
    }
};

// =============================================
// MÁQUINA IS - Lógica da Injetora e Sopradora (CORRIGIDA)
// =============================================

const ISLogica = {
    ...MaquinaBase,
    
    tipoMaquina: 'IS',
    
    estado: {
        fase: 'selecaoMolde',
        vidroSelecionado: null,
        tiposVidro: {
            'vidroGarrafa250': { nome: 'Garrafa 250ml', produto: 'garrafa250', peso: 150, icone: 'IMG/garrafa-250.png' },
            'vidroGarrafa500': { nome: 'Garrafa 500ml', produto: 'garrafa500', peso: 350, icone: 'IMG/garrafa-500.png' },
            'vidroGarrafa2_5': { nome: 'Garrafa 2,5L', produto: 'garrafa2_5', peso: 1000, icone: 'IMG/garrafa-2-5.png' },
            'vidroPrato': { nome: 'Prato', produto: 'prato', peso: 700, icone: 'IMG/prato.png' },
            'vidroCopo': { nome: 'Copo', produto: 'copo', peso: 400, icone: 'IMG/copo.png' },
            'vidroRefratario': { nome: 'Refratário', produto: 'refratario', peso: 1500, icone: 'IMG/refratario.png' }
        },
        minigameSopro: { 
            acertos: 0, 
            tentativas: 3, 
            posicaoSeta: 0, 
            direcao: 1,
            velocidade: 2,
            intervalo: null,
            zonaAlvo: { inicio: 40, fim: 55 },
            zonasPassadas: []
        },
        temperatura: 100,
        temperaturaAlvo: { min: 600, max: 650 },
        tempoEstavel: 0,
        tempoEstavelTotal: 0,
        vidroPronto: false,
        intervaloTemperatura: null,
        aquecendo: false,
        resfriando: false,
        intervaloManual: null,
        processoIniciado: false
    },

    inicializar: function() {
        this.configurarEventos();
        
        // Verificar se há processo em andamento fantasma
        if (this.estado.processoIniciado && this.estado.fase !== 'selecaoMolde') {
            this.resetar();
        }
        
        // Atualizar inventário imediamente
        this.atualizarQuantidadesVidros();
        this.atualizarInterface();
        
        // Configurar eventos dos botões de temperatura
        this.configurarBotoesTemperatura();
    },

    // Atualizar quantidades de vidro no display
    atualizarQuantidadesVidros: function() {
        const vidros = [
            'vidroGarrafa250', 'vidroGarrafa500', 'vidroGarrafa2_5',
            'vidroPrato', 'vidroCopo', 'vidroRefratario'
        ];

        vidros.forEach(tipoVidro => {
            const quantidade = SistemaInventario.obterQuantidade(tipoVidro);
            const elementoId = `quantidade${this.capitalizeFirst(tipoVidro)}`;
            const elemento = document.getElementById(elementoId);
            
            if (elemento) {
                elemento.textContent = quantidade;
            }
        });
    },

    configurarEventos: function() {
        // Configurar eventos de seleção de vidro
        document.querySelectorAll('.item-selecao[data-vidro]').forEach(item => {
            item.addEventListener('click', (e) => {
                const tipoVidro = e.currentTarget.dataset.vidro;
                this.selecionarVidro(tipoVidro);
            });
        });

        // Configurar botão de iniciar moldagem
        this.configurarBotao('btnIniciarMoldagemIS', () => this.iniciarMoldagem());
        this.configurarBotao('btnCliqueSopro', () => this.verificarCliqueSopro());
        
        // Configurar eventos dos botões de temperatura
        this.configurarBotoesTemperatura();

        this.configurarBotao('btnProximaGarrafa', () => this.proximaGarrafa());
        this.configurarBotao('btnVoltarSelecao', () => this.voltarSelecaoVidro());
    },

    selecionarVidro: function(tipoVidro) {
        if (!this.estado.tiposVidro[tipoVidro]) return;
        
        if (SistemaInventario.tem(tipoVidro)) {
            this.estado.vidroSelecionado = tipoVidro;
            
            document.querySelectorAll('.item-selecao[data-vidro]').forEach(item => {
                item.classList.remove('selecionado');
            });
            document.querySelector(`[data-vidro="${tipoVidro}"]`).classList.add('selecionado');
            
            // Atualizar quantidade no display após seleção
            this.atualizarQuantidadesVidros();
            
            // Atualizar info da receita selecionada
            const infoReceita = document.getElementById('infoReceitaSelecionadaIS');
            const vidroInfo = this.estado.tiposVidro[tipoVidro];
            if (infoReceita) {
                infoReceita.innerHTML = `
                    <strong>Molde Selecionado:</strong> ${vidroInfo.nome}<br>
                    <strong>Peso:</strong> ${vidroInfo.peso}g<br>
                    <strong>Produto Final:</strong> ${vidroInfo.nome}
                `;
                infoReceita.style.display = 'block';
            }
            
            this.atualizarInterface();
        }
    },

    voltarSelecaoVidro: function() {
        this.estado.vidroSelecionado = null;
        this.mostrarFase('SelecaoMolde');
        this.atualizarInterface();
    },

    iniciarMoldagem: function() {
        console.log('IS: iniciarMoldagem chamado');
        if (!this.estado.vidroSelecionado) return;

        if (SistemaInventario.tem(this.estado.vidroSelecionado)) {
            this.mostrarFase('SoproIS');
            this.iniciarMinigameSopro();
        }
    },

    iniciarMinigameSopro: function() {
        // Resetar estado do minigame
        this.estado.minigameSopro = { 
            acertos: 0, 
            tentativas: 3, 
            posicaoSeta: 0, 
            direcao: 1,
            velocidade: 2,
            intervalo: null,
            zonaAlvo: this.gerarNovaZonaAlvo(),
            zonasPassadas: []
        };
        
        this.estado.minigameSopro.intervalo = setInterval(() => {
            const mg = this.estado.minigameSopro;
            
            // Mover a seta
            mg.posicaoSeta += mg.velocidade * mg.direcao;
            
            // Inverter direção se atingir os limites
            if (mg.posicaoSeta >= 100) {
                mg.posicaoSeta = 100;
                mg.direcao = -1;
            } else if (mg.posicaoSeta <= 0) {
                mg.posicaoSeta = 0;
                mg.direcao = 1;
            }
            
            this.atualizarInterface();
        }, 50);
    },

    gerarNovaZonaAlvo: function() {
        const mg = this.estado.minigameSopro;
        const larguraZona = 15;
        
        let novaZona;
        let tentativas = 0;
        const maxTentativas = 10;
        
        do {
            const inicio = 10 + Math.random() * 65;
            novaZona = {
                inicio: Math.round(inicio),
                fim: Math.round(inicio + larguraZona)
            };
            tentativas++;
        } while (
            this.zonaRepetida(novaZona, mg.zonasPassadas) && 
            tentativas < maxTentativas
        );
        
        mg.zonasPassadas.push({...novaZona});
        if (mg.zonasPassadas.length > 3) {
            mg.zonasPassadas.shift();
        }
        
        return novaZona;
    },

    zonaRepetida: function(novaZona, zonasPassadas) {
        return zonasPassadas.some(zona => {
            const centroNova = (novaZona.inicio + novaZona.fim) / 2;
            const centroPassada = (zona.inicio + zona.fim) / 2;
            const distancia = Math.abs(centroNova - centroPassada);
            return distancia < 20;
        });
    },

    verificarCliqueSopro: function() {
        const mg = this.estado.minigameSopro;

        // 🔊 SOM DO BOTÃO DE INJETAR AR (IS)
        try {
            if (typeof somISA !== "undefined") {
                somISA.currentTime = 0;
                somISA.play().catch(()=>{});
            }
        } catch(e) {
            console.warn("Erro ao tentar tocar som ISA:", e);
        }
        
        const inicioZona = Math.min(mg.zonaAlvo.inicio, mg.zonaAlvo.fim);
        const fimZona = Math.max(mg.zonaAlvo.inicio, mg.zonaAlvo.fim);
        
        // VERIFICA SE O TRIÂNGULO ESTÁ NA ZONA
        const naZona = mg.posicaoSeta >= inicioZona && mg.posicaoSeta <= fimZona;
        
        if (naZona) {
            mostrarAviso("Pressão correta! Bom trabalho.", 1500);
            mg.acertos++;
            
            // Aumentar velocidade gradualmente
            mg.velocidade += 0.5;
            
            // Gerar nova zona alvo (se ainda não completou)
            if (mg.acertos < 4) {
                mg.zonaAlvo = this.gerarNovaZonaAlvo();
            }
            
            // Efeito visual de acerto
            const zonaAlvo = document.getElementById('zonaAlvoSopro');
            const seta = document.getElementById('setaSopro');
            if (zonaAlvo) {
                zonaAlvo.style.background = 'rgba(39, 174, 96, 0.8)';
                zonaAlvo.style.boxShadow = '0 0 20px rgba(39, 174, 96, 0.8)';
                setTimeout(() => {
                    zonaAlvo.style.background = 'rgba(39, 174, 96, 0.4)';
                    zonaAlvo.style.boxShadow = '0 0 15px rgba(39, 174, 96, 0.6)';
                }, 200);
            }
            if (seta) {
                seta.style.borderTopColor = '#27ae60';
                setTimeout(() => {
                    seta.style.borderTopColor = '#e74c3c';
                }, 200);
            }
            
            if (mg.acertos >= 4) {
                mostrarAviso("Fase de sopro concluída com sucesso!", 2000);
                clearInterval(mg.intervalo);
                this.iniciarFaseTemperatura();
            }
        } else {
            mg.tentativas--;
            mostrarAviso(`Pressão incorreta! Tentativas restantes: ${mg.tentativas}`, 1500);
            // Efeito visual de erro
            const zonaAlvo = document.getElementById('zonaAlvoSopro');
            const seta = document.getElementById('setaSopro');
            if (zonaAlvo) {
                zonaAlvo.style.background = 'rgba(231, 76, 60, 0.6)';
                zonaAlvo.style.boxShadow = '0 0 20px rgba(231, 76, 60, 0.8)';
                setTimeout(() => {
                    zonaAlvo.style.background = 'rgba(39, 174, 96, 0.4)';
                    zonaAlvo.style.boxShadow = '0 0 15px rgba(39, 174, 96, 0.6)';
                }, 200);
            }
            if (seta) {
                seta.style.borderTopColor = '#e67e22';
                setTimeout(() => {
                    seta.style.borderTopColor = '#e74c3c';
                }, 200);
            }
            
            // Quando as tentativas acabam, interromper
            if (mg.tentativas <= 0) {
                clearInterval(mg.intervalo);
                mostrarAviso("Você falhou. Tente novamente.", 2000);
                this.falharMoldagem();
            }
        }
        this.atualizarInterface();
    },

    iniciarFaseTemperatura: function() {
        this.mostrarFase('TemperaturaIS');
        
        this.estado.temperatura = 100;
        this.estado.processoIniciado = true;
        
        this.atualizarBarraTemperaturaIS();
        
        const temperaturaDisplay = document.getElementById('temperaturaAtualIS');
        if (temperaturaDisplay) {
            temperaturaDisplay.textContent = `${Math.round(this.estado.temperatura)}°C`;
        }
        
        // Reconfigurar eventos dos botões quando entrar na fase de temperatura
        setTimeout(() => {
            this.configurarBotoesTemperatura();
            this.ativarBotoesTemperatura();
            this.iniciarControleTemperatura();
        }, 100);
    },

    configurarBotoesTemperatura: function() {
        const btnEsquentar = document.getElementById('btnEsquentarIS');
        const btnResfriar = document.getElementById('btnResfriarIS');
        
        if (btnEsquentar) {
            // Remover event listeners existentes para evitar duplicação
            btnEsquentar.replaceWith(btnEsquentar.cloneNode(true));
            const novoBtnEsquentar = document.getElementById('btnEsquentarIS');
            
            novoBtnEsquentar.addEventListener('mousedown', () => this.iniciarAquecimento());
            novoBtnEsquentar.addEventListener('mouseup', () => this.pararAquecimento());
            novoBtnEsquentar.addEventListener('mouseleave', () => this.pararAquecimento());
        }
        
        if (btnResfriar) {
            // Remover event listeners existentes para evitar duplicação
            btnResfriar.replaceWith(btnResfriar.cloneNode(true));
            const novoBtnResfriar = document.getElementById('btnResfriarIS');
            
            novoBtnResfriar.addEventListener('mousedown', () => this.iniciarResfriamento());
            novoBtnResfriar.addEventListener('mouseup', () => this.pararResfriamento());
            novoBtnResfriar.addEventListener('mouseleave', () => this.pararResfriamento());
        }
    },

    ativarBotoesTemperatura: function() {
        const btnEsquentar = document.getElementById('btnEsquentarIS');
        const btnResfriar = document.getElementById('btnResfriarIS');
        
        if (btnEsquentar && btnResfriar) {
            btnEsquentar.disabled = false;
            btnResfriar.disabled = false;
        }
    },

    // Métodos de controle de temperatura
    iniciarAquecimento: function() {
        if (!this.estado.processoIniciado || this.estado.vidroPronto) return;
        mostrarAviso("Dica: Mantenha o botão pressionado para aquecer continuamente.", 3000);
        
        this.estado.aquecendo = true;
        this.estado.resfriando = false;
        
        // Parar controle automático temporariamente
        if (this.estado.intervaloTemperatura) {
            clearInterval(this.estado.intervaloTemperatura);
            this.estado.intervaloTemperatura = null;
        }
        
        this.iniciarControleManual();
    },

    pararAquecimento: function() {
        if (this.estado.aquecendo) {
            this.estado.aquecendo = false;
            this.pararControleManual();
            
            // Retomar controle automático
            if (this.estado.processoIniciado && !this.estado.vidroPronto) {
                this.iniciarControleTemperatura();
            }
        }
    },

    iniciarResfriamento: function() {
        if (!this.estado.processoIniciado || this.estado.vidroPronto) return;
        mostrarAviso("Dica: Mantenha o botão pressionado para resfriar continuamente.", 3000);
        
        this.estado.resfriando = true;
        this.estado.aquecendo = false;
        
        // Parar controle automático temporariamente
        if (this.estado.intervaloTemperatura) {
            clearInterval(this.estado.intervaloTemperatura);
            this.estado.intervaloTemperatura = null;
        }
        
        this.iniciarControleManual();
    },

    pararResfriamento: function() {
        if (this.estado.resfriando) {
            this.estado.resfriando = false;
            this.pararControleManual();
            
            // Retomar controle automático
            if (this.estado.processoIniciado && !this.estado.vidroPronto) {
                this.iniciarControleTemperatura();
            }
        }
    },

    iniciarControleManual: function() {
        this.pararControleManual();
        
        this.estado.intervaloManual = setInterval(() => {
            let variacao = 0;
            
            if (this.estado.aquecendo) {
                variacao = 45;
            } else if (this.estado.resfriando) {
                variacao = -18;
            } else {
                // Se nenhum botão está pressionado, parar o intervalo
                this.pararControleManual();
                return;
            }
            
            // Aplicar variação de temperatura
            this.estado.temperatura = Math.max(25, Math.min(800, this.estado.temperatura + variacao));
            
            // Atualizar interface
            this.atualizarBarraTemperaturaIS();
            this.verificarZonaIdealIS();

            const temperaturaDisplay = document.getElementById('temperaturaAtualIS');
            if (temperaturaDisplay) {
                temperaturaDisplay.textContent = `${Math.round(this.estado.temperatura)}°C`;
            }
            
            // Verificar se atingiu a meta (10 segundos na zona)
            if (this.estado.tempoEstavelTotal >= 10 && !this.estado.vidroPronto) {
                this.finalizarMoldagem();
            }
            
        }, 1000);
    },

    pararControleManual: function() {
        if (this.estado.intervaloManual) {
            clearInterval(this.estado.intervaloManual);
            this.estado.intervaloManual = null;
        }
    },

    iniciarControleTemperatura: function() {
        // Limpar intervalo existente
        if (this.estado.intervaloTemperatura) {
            clearInterval(this.estado.intervaloTemperatura);
        }
        
        this.estado.intervaloTemperatura = setInterval(() => {
            // Apenas variar temperatura se não estiver em controle manual
            if (!this.estado.aquecendo && !this.estado.resfriando) {
                const variacao = 2 + (Math.random() * 3);
                this.estado.temperatura = Math.max(25, Math.min(800, this.estado.temperatura + variacao));

                this.atualizarBarraTemperaturaIS();
                this.verificarZonaIdealIS();

                const temperaturaDisplay = document.getElementById('temperaturaAtualIS');
                if (temperaturaDisplay) {
                    temperaturaDisplay.textContent = `${Math.round(this.estado.temperatura)}°C`;
                }
            }

            // Meta de 10 segundos na zona ideal
            if (this.estado.tempoEstavelTotal >= 10 && !this.estado.vidroPronto) {
                this.finalizarMoldagem();
            }
        }, 1000);
    },

    atualizarBarraTemperaturaIS: function() {
        const barra = document.getElementById('barraTemperaturaIS');
        const fundoTermometro = document.getElementById('fundoTermometroIS');
        const temperaturaDisplay = document.getElementById('temperaturaAtualIS');
        const statusTemp = document.getElementById('statusTemperaturaIS');

        if (!barra || !temperaturaDisplay) return;

        const percent = Math.min(100, (this.estado.temperatura / 800) * 100);
        barra.style.height = `${percent}%`;

        barra.style.background = '#e53935';
        barra.style.position = 'absolute';
        barra.style.bottom = '0';
        barra.style.left = '50%';
        barra.style.transform = 'translateX(-50%)';
        barra.style.width = '25px';
        barra.style.borderRadius = '5px';
        barra.style.transition = 'height 0.5s ease-in-out';

        if (fundoTermometro) {
            fundoTermometro.style.display = 'block';
            fundoTermometro.style.position = 'relative';
            fundoTermometro.style.zIndex = '0';
            barra.style.zIndex = '1';
        }

        temperaturaDisplay.textContent = `${Math.round(this.estado.temperatura)}°C`;

        if (this.estado.temperatura >= this.estado.temperaturaAlvo.min &&
            this.estado.temperatura <= this.estado.temperaturaAlvo.max) {
            if (statusTemp) {
                statusTemp.textContent = "Temperatura ideal!";
                statusTemp.style.color = "#27ae60";
            }
        } else if (this.estado.temperatura < this.estado.temperaturaAlvo.min) {
            if (statusTemp) {
                statusTemp.textContent = "Temperatura baixa";
                statusTemp.style.color = "#3498db";
            }
        } else {
            if (statusTemp) {
                statusTemp.textContent = "Temperatura alta";
                statusTemp.style.color = "#e74c3c";
            }
        }
    },

    verificarZonaIdealIS: function() {
        const dentroZona = this.estado.temperatura >= this.estado.temperaturaAlvo.min &&
                           this.estado.temperatura <= this.estado.temperaturaAlvo.max;

        if (dentroZona) {
            this.estado.tempoEstavel++;
            this.estado.tempoEstavelTotal++;
            
            const tempoDisplay = document.getElementById('tempoEstavelIS');
            const progresso = document.getElementById('preenchimentoProgressoIS');
            
            if (tempoDisplay) {
                tempoDisplay.textContent = `Tempo estável acumulado: ${this.estado.tempoEstavelTotal}s`;
            }
            
            if (progresso) {
                const percentual = Math.min(100, (this.estado.tempoEstavelTotal / 10) * 100);
                progresso.style.width = percentual + '%';
            }

            // Quando acumula 10 segundos, vidro fica pronto
            if (this.estado.tempoEstavelTotal >= 10 && !this.estado.vidroPronto) {
                this.estado.vidroPronto = true;
                this.finalizarMoldagem();
            }
        } else {
            // Não resetar o tempoEstavelTotal quando sair da zona
            this.estado.tempoEstavel = 0;
            
            // Atualizar display para mostrar tempo total acumulado mesmo fora da zona
            const tempoDisplay = document.getElementById('tempoEstavelIS');
            const progresso = document.getElementById('preenchimentoProgressoIS');
            
            if (tempoDisplay) {
                tempoDisplay.textContent = `Tempo estável acumulado: ${this.estado.tempoEstavelTotal}s`;
            }
            
            if (progresso) {
                const percentual = Math.min(100, (this.estado.tempoEstavelTotal / 10) * 100);
                progresso.style.width = percentual + '%';
            }
        }
    },

    // Finalizar moldagem produzindo produto relativo ao molde
    finalizarMoldagem: function() {
        // Parar todos os intervalos
        clearInterval(this.estado.intervaloTemperatura);
        this.pararControleManual();
        
        this.estado.vidroPronto = true;
        this.estado.processoIniciado = false;
        
        if (SistemaInventario.tem(this.estado.vidroSelecionado)) {
            // Remover o vidro do inventário
            SistemaInventario.remover(this.estado.vidroSelecionado, 1);
            
            // Adicionar produto relativo ao molde selecionado
            const vidroInfo = this.estado.tiposVidro[this.estado.vidroSelecionado];
            const produtoFinal = vidroInfo.produto;
            
            // Adicionar o produto específico ao inventário
            SistemaInventario.adicionar(produtoFinal, 1);
            
            // Atualizar a imagem do produto final
            this.mostrarResultadoComImagem(vidroInfo);
        } else {
            this.falharMoldagem();
        }
    },

    mostrarResultadoComImagem: function(vidroInfo) {
        // Mapeamento das imagens dos produtos finais
        const imagensProdutos = {
            'garrafa250': 'IMG/garrafa-250.png',
            'garrafa500': 'IMG/garrafa-500.png',
            'garrafa2_5': 'IMG/garrafa-2-5.png',
            'prato': 'IMG/prato.png',
            'copo': 'IMG/copo.png',
            'refratario': 'IMG/refratario.png'
        };

        // Configurar a imagem do produto final
        const imagemProduto = document.getElementById('imagemProdutoFinalIS');
        if (imagemProduto && imagensProdutos[vidroInfo.produto]) {
            imagemProduto.src = imagensProdutos[vidroInfo.produto];
            imagemProduto.alt = vidroInfo.nome;
        }

        // Atualizar mensagem de sucesso
        const resultadoSucesso = document.getElementById('resultadoSucessoIS');
        if (resultadoSucesso) {
            resultadoSucesso.textContent = `✅ ${vidroInfo.nome} produzido com sucesso!`;
        }

        // Configurar botão de fechar
        this.configurarBotaoFecharResultado();

        this.mostrarFase('ResultadoIS');
        this.atualizarInterface();
    },

    configurarBotaoFecharResultado: function() {
        const btnFechar = document.getElementById('btnFecharResultadoIS');
        if (btnFechar) {
            btnFechar.onclick = () => {
                mostrarAviso(`${this.estado.tiposVidro[this.estado.vidroSelecionado].nome} adicionado ao inventário!`);
                this.finalizarProcesso();
            };
        }
    },

    falharMoldagem: function() {
        this.finalizarProcessoComFalha();
    },

    finalizarProcessoComFalha: function() {
        // 1. Parar todos os intervalos
        this.pararTodosIntervalos();
        
        // 2. Resetar estado da máquina completamente
        this.resetar();
        
        // 3. Fechar a modal
        const modal = document.getElementById('modalMaquina');
        if (modal) {
            modal.style.display = 'none';
        }
        
        // 4. Notificar o gerenciador
        if (window.GerenciadorMaquinas && this.tipoMaquina) {
            GerenciadorMaquinas.finalizarProcesso(this.tipoMaquina);
        }
        
        // 5. Garantir que o botão de fechar seja restaurado
        this.restaurarBotaoFechar();
    },

    pararTodosIntervalos: function() {
        // Parar intervalo do minigame de sopro
        if (this.estado.minigameSopro.intervalo) {
            clearInterval(this.estado.minigameSopro.intervalo);
            this.estado.minigameSopro.intervalo = null;
        }
        
        // Parar intervalos de temperatura
        this.pararControleManual();
        
        // Parar controle automático de temperatura
        if (this.estado.intervaloTemperatura) {
            clearInterval(this.estado.intervaloTemperatura);
            this.estado.intervaloTemperatura = null;
        }
    },

    resetar: function() {
        // Usar o método para parar todos os intervalos
        this.pararTodosIntervalos();
        
        // RESETAR COMPLETAMENTE o estado
        this.estado = {
            fase: 'selecaoMolde',
            vidroSelecionado: null,
            tiposVidro: {
                'vidroGarrafa250': { nome: 'Garrafa 250ml', produto: 'garrafa250', peso: 150, icone: 'IMG/garrafa-250.png' },
                'vidroGarrafa500': { nome: 'Garrafa 500ml', produto: 'garrafa500', peso: 350, icone: 'IMG/garrafa-500.png' },
                'vidroGarrafa2_5': { nome: 'Garrafa 2,5L', produto: 'garrafa2_5', peso: 1000, icone: 'IMG/garrafa-2-5.png' },
                'vidroPrato': { nome: 'Prato', produto: 'prato', peso: 700, icone: 'IMG/prato.png' },
                'vidroCopo': { nome: 'Copo', produto: 'copo', peso: 400, icone: 'IMG/copo.png' },
                'vidroRefratario': { nome: 'Refratário', produto: 'refratario', peso: 1500, icone: 'IMG/refratario.png' }
            },
            minigameSopro: { 
                acertos: 0, 
                tentativas: 3, 
                posicaoSeta: 0, 
                direcao: 1,
                velocidade: 2,
                intervalo: null,
                zonaAlvo: { inicio: 40, fim: 55 },
                zonasPassadas: []
            },
            temperatura: 100,
            temperaturaAlvo: { min: 600, max: 650 },
            tempoEstavel: 0,
            tempoEstavelTotal: 0,
            vidroPronto: false,
            intervaloTemperatura: null,
            aquecendo: false,
            resfriando: false,
            intervaloManual: null,
            processoIniciado: false
        };
    },

   atualizarInterface: function() {
        // Atualizar minigame de sopro - SETA ABAIXO DA BARRA
        const seta = document.getElementById('setaSopro');
        const zonaAlvo = document.getElementById('zonaAlvoSopro');
        const mg = this.estado.minigameSopro;
        
        if (seta) {
            // Calcular posição baseada na largura do container (500px máximo)
            const posicaoX = (mg.posicaoSeta / 100) * 500;
            seta.style.left = posicaoX + 'px';
            
            // Remover transformação de rotação pois agora é um triângulo fixo
            seta.style.transform = 'translateX(-50%)';
            
            // ATUALIZAR A LINHA VERMELHA DENTRO DA BARRA
            const barra = document.querySelector('.barra-sopro');
            if (barra) {
                barra.style.setProperty('--posicao-linha', mg.posicaoSeta + '%');
            }
        }
        
        if (zonaAlvo && mg.zonaAlvo) {
            const inicio = Math.min(mg.zonaAlvo.inicio, mg.zonaAlvo.fim);
            const fim = Math.max(mg.zonaAlvo.inicio, mg.zonaAlvo.fim);
            const larguraZona = fim - inicio;
            
            zonaAlvo.style.left = inicio + '%';
            zonaAlvo.style.width = larguraZona + '%';
        }

        this.atualizarElemento('acertosAtuais', mg.acertos);
        this.atualizarElemento('tentativasRestantes', mg.tentativas);
        this.atualizarElemento('temperaturaAtualIS', Math.round(this.estado.temperatura) + '°C');
        
        // Atualizar quantidades de vidro no inventário
        Object.keys(this.estado.tiposVidro).forEach(tipoVidro => {
            const quantidade = SistemaInventario.obterQuantidade(tipoVidro);
            const elementoQuantidade = document.getElementById(`quantidade${this.capitalizeFirst(tipoVidro)}`);
            if (elementoQuantidade) {
                elementoQuantidade.textContent = quantidade;
            }
        });

        // Atualizar barra de progresso da temperatura (meta: 10 segundos)
        const progresso = document.getElementById('preenchimentoProgressoIS');
        if (progresso) {
            const percentual = Math.min(100, (this.estado.tempoEstavelTotal / 10) * 100);
            progresso.style.width = percentual + '%';
        }

        // Atualizar botão de iniciar moldagem
        const btnIniciarMoldagem = document.getElementById('btnIniciarMoldagemIS');
        if (btnIniciarMoldagem) {
            const temVidroSelecionado = this.estado.vidroSelecionado !== null;
            const naFaseSelecao = this.estado.fase === 'selecaoMolde';
            const temVidroNoInventario = temVidroSelecionado ? 
                SistemaInventario.tem(this.estado.vidroSelecionado) : false;
            const processoNaoIniciado = !this.estado.processoIniciado;
            
            btnIniciarMoldagem.disabled = !(temVidroSelecionado && naFaseSelecao && temVidroNoInventario && processoNaoIniciado);
        }

        // Atualizar status do molde
        const statusMolde = document.getElementById('statusMolde');
        if (statusMolde) {
            if (this.estado.fase === 'selecaoMolde') {
                if (this.estado.vidroSelecionado) {
                    const vidroInfo = this.estado.tiposVidro[this.estado.vidroSelecionado];
                    const quantidade = SistemaInventario.obterQuantidade(this.estado.vidroSelecionado);
                    statusMolde.textContent = `Selecionado: ${vidroInfo.nome} - ${quantidade} disponível(is) - Produto: ${vidroInfo.nome}`;
                    statusMolde.className = "status-molde pronto";
                } else {
                    statusMolde.textContent = "Selecione um molde para começar";
                    statusMolde.className = "status-molde aguardando";
                }
            } else if (this.estado.fase === 'soproIS') {
                statusMolde.textContent = `Fase de sopro: ${mg.acertos}/4 acertos - ${mg.tentativas} tentativas restantes`;
                statusMolde.className = "status-molde processando";
            } else if (this.estado.fase === 'temperaturaIS') {
                statusMolde.textContent = `Controlando temperatura: ${this.estado.tempoEstavelTotal}/10s na zona ideal (600-650°C)`;
                statusMolde.className = "status-molde processando";
            } else {
                statusMolde.textContent = "Processo em andamento...";
                statusMolde.className = "status-molde processando";
            }
        }

        // Atualizar resultado de sucesso com produto específico
        const resultadoSucesso = document.getElementById('resultadoSucessoIS');
        if (resultadoSucesso && this.estado.vidroSelecionado && this.estado.fase === 'resultadoIS') {
            const vidroInfo = this.estado.tiposVidro[this.estado.vidroSelecionado];
            resultadoSucesso.textContent = `✅ ${vidroInfo.nome} produzido com sucesso!`;
        }

        // Atualizar informações da receita selecionada
        const infoReceita = document.getElementById('infoReceitaSelecionadaIS');
        if (infoReceita) {
            if (this.estado.vidroSelecionado) {
                const vidroInfo = this.estado.tiposVidro[this.estado.vidroSelecionado];
                const quantidade = SistemaInventario.obterQuantidade(this.estado.vidroSelecionado);
                infoReceita.innerHTML = `
                    <strong>Molde Selecionado:</strong> ${vidroInfo.nome}<br>
                    <strong>Peso:</strong> ${vidroInfo.peso}g<br>
                    <strong>Produto Final:</strong> ${vidroInfo.nome}<br>
                    <strong>Disponível no inventário:</strong> ${quantidade}
                `;
                infoReceita.style.display = 'block';
            } else {
                infoReceita.style.display = 'none';
            }
        }

        // Atualizar botão voltar
        const btnVoltarSelecao = document.getElementById('btnVoltarSelecao');
        if (btnVoltarSelecao) {
            btnVoltarSelecao.style.display = (this.estado.fase === 'soproIS' || this.estado.fase === 'temperaturaIS') ? 'inline-block' : 'none';
        }

        // Atualizar quantidades de vidro no inventário
        this.atualizarQuantidadesVidros();

        // Atualizar barra de temperatura
        this.atualizarBarraTemperaturaIS();
        
        // Atualizar contador de produtos produzidos
        if (this.estado.vidroSelecionado && this.estado.fase === 'resultadoIS') {
            const vidroInfo = this.estado.tiposVidro[this.estado.vidroSelecionado];
            const produtoQuantidade = SistemaInventario.obterQuantidade(vidroInfo.produto);
            this.atualizarElemento('contadorGarrafas', produtoQuantidade);
        }

        // Atualizar tempo estável display (meta: 10 segundos)
        const tempoDisplay = document.getElementById('tempoEstavelIS');
        if (tempoDisplay) {
            tempoDisplay.textContent = `Tempo estável acumulado: ${this.estado.tempoEstavelTotal}s`;
        }

        // Atualizar botões de temperatura
        const btnEsquentar = document.getElementById('btnEsquentarIS');
        const btnResfriar = document.getElementById('btnResfriarIS');
        if (btnEsquentar && btnResfriar) {
            const processoAtivo = this.estado.fase === 'temperaturaIS' && this.estado.processoIniciado && !this.estado.vidroPronto;
            btnEsquentar.disabled = !processoAtivo;
            btnResfriar.disabled = !processoAtivo;
            
            // Feedback visual dos botões pressionados
            if (this.estado.aquecendo) {
                btnEsquentar.classList.add('ativo');
            } else {
                btnEsquentar.classList.remove('ativo');
            }
            
            if (this.estado.resfriando) {
                btnResfriar.classList.add('ativo');
            } else {
                btnResfriar.classList.remove('ativo');
            }
        }
    }
};

// =============================================
// SCANNER - Lógica do Scanner de Qualidade (FINAL, CORRIGIDA)
// =============================================
const ScannerLogica = {
    ...MaquinaBase,

    tipoMaquina: 'scanner',

    estado: {
        fase: 'selecaoProdutos',
        produtoSelecionado: null,
        tiposProdutos: {
            'garrafa250': { nome: 'Garrafa 250ml', icone: 'IMG/garrafa-base.png', base: 'IMG/garrafa-base.png',
                estados: {
                    'premium': { imagem: 'IMG/garrafa-premium.png', defeitos: [0,1], brilho: [80,100], riscos: [0,1] },
                    'padrao' : { imagem: 'IMG/garrafa-padrao.png' , defeitos: [1,3], brilho: [50,80], riscos: [1,3] },
                    'defeituoso': { imagem: 'IMG/garrafa-defeituoso.png', defeitos: [4,9], brilho: [20,50], riscos: [4,9] }
                }
            },
            'garrafa500': { nome: 'Garrafa 500ml', icone: 'IMG/garrafa-base.png', base: 'IMG/garrafa-500.png',
                estados: {
                    'premium': { imagem: 'IMG/garrafa-premium.png', defeitos: [0,1], brilho: [80,100], riscos: [0,1] },
                    'padrao' : { imagem: 'IMG/garrafa-padrao.png' , defeitos: [1,3], brilho: [50,80], riscos: [1,3] },
                    'defeituoso': { imagem: 'IMG/garrafa-defeituoso.png', defeitos: [4,9], brilho: [20,50], riscos: [4,9] }
                }
            },
            'garrafa2_5': { nome: 'Garrafa 2,5L', icone: 'IMG/garrafa-base.png', base: 'IMG/garrafa-2-5.png',
                estados: {
                    'premium': { imagem: 'IMG/garrafa-premium.png', defeitos: [0,1], brilho: [80,100], riscos: [0,1] },
                    'padrao' : { imagem: 'IMG/garrafa-padrao.png' , defeitos: [1,3], brilho: [50,80], riscos: [1,3] },
                    'defeituoso': { imagem: 'IMG/garrafa-defeituoso.png', defeitos: [4,9], brilho: [20,50], riscos: [4,9] }
                }
            },
            'copo': { nome: 'Copo', icone: 'IMG/copo-base.png', base: 'IMG/copo-base.png',
                estados: {
                    'premium': { imagem: 'IMG/copo-premium.png', defeitos: [0,1], brilho: [80,100], riscos: [0,1] },
                    'padrao' : { imagem: 'IMG/copo-padrao.png' , defeitos: [1,3], brilho: [50,80], riscos: [1,3] },
                    'defeituoso': { imagem: 'IMG/copo-defeituoso.png', defeitos: [4,9], brilho: [20,50], riscos: [4,9] }
                }
            },
            'prato': { nome: 'Prato', icone: 'IMG/prato-base.png', base: 'IMG/prato-base.png',
                estados: {
                    'premium': { imagem: 'IMG/prato-premium.png', defeitos: [0,1], brilho: [80,100], riscos: [0,1] },
                    'padrao' : { imagem: 'IMG/prato-padrao.png' , defeitos: [1,3], brilho: [50,80], riscos: [1,3] },
                    'defeituoso': { imagem: 'IMG/prato-defeituoso.png', defeitos: [4,9], brilho: [20,50], riscos: [4,9] }
                }
            },
            'refratario': { nome: 'Refratário', icone: 'IMG/refratario-base.png', base: 'IMG/refratario-base.png',
                estados: {
                    'premium': { imagem: 'IMG/refratario-premium.png', defeitos: [0,1], brilho: [80,100], riscos: [0,1] },
                    'padrao' : { imagem: 'IMG/refratario-padrao.png' , defeitos: [1,3], brilho: [50,80], riscos: [1,3] },
                    'defeituoso': { imagem: 'IMG/refratario-defeituoso.png', defeitos: [4,9], brilho: [20,50], riscos: [4,9] }
                }
            },
        },

        estadoAtualProduto: null,
        infoEstadoAtual: null,
        defeitosRevelados: 0,
        brilho: 0,
        riscos: 0,

        classificacaoJogador: null,
        minigameAtivo: false,
        canvas: null,
        ctx: null,
        imgFundo: null,
        imgTopo: null,
        ferramenta: null,
        apagando: false,
        efeitoConcluido: false,
        totalPixelsImagem: 0,
        originalImageData: null,
        progressoReal: 0,
        progressoVisual: 0,
        imagemCarregada: false,
        debug: { ultimaVerificacao: 0 },
        
        // NOVO: Armazenar referências dos event listeners para limpeza adequada
        eventListeners: {
            docMove: null,
            mouseenter: null,
            mouseleave: null,
            mouseDown: null,
            mouseUp: null,
            mouseMove: null
        }
    },

    inicializar: function() {
        this.configurarEventos();
        this.atualizarQuantidadesProdutos();
        this.atualizarInterface();
    },

    configurarEventos: function() {
        document.querySelectorAll('.item-selecao[data-produto]').forEach(item => {
            item.addEventListener('click', (e) => {
                const tipo = e.currentTarget.dataset.produto;
                this.selecionarProduto(tipo);
            });
        });

        // CORREÇÃO AQUI - Configurar botão de iniciar escaneamento
        this.configurarBotao('btnIniciarEscaneamentoScanner', () => this.iniciarEscaneamento());
        this.configurarBotao('btnAbrirPrancheta', () => this.abrirPrancheta());
        this.configurarBotao('btnFecharPrancheta', () => this.fecharPrancheta());
        this.configurarBotao('btnEnviarClassificacao', () => this.submeterClassificacao());
        this.configurarBotao('btnFinalizarLoteScanner', () => this.finalizarLoteScanner());
        
        document.addEventListener('change', (e) => {
            if (e.target.name === 'classificacaoScanner') {
                this.verificarClassificacaoSelecionada();
            }
        });
    },

    // Adicione este método para verificar se uma classificação foi selecionada
    verificarClassificacaoSelecionada: function() {
        const radios = document.getElementsByName('classificacaoScanner');
        const btnEnviar = document.getElementById('btnEnviarClassificacao');
        
        if (btnEnviar) {
            const algumSelecionado = Array.from(radios).some(radio => radio.checked);
            btnEnviar.disabled = !(algumSelecionado && this.estado.efeitoConcluido);
        }
    },

    selecionarProduto: function(tipoProduto) {
        if (!this.estado.tiposProdutos[tipoProduto]) return;
        if (!SistemaInventario.tem(tipoProduto)) return;

        this.estado.produtoSelecionado = tipoProduto;
        document.querySelectorAll('.item-selecao[data-produto]').forEach(i => i.classList.remove('selecionado'));
        const el = document.querySelector(`[data-produto="${tipoProduto}"]`);
        if (el) el.classList.add('selecionado');
        this.atualizarInterface();
    },

    iniciarEscaneamento: function() {
        console.log('Scanner: iniciarEscaneamento chamado');
        if (!this.estado.produtoSelecionado) return;
        if (!SistemaInventario.tem(this.estado.produtoSelecionado)) return;

        this.gerarEstadoAleatorioProduto();
        this.iniciarMinigameScratch();
    },

    gerarEstadoAleatorioProduto: function() {
        const random = Math.random();
        if (random < 0.1) this.estado.estadoAtualProduto = 'defeituoso';
        else if (random < 0.8) this.estado.estadoAtualProduto = 'padrao';
        else this.estado.estadoAtualProduto = 'premium';

        const info = this.estado.tiposProdutos[this.estado.produtoSelecionado].estados[this.estado.estadoAtualProduto];
        this.estado.infoEstadoAtual = info;

        this.estado.defeitosRevelados = this.gerarNumeroAleatorio(info.defeitos[0], info.defeitos[1]);
        this.estado.brilho = this.gerarNumeroAleatorio(info.brilho[0], info.brilho[1]);
        this.estado.riscos = this.gerarNumeroAleatorio(info.riscos[0], info.riscos[1]);
    },

    gerarNumeroAleatorio: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    iniciarMinigameScratch: function() {
        this.mostrarFase('MinigameScanner');

        this.estado.minigameAtivo = true;
        this.estado.efeitoConcluido = false;
        this.estado.imagemCarregada = false;
        this.estado.progressoReal = 0;
        this.estado.progressoVisual = 0;
        this.estado.totalPixelsImagem = 0;
        this.estado.originalImageData = null;
        this.estado.debug.ultimaVerificacao = 0;

        // botão de enviar classificação começa bloqueado
        const btnEnviar = document.getElementById('btnEnviarClassificacao');
        if (btnEnviar) btnEnviar.disabled = true;

        // botão de resultado escondido no início
        const btnResultado = document.getElementById('btnResultadoScanner');
        if (btnResultado) btnResultado.style.display = 'none';

        // botão da prancheta visível
        const btnPrancheta = document.getElementById('btnAbrirPrancheta');
        if (btnPrancheta) btnPrancheta.style.display = 'inline-block';

        setTimeout(() => this.inicializarScratchEffect(), 120);
    },

    inicializarScratchEffect: function() {
        const canvas = document.getElementById('canvasScanner');
        if (!canvas) { console.error('canvasScanner não encontrado'); return; }

        // Pedir contexto com willReadFrequently para performance quando usamos getImageData repetidamente
        let ctx = null;
        try {
            ctx = canvas.getContext('2d', { willReadFrequently: true }) || canvas.getContext('2d');
        } catch(e) {
            ctx = canvas.getContext('2d');
        }

        const imgFundoEl = document.getElementById('imgFundoScanner');
        const ferramentaEl = document.getElementById('ferramentaScanner');

        if (!ctx || !imgFundoEl) {
            console.error('Elementos do scanner não encontrados');
            return;
        }

        this.estado.canvas = canvas;
        this.estado.ctx = ctx;
        this.estado.ferramenta = ferramentaEl;

        // ======= ORDENAÇÃO CORRETA DAS CAMADAS =======
        const produtoInfo = this.estado.tiposProdutos[this.estado.produtoSelecionado];
        const estadoInfo  = this.estado.infoEstadoAtual;

        // imagem por baixo = estado (premium/padrao/defeituoso)
        this.estado.imgFundo = new Image();
        this.estado.imgFundo.crossOrigin = 'anonymous';
        this.estado.imgFundo.src = estadoInfo.imagem;

        // imagem topo (cobertura) = ícone genérico do produto (opaco)
        this.estado.imgTopo = new Image();
        this.estado.imgTopo.crossOrigin = 'anonymous';
        this.estado.imgTopo.src = produtoInfo.icone || produtoInfo.base;

        const canvasW = 400, canvasH = 400;
        canvas.width = canvasW;
        canvas.height = canvasH;

        let carregouFundo = false;
        let carregouTopo  = false;

        const tentarDesenhar = () => {
            if (!carregouFundo || !carregouTopo) return;

            // mostrar imagem por baixo no DOM (estado)
            imgFundoEl.src = this.estado.imgFundo.src;
            imgFundoEl.style.display = 'block';

            // desenhar a imagem topo no canvas (cobertura opaca)
            ctx.clearRect(0,0,canvasW,canvasH);
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(this.estado.imgTopo, 0, 0, canvasW, canvasH);

            // calcular pixels não-transparentes DO COBERTOR e salvar sua imageData
            this.calcularPixelsImagemImagemData(this.estado.imgTopo, canvasW, canvasH).then(({count, imageData}) => {
                this.estado.totalPixelsImagem = count;
                this.estado.originalImageData = imageData; // ImageData object
                this.estado.imagemCarregada = true;

                // garantir que a ferramenta não bloqueie cliques
                if (this.estado.ferramenta) this.estado.ferramenta.style.pointerEvents = 'none';

                // configurar eventos para raspagem
                this.configurarEventosScratch();
                this.atualizarBarraProgresso(0);
            }).catch(err => {
                console.error('Erro ao calcular pixels da imagem topo', err);
                this.estado.totalPixelsImagem = canvasW * canvasH;
                this.estado.imagemCarregada = true;
                if (this.estado.ferramenta) this.estado.ferramenta.style.pointerEvents = 'none';
                this.configurarEventosScratch();
            });
        };

        this.estado.imgFundo.onload = () => { carregouFundo = true; tentarDesenhar(); };
        this.estado.imgFundo.onerror = () => { carregouFundo = true; tentarDesenhar(); };

        this.estado.imgTopo.onload = () => { carregouTopo = true; tentarDesenhar(); };
        this.estado.imgTopo.onerror = () => { carregouTopo = true; tentarDesenhar(); };
    },

    // retorna {count, imageData} onde imageData é ImageData (não apenas array)
    calcularPixelsImagemImagemData: function(imagem, width, height) {
        return new Promise((resolve, reject) => {
            try {
                const tmp = document.createElement('canvas');
                tmp.width = width; tmp.height = height;
                const tctx = tmp.getContext('2d');
                tctx.clearRect(0,0,width,height);
                tctx.drawImage(imagem, 0, 0, width, height);
                const imageData = tctx.getImageData(0,0,width,height);
                const data = imageData.data;
                let count = 0;
                for (let i = 3; i < data.length; i += 4) {
                    if (data[i] > 10) count++;
                }
                resolve({ count, imageData });
            } catch (e) {
                reject(e);
            }
        });
    },

    configurarEventosScratch: function() {
        const canvas = this.estado.canvas;
        const ferramenta = this.estado.ferramenta;

        // Limpar event listeners anteriores
        this.removerEventListenersScratch();

        // Criar novos event listeners com bind para referência adequada
        this.estado.eventListeners.docMove = (e) => {
            if (ferramenta) {
                ferramenta.style.left = e.clientX + 'px';
                ferramenta.style.top  = e.clientY + 'px';
            }
        };

        this.estado.eventListeners.mouseenter = () => { 
            if (ferramenta) ferramenta.style.display = 'block'; 
        };

        this.estado.eventListeners.mouseleave = () => { 
            if (ferramenta) ferramenta.style.display = 'none'; 
            this.estado.apagando = false; 
        };

        this.estado.eventListeners.mouseDown = (e) => {
            if (e.button === 0 && this.estado.imagemCarregada && !this.estado.efeitoConcluido) {
                this.estado.apagando = true;
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                if (x>=0 && y>=0 && x<=canvas.width && y<=canvas.height) this.apagarArea(x,y);
            }
        };

        this.estado.eventListeners.mouseUp = () => { 
            this.estado.apagando = false; 
        };

        this.estado.eventListeners.mouseMove = (e) => {
            if (!this.estado.minigameAtivo || this.estado.efeitoConcluido || !this.estado.imagemCarregada) return;
            if (!this.estado.apagando) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (x>=0 && y>=0 && x<=canvas.width && y<=canvas.height) this.apagarArea(x,y);
        };

        // Adicionar event listeners
        document.addEventListener('mousemove', this.estado.eventListeners.docMove);
        canvas.addEventListener("mouseenter", this.estado.eventListeners.mouseenter);
        canvas.addEventListener("mouseleave", this.estado.eventListeners.mouseleave);
        document.addEventListener('mousedown', this.estado.eventListeners.mouseDown);
        document.addEventListener('mouseup', this.estado.eventListeners.mouseUp);
        canvas.addEventListener('mousemove', this.estado.eventListeners.mouseMove);

        // Prevenir comportamentos indesejados
        canvas.addEventListener('dragstart', (ev)=>ev.preventDefault());
        canvas.addEventListener('selectstart', (ev)=>ev.preventDefault());
    },

    removerEventListenersScratch: function() {
        const canvas = this.estado.canvas;
        
        // Remover todos os event listeners usando as referências armazenadas
        if (this.estado.eventListeners.docMove) {
            document.removeEventListener('mousemove', this.estado.eventListeners.docMove);
        }
        if (this.estado.eventListeners.mouseenter && canvas) {
            canvas.removeEventListener('mouseenter', this.estado.eventListeners.mouseenter);
        }
        if (this.estado.eventListeners.mouseleave && canvas) {
            canvas.removeEventListener('mouseleave', this.estado.eventListeners.mouseleave);
        }
        if (this.estado.eventListeners.mouseDown) {
            document.removeEventListener('mousedown', this.estado.eventListeners.mouseDown);
        }
        if (this.estado.eventListeners.mouseUp) {
            document.removeEventListener('mouseup', this.estado.eventListeners.mouseUp);
        }
        if (this.estado.eventListeners.mouseMove && canvas) {
            canvas.removeEventListener('mousemove', this.estado.eventListeners.mouseMove);
        }

        // Resetar referências
        this.estado.eventListeners = {
            docMove: null,
            mouseenter: null,
            mouseleave: null,
            mouseDown: null,
            mouseUp: null,
            mouseMove: null
        };
    },

    apagarArea: function(x,y) {
        const raio = 26;
        const ctx = this.estado.ctx;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, raio, 0, Math.PI*2);
        ctx.fill();

        const agora = Date.now();
        if (agora - this.estado.debug.ultimaVerificacao > 160) {
            this.estado.debug.ultimaVerificacao = agora;
            this.verificarProgressoScratch();
        }
    },

    verificarProgressoScratch: function() {
        const canvas = this.estado.canvas;
        const ctx = this.estado.ctx;

        if (!canvas || !ctx || this.estado.efeitoConcluido || !this.estado.imagemCarregada || !this.estado.originalImageData)
            return;

        const current = ctx.getImageData(0,0,canvas.width,canvas.height);
        const currData = current.data;
        const origData = this.estado.originalImageData.data;

        let apagadosDoCobertor = 0;

        for (let i = 3; i < origData.length; i += 4) {
            if (origData[i] > 10 && currData[i] <= 10)
                apagadosDoCobertor++;
        }

        const total = this.estado.totalPixelsImagem || (canvas.width * canvas.height);

        this.estado.progressoReal   = (apagadosDoCobertor / Math.max(1, total)) * 100;
        this.estado.progressoVisual = this.estado.progressoReal;

        this.atualizarBarraProgresso(this.estado.progressoVisual);

        if (this.estado.progressoReal >= 98 && !this.estado.efeitoConcluido) {
            this.finalizarScratchEffect();
        }
    },

    // NOVO: Método separado para finalizar o efeito de scratch
    finalizarScratchEffect: function() {
        this.estado.efeitoConcluido = true;
        this.estado.minigameAtivo = false;

        // Limpar event listeners imediatamente ao finalizar
        this.removerEventListenersScratch();

        const ctx = this.estado.ctx;
        if (ctx) {
            ctx.clearRect(0,0,this.estado.canvas.width,this.estado.canvas.height);
        }

        mostrarAviso('Escaneamento concluído!', 2000);

        // Pequeno delay antes de abrir a prancheta para garantir que os eventos foram limpos
        setTimeout(() => {
            this.abrirPrancheta();
            
            const btnEnviar = document.getElementById('btnEnviarClassificacao');
            if (btnEnviar) btnEnviar.disabled = false;

            this.atualizarBarraProgresso(100);
        }, 100);
    },

    atualizarBarraProgresso: function(valorPercent) {
        const preench = document.getElementById('barraProgressoVertical');
        const texto = document.getElementById('textoProgressoScanner');
        if (preench) {
            const h = Math.max(0, Math.min(100, valorPercent));
            preench.style.height = h + '%';
            if (h < 30) preench.style.background = 'linear-gradient(180deg,#e74c3c,#e67e22)';
            else if (h < 70) preench.style.background = 'linear-gradient(180deg,#e67e22,#f1c40f)';
            else preench.style.background = 'linear-gradient(180deg,#2ecc71,#27ae60)';
        }
        if (texto) texto.textContent = Math.round(valorPercent) + '%';
    },

    abrirPrancheta: function() {
        const modal = document.getElementById('modalPrancheta');
        if (!modal) {
            console.error('modalPrancheta não encontrado');
            return;
        }

        modal.style.display = 'flex';
        modal.style.pointerEvents = 'auto';
        modal.style.zIndex = 999999;

        const conteudo = modal.querySelector('.conteudo') || modal;
        if (conteudo) {
            conteudo.addEventListener('mousedown', (e) => { e.stopPropagation(); });
            conteudo.addEventListener('mouseup',   (e) => { e.stopPropagation(); });
            conteudo.addEventListener('click',     (e) => { e.stopPropagation(); });
            conteudo.addEventListener('mousemove', (e) => { e.stopPropagation(); });
        }

        try { this.estado.canvas && this.estado.canvas.blur && this.estado.canvas.blur(); } catch(e) {}
    },

    fecharPrancheta: function() {
        const modal = document.getElementById('modalPrancheta');
        if (!modal) return;
        modal.style.display = 'none';
    },

    submeterClassificacao: function() {
        // Se tentar enviar antes de finalizar o escaneamento → feedback
        if (!this.estado.efeitoConcluido) {
            const btn = document.getElementById('btnEnviarClassificacao');
            if (btn) {
                btn.classList.add('erro-pulsar');
                setTimeout(() => btn.classList.remove('erro-pulsar'), 600);
            }
            alert("Finalize o escaneamento antes de enviar a classificação!");
            return;
        }

        // ler classificação escolhida
        const radios = document.getElementsByName('classificacaoScanner');
        let selecionado = null;
        for (let r of radios) {
            if (r.checked) {
                selecionado = r.value;
                break;
            }
        }

        if (!selecionado) {
            mostrarAviso('Classifique o produto antes de enviar.', 2000);
            return;
        }

        // salvar escolha do jogador
        this.estado.classificacaoJogador = selecionado;
        // o jogador só pode enviar uma vez
        const btnEnviar = document.getElementById('btnEnviarClassificacao');
        if (btnEnviar) btnEnviar.disabled = true;

        // após breve delay: fecha prancheta e mostra resultado
        setTimeout(() => {
            this.fecharPrancheta();
            this.mostrarResultadoScanner();
        }, 800);
    },

    finalizarLoteScanner: function() {
        const produto = this.estado.produtoSelecionado;
        if (!produto) return;

        // Verificar se a classificação está correta
        const classificacaoCorreta = (this.estado.classificacaoJogador === this.estado.estadoAtualProduto);
        
        if (classificacaoCorreta) {
            // CORREÇÃO: Adicionar pallet específico baseado no produto
            const palletMap = {
                'garrafa250': 'pallet_garrafa250',
                'garrafa500': 'pallet_garrafa500',
                'garrafa2_5': 'pallet_garrafa2_5',
                'prato': 'pallet_prato',
                'copo': 'pallet_copo',
                'refratario': 'pallet_refratario'
            };
            
            const palletTipo = palletMap[produto];
            if (palletTipo && typeof SistemaInventario?.adicionar === 'function') {
                SistemaInventario.adicionar(palletTipo, 1);
                SistemaInventario.atualizarDisplay();
                mostrarAviso(`✅ Classificação correta! Pallet de ${this.estado.tiposProdutos[produto].nome} adicionado ao inventário.`, 2000);
            }
        } else {
            mostrarAviso(`❌ Classificação incorreta! O produto era ${this.estado.estadoAtualProduto}. Nenhum pallet adicionado.`, 2000);
        }

        // Remove 1 unidade do produto escaneado
        if (typeof SistemaInventario?.remover === 'function') {
            SistemaInventario.remover(produto, 1);
            SistemaInventario.atualizarDisplay();
        }

        this.resetar();
        this.finalizarProcesso();
    },

    atualizarQuantidadesProdutos: function() {
        Object.keys(this.estado.tiposProdutos).forEach(tipo => {
            const quantidade = SistemaInventario.obterQuantidade(tipo);
            const id = `quantidade${this.capitalizeFirst(tipo)}`;
            const el = document.getElementById(id);
            if (el) el.textContent = quantidade;
        });
    },

    atualizarInterface: function() {
        const btn = document.getElementById('btnIniciarEscaneamentoScanner');
        if (btn) {
            const ok = this.estado.produtoSelecionado && SistemaInventario.tem(this.estado.produtoSelecionado);
            btn.disabled = !ok;
        }
        const status = document.getElementById('statusScanner');
        if (status) {
            if (this.estado.produtoSelecionado) {
                const p = this.estado.tiposProdutos[this.estado.produtoSelecionado];
                const qty = SistemaInventario.obterQuantidade(this.estado.produtoSelecionado);
                status.textContent = `Selecionado: ${p.nome} — ${qty} disponível(is)`;
                status.className = 'status-scanner pronto';
            } else {
                status.textContent = 'Selecione um produto para escanear';
                status.className = 'status-scanner aguardando';
            }
        }
    },

    mostrarResultadoScanner: function() {
        this.mostrarFase('ResultadoScanner');
        
        // MAPEAMENTO CORRETO DAS IMAGENS DE PALLET PARA CADA PRODUTO
        const imagensPallet = {
            'garrafa250': 'IMG/pallet-garrafa.png',
            'garrafa500': 'IMG/pallet-garrafa.png',
            'garrafa2_5': 'IMG/pallet-garrafa.png',
            'prato': 'IMG/pallet-prato.png',
            'copo': 'IMG/pallet-copo.png',
            'refratario': 'IMG/pallet-refratario.png'
        };

        // Fallback caso as imagens específicas de pallet não existam
        const imagensFallback = {
            'garrafa250': 'IMG/garrafa-250.png',
            'garrafa500': 'IMG/garrafa-500.png',
            'garrafa2_5': 'IMG/garrafa-2-5.png',
            'prato': 'IMG/prato.png',
            'copo': 'IMG/copo.png',
            'refratario': 'IMG/refratario.png'
        };

        // Configurar a imagem do pallet
        const produtoInfo = this.estado.tiposProdutos[this.estado.produtoSelecionado];
        const imagemPallet = document.getElementById('imagemPalletScanner');
        const resultadoClassificacao = document.getElementById('resultadoClassificacaoScanner');
        
        if (imagemPallet && produtoInfo) {
            // Usar imagem específica do pallet se disponível, caso contrário usar fallback
            const nomeProduto = this.estado.produtoSelecionado;
            const srcPallet = imagensPallet[nomeProduto] || imagensFallback[nomeProduto];
            
            imagemPallet.src = srcPallet;
            imagemPallet.alt = `Pallet de ${produtoInfo.nome}`;
            imagemPallet.style.maxWidth = '200px';
            imagemPallet.style.maxHeight = '200px';
        }
        
        if (resultadoClassificacao) {
            resultadoClassificacao.style.display = 'block';
            const correto = (this.estado.classificacaoJogador === this.estado.estadoAtualProduto);
            
            resultadoClassificacao.innerHTML = `
                <div class="classificacao-resultado ${correto ? 'correto' : 'errado'}">
                    <h4>Resultado da Classificação</h4>
                    <p><strong>Sua classificação:</strong> ${this.estado.classificacaoJogador}</p>
                    <p><strong>Classificação correta:</strong> ${this.estado.estadoAtualProduto}</p>
                    <p class="status-classificacao">${correto ? '✅ Classificação Correta!' : '❌ Classificação Incorreta'}</p>
                </div>
            `;
        }
    },

    resetar: function() {
        // Limpar event listeners primeiro
        this.removerEventListenersScratch();
        
        // Resetar estado
        Object.assign(this.estado, {
            estadoAtualProduto: null, infoEstadoAtual: null, defeitosRevelados:0, brilho:0, riscos:0,
            classificacaoJogador:null, minigameAtivo:false, canvas:null, ctx:null, imgFundo:null, imgTopo:null,
            apagando:false, efeitoConcluido:false, totalPixelsImagem:0, originalImageData:null, progressoReal:0,
            progressoVisual:0, imagemCarregada:false,
            eventListeners: {
                docMove: null,
                mouseenter: null,
                mouseleave: null,
                mouseDown: null,
                mouseUp: null,
                mouseMove: null
            }
        });
        
        const cont = document.getElementById('caracteristicasProduto');
        if (cont) cont.style.display = 'none';
        
        this.atualizarInterface();
    }
};

// Exportar para global
window.MisturadorLogica = MisturadorLogica;
window.FornoLogica = FornoLogica;
window.ISLogica = ISLogica;
window.ScannerLogica = ScannerLogica;