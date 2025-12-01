/*GERENCIADOR DE MÁQUINAS - Sistema de Fábrica de Vidro
    Controla o estado e transições entre as máquinas*/

const GerenciadorMaquinas = {
    maquinaAtual: null,

    abrirMaquina(tipoMaquina) {
        const canvas = document.getElementById('lobbyCanvas');
        const maquina = canvas?.maquinas?.find(m => m.tipo === tipoMaquina);
        maquina?.abrirModal();
    },
    
    inicializarMaquina(tipoMaquina) {
        this.maquinaAtual = tipoMaquina;
        const logicas = {
            'misturador': MisturadorLogica,
            'forno': FornoLogica,
            'IS': ISLogica,
            'scanner': ScannerLogica
        };
        logicas[tipoMaquina] && setTimeout(() => logicas[tipoMaquina].inicializar(), 100);
    },

    finalizarProcesso(tipoMaquina) {
        const canvas = document.getElementById('lobbyCanvas');
        canvas?.maquinas?.find(m => m.tipo === tipoMaquina)?.desligarMaquina();
        this.maquinaAtual = null;
        const modal = document.getElementById('modalMaquina');
        if (modal) {
            modal.style.display = 'none';
            this.restaurarBotaoFecharGlobal();
        }
    },
    
    restaurarBotaoFecharGlobal() {
        const spanFechar = document.getElementById('modalMaquina')?.querySelector('.fechar-modal');
        if (spanFechar) spanFechar.style.display = 'flex';
    }
};

// Torna global
window.GerenciadorMaquinas = GerenciadorMaquinas;
