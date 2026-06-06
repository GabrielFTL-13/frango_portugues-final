// ===== index.js — página inicial =====
// Funcionalidade: Mensagem dinâmica + Contador automático

document.addEventListener("DOMContentLoaded", () => {
  // --- Mensagem dinâmica conforme o horário ---
  const msg = document.getElementById("mensagemDinamica");
  if (msg) {
    const hora = new Date().getHours();
    let texto = "";
    if (hora >= 5 && hora < 12) texto = "Bom dia! Que tal um frango para o almoço? ☀️";
    else if (hora >= 12 && hora < 18) texto = "Boa tarde! Já garantiu seu pedido? 🍗";
    else texto = "Boa noite! Peça já e jante com a gente 🌙";
    msg.textContent = texto;
  }

  // --- Contador automático até 1500 ---
  const contador = document.getElementById("contadorClientes");
  if (contador) {
    const meta = 1500;
    const duracao = 2000; // ms
    const inicio = performance.now();

    function animar(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      contador.textContent = Math.floor(progresso * meta).toLocaleString("pt-BR");
      if (progresso < 1) requestAnimationFrame(animar);
    }
    requestAnimationFrame(animar);
  }
});
