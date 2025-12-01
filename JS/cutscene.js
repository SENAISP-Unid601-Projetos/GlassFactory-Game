let cutscenePlayer = null;
let youtubeAPIPronto = false;

/* =====================================================
   YouTube API – DEVE SER GLOBAL PARA FUNCIONAR
   ===================================================== */
window.onYouTubeIframeAPIReady = function() {
    youtubeAPIPronto = true;
    console.log("YouTube API carregada corretamente.");
};

/* =====================================================
   Criar Player e iniciar cutscene
   ===================================================== */
function iniciarCutscene(videoId) {
    const modal = document.getElementById("cutsceneModal");
    modal.style.display = "flex";

    cutscenePlayer = new YT.Player("youtubePlayer", {
        videoId: videoId,
        playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0
        },
        events: {
            "onStateChange": onCutsceneStateChange
        }
    });
}

/* =====================================================
   Garantir que a cutscene só inicie após API pronta
   ===================================================== */
function iniciarCutsceneAutomaticamenteSegura(videoId) {

    if (!youtubeAPIPronto) {
        console.log("Aguardando API do YouTube...");
        setTimeout(() => iniciarCutsceneAutomaticamenteSegura(videoId), 100);
        return;
    }

    iniciarCutscene(videoId);
}

/* =====================================================
   Fechar e limpar player ao terminar
   ===================================================== */
function onCutsceneStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {

        fecharCutscene();
        abrirTutorialAutomaticamente();

        // 🎵 INICIAR MÚSICA AMBIENTE APÓS CUTSCENE
        try {
            if (typeof somAmbiente !== "undefined") {
                somAmbiente.currentTime = 0;
                somAmbiente.play().catch(()=>{});
            }
        } catch(e) {
            console.warn("Erro ao tentar tocar somAmbiente:", e);
        }
    }
}

function fecharCutscene() {
    const modal = document.getElementById("cutsceneModal");
    modal.style.display = "none";

    if (cutscenePlayer) {
        cutscenePlayer.destroy();
        cutscenePlayer = null;
    }
}

/* =====================================================
   Abrir tutorial após cutscene
   ===================================================== */
function abrirTutorialAutomaticamente() {
    if (typeof TabletSistema !== "undefined") {
        TabletSistema.abrirTablet();

        setTimeout(() => {
            TabletSistema.mostrarTutorial();
        }, 300);
    }
}
