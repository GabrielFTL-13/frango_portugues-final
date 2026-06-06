// ===== main.js — script compartilhado =====
// Funcionalidade 1: Modo claro / escuro (persistido no localStorage)

(function () {
  const STORAGE_KEY = "frangoTema";

  function aplicarTema(tema) {
    if (tema === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    const btns = document.querySelectorAll("#toggleTema");
    btns.forEach((b) => (b.textContent = tema === "dark" ? "☀️" : "🌙"));
  }

  // Aplica tema salvo ao carregar
  const temaSalvo = localStorage.getItem(STORAGE_KEY) || "light";
  document.addEventListener("DOMContentLoaded", () => {
    aplicarTema(temaSalvo);

    const botoes = document.querySelectorAll("#toggleTema");
    botoes.forEach((btn) => {
      btn.addEventListener("click", () => {
        const atual = document.body.classList.contains("dark-mode") ? "dark" : "light";
        const novo = atual === "dark" ? "light" : "dark";
        localStorage.setItem(STORAGE_KEY, novo);
        aplicarTema(novo);
      });
    });
  });
})();

// ===== Saudação no menu se usuário estiver logado =====
document.addEventListener("DOMContentLoaded", () => {
  try {
    const sessao = JSON.parse(localStorage.getItem("frangoSessao") || "null");
    if (!sessao) return;
    const links = document.querySelectorAll('a.nav-link[href*="login.html"]');
    links.forEach((a) => {
      const primeiro = sessao.nome.split(" ")[0];
      a.textContent = "👤 " + primeiro;
      a.title = "Conta: " + sessao.email;
    });
  } catch (e) { /* ignore */ }
});
