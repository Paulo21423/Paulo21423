document.addEventListener("DOMContentLoaded", function() {
    
    /* ==========================================================================
       1. COMPONENTES EXPANSÍVEIS (ACCORDION)
       ========================================================================== */
    const gatilhosAccordion = document.querySelectorAll(".gatilho-accordion");

    gatilhosAccordion.forEach(gatilho => {
        gatilho.addEventListener("click", function() {
            const itemPai = this.parentElement;
            const painelConteudo = this.nextElementSibling;
            const estaExpandido = this.getAttribute("aria-expanded") === "true";

            // Alterna o estado atual
            this.setAttribute("aria-expanded", !estaExpandido);
            painelConteudo.hidden = estaExpandido;
            itemPai.classList.toggle("ativo");
        });
    });

    /* ==========================================================================
       2. ACESSIBILIDADE - ALTERNAR TEMA (CLARO/ESCURO)
       ========================================================================== */
    const btnAlternarTema = document.getElementById("btn-alternar-tema");
    
    btnAlternarTema.addEventListener("click", function() {
        document.body.classList.toggle("modo-escuro");
        const escuroAtivo = document.body.classList.contains("modo-escuro");
        this.setAttribute("aria-label", escuroAtivo ? "Mudar para Modo Claro" : "Mudar para Modo Escuro");
    });

    /* ==========================================================================
       3. ACESSIBILIDADE - CONTROLE DE TAMANHO DE FONTE
       ========================================================================== */
    const btnAumentarTxt = document.getElementById("btn-aumentar-txt");
    const btnDiminuirTxt = document.getElementById("btn-diminuir-txt");
    let nivelFontePorcento = 100;

    btnAumentarTxt.addEventListener("click", function() {
        if (nivelFontePorcento < 140) {
            nivelFontePorcento += 10;
            document.documentElement.style.fontSize = nivelFontePorcento + "%";
        }
    });

    btnDiminuirTxt.addEventListener("click", function() {
        if (nivelFontePorcento > 80) {
            nivelFontePorcento -= 10;
            document.documentElement.style.fontSize = nivelFontePorcento + "%";
        }
    });

    /* ==========================================================================
       4. ACESSIBILIDADE - LEITURA POR VOZ (NATIVA NATAL API)
       ========================================================================== */
    const btnFalarVoz = document.getElementById("btn-falar-voz");
    const btnPararVoz = document.getElementById("btn-parar-voz");
    let sinteseVoz = window.speechSynthesis;
    let elUtterance = null;

    btnFalarVoz.addEventListener("click", function() {
        // Se já estiver lendo, cancela para recomeçar
        if (sinteseVoz.speaking) {
            sinteseVoz.cancel();
        }

        // Seleciona exclusivamente o texto do artigo principal ignorando botões, menus e formulários
        const secaoTextoNarrativo = document.querySelector(".texto-narrativo");
        if (!secaoTextoNarrativo) return;

        const textoParaLer = secaoTextoNarrativo.innerText;

        elUtterance = new SpeechSynthesisUtterance(textoParaLer);
        elUtterance.lang = "pt-BR";

        elUtterance.onstart = function() {
            btnPararVoz.disabled = false;
            btnFalarVoz.textContent = "🎙️ Lendo...";
        };

        elUtterance.onend = function() {
            btnPararVoz.disabled = true;
            btnFalarVoz.textContent = "🔊 Ler";
        };

        elUtterance.onerror = function() {
            btnPararVoz.disabled = true;
            btnFalarVoz.textContent = "🔊 Ler";
        };

        sinteseVoz.speak(elUtterance);
    });

    btnPararVoz.addEventListener("click", function() {
        if (sinteseVoz.speaking) {
            sinteseVoz.cancel();
            btnPararVoz.disabled = true;
            btnFalarVoz.textContent = "🔊 Ler";
        }
    });

    /* ==========================================================================
       5. FORMULÁRIO DE INSCRIÇÃO INTERATIVO
       ========================================================================== */
    const formInscricao = document.getElementById("form-inscricao");
    const msgSucessoForm = document.getElementById("msg-sucesso-form");

    formInscricao.addEventListener("submit", function(evento) {
        evento.preventDefault(); // Evita recarregamento da página

        // Captura os dados informados de maneira dinâmica
        const dadosForm = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            cidade: document.getElementById("cidade").value,
            estado: document.getElementById("estado").value,
            pais: document.getElementById("pais").value
        };

        console.log("Inscrição efetuada com sucesso:", dadosForm);

        // Feedback visual amigável ao usuário
        formInscricao.reset();
        msgSucessoForm.hidden = false;
        msgSucessoForm.setAttribute("aria-live", "polite");

        setTimeout(() => {
            msgSucessoForm.hidden = true;
        }, 6000);
    });

    /* ==========================================================================
       6. INTERAÇÃO COMO LEITOR - CAIXA DE COMENTÁRIOS
       ========================================================================== */
    const formComentario = document.getElementById("form-comentario");
    const containerComentarios = document.getElementById("container-comentarios");
    const txtComentario = document.getElementById("txt-comentario");

    formComentario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const textoDigitado = txtComentario.value.trim();
        if (textoDigitado === "") return;

        // Criando elemento do novo comentário estruturado de forma acessível e limpa
        const novoComentario = document.createElement("div");
        novoComentario.className = "item-comentario";
        
        novoComentario.innerHTML = `
            <div class="avatar-comentario">VS</div>
            <div class="conteudo-comentario">
                <div class="autor-meta">
                    <strong>Visitante</strong> <span>• Agora mesmo</span>
                </div>
                <p>${escapeHTML(textoDigitado)}</p>
            </div>
        `;

        // Insere no início da lista de debates
        containerComentarios.insertBefore(novoComentario, containerComentarios.firstChild);
        txtComentario.value = "";
    });

    // Função de segurança básica para evitar injeção de scripts (XSS) nos comentários locais
    function escapeHTML(string) {
        return string
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});