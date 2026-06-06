// ===== login.js — Login + Cadastro funcionais com localStorage =====
document.addEventListener("DOMContentLoaded", () => {
  const USERS_KEY = "frangoUsuarios";
  const SESSION_KEY = "frangoSessao";

  // Elementos
  const tabLogin = document.getElementById("tabLogin");
  const tabCadastro = document.getElementById("tabCadastro");
  const formLogin = document.getElementById("formLogin");
  const formCadastro = document.getElementById("formCadastro");
  const painelLogado = document.getElementById("painelLogado");

  const irCadastro = document.getElementById("irCadastro");
  const irLogin = document.getElementById("irLogin");

  const msgLogin = document.getElementById("msgLogin");
  const msgCadastro = document.getElementById("msgCadastro");

  const senhaCad = document.getElementById("senhaCad");
  const barra = document.getElementById("barraSenha");
  const forcaTexto = document.getElementById("forcaTexto");

  // ---- Utilitários de armazenamento ----
  const lerUsuarios = () => JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const salvarUsuarios = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));
  const lerSessao = () => JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  const salvarSessao = (s) => localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  const limparSessao = () => localStorage.removeItem(SESSION_KEY);

  // Hash simples (apenas para fins didáticos — não é seguro de verdade)
  function hashSenha(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i) | 0;
    return "h_" + Math.abs(h).toString(16);
  }

  // ---- Troca de abas ----
  function mostrar(qual) {
    formLogin.classList.add("oculto");
    formCadastro.classList.add("oculto");
    painelLogado.classList.add("oculto");
    tabLogin.classList.remove("ativo");
    tabCadastro.classList.remove("ativo");
    tabLogin.setAttribute("aria-selected", "false");
    tabCadastro.setAttribute("aria-selected", "false");

    if (qual === "login") {
      formLogin.classList.remove("oculto");
      tabLogin.classList.add("ativo");
      tabLogin.setAttribute("aria-selected", "true");
    } else if (qual === "cadastro") {
      formCadastro.classList.remove("oculto");
      tabCadastro.classList.add("ativo");
      tabCadastro.setAttribute("aria-selected", "true");
    } else {
      painelLogado.classList.remove("oculto");
    }
  }

  tabLogin.addEventListener("click", () => mostrar("login"));
  tabCadastro.addEventListener("click", () => mostrar("cadastro"));
  irCadastro.addEventListener("click", (e) => { e.preventDefault(); mostrar("cadastro"); });
  irLogin.addEventListener("click", (e) => { e.preventDefault(); mostrar("login"); });

  // ---- Ver/Ocultar senha (todos os botões) ----
  document.querySelectorAll(".btn-ver-senha").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      const novo = input.type === "password" ? "text" : "password";
      input.type = novo;
      btn.textContent = novo === "password" ? "👁️" : "🙈";
    });
  });

  // ---- Medidor de força ----
  function calcularForca(s) {
    let p = 0;
    if (s.length >= 6) p++;
    if (s.length >= 10) p++;
    if (/[A-Z]/.test(s)) p++;
    if (/[0-9]/.test(s)) p++;
    if (/[^A-Za-z0-9]/.test(s)) p++;
    return p;
  }
  senhaCad.addEventListener("input", () => {
    const v = senhaCad.value;
    if (!v) {
      barra.style.width = "0%";
      forcaTexto.textContent = "Digite uma senha";
      return;
    }
    const f = calcularForca(v);
    barra.style.width = (f / 5) * 100 + "%";
    if (f <= 2) { barra.style.background = "#ff3b3b"; forcaTexto.textContent = "Fraca"; }
    else if (f <= 3) { barra.style.background = "#f5c518"; forcaTexto.textContent = "Média"; }
    else { barra.style.background = "#22c55e"; forcaTexto.textContent = "Forte 🔥"; }
  });

  // ---- Mostrar mensagem ----
  function mostrarMsg(el, texto, tipo) {
    el.textContent = texto;
    el.className = "msg-auth " + tipo;
  }

  // ---- CADASTRO ----
  formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nomeCad").value.trim();
    const email = document.getElementById("emailCad").value.trim().toLowerCase();
    const s1 = document.getElementById("senhaCad").value;
    const s2 = document.getElementById("senhaCad2").value;
    const aceito = document.getElementById("aceito").checked;

    if (nome.length < 3) return mostrarMsg(msgCadastro, "❌ Digite seu nome completo.", "erro");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return mostrarMsg(msgCadastro, "❌ Email inválido.", "erro");
    if (s1.length < 6) return mostrarMsg(msgCadastro, "❌ A senha precisa ter ao menos 6 caracteres.", "erro");
    if (s1 !== s2) return mostrarMsg(msgCadastro, "❌ As senhas não conferem.", "erro");
    if (!aceito) return mostrarMsg(msgCadastro, "❌ Você precisa aceitar os termos.", "erro");

    const users = lerUsuarios();
    if (users.some((u) => u.email === email)) {
      return mostrarMsg(msgCadastro, "⚠️ Esse email já tem cadastro. Faça login!", "erro");
    }

    users.push({ nome, email, senha: hashSenha(s1), criadoEm: new Date().toISOString() });
    salvarUsuarios(users);
    salvarSessao({ nome, email });

    mostrarMsg(msgCadastro, "✅ Conta criada com sucesso!", "ok");
    formCadastro.reset();
    barra.style.width = "0%";
    forcaTexto.textContent = "Digite uma senha";
    setTimeout(() => atualizarUI(), 600);
  });

  // ---- LOGIN ----
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("emailLogin").value.trim().toLowerCase();
    const senha = document.getElementById("senhaLogin").value;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return mostrarMsg(msgLogin, "❌ Email inválido.", "erro");
    if (!senha) return mostrarMsg(msgLogin, "❌ Digite sua senha.", "erro");

    const users = lerUsuarios();
    const u = users.find((x) => x.email === email);
    if (!u) return mostrarMsg(msgLogin, "❌ Conta não encontrada. Crie uma!", "erro");
    if (u.senha !== hashSenha(senha)) return mostrarMsg(msgLogin, "❌ Senha incorreta.", "erro");

    salvarSessao({ nome: u.nome, email: u.email });
    mostrarMsg(msgLogin, `✅ Bem-vindo de volta, ${u.nome.split(" ")[0]}!`, "ok");
    setTimeout(() => atualizarUI(), 500);
  });

  // ---- SAIR ----
  document.getElementById("btnSair").addEventListener("click", () => {
    limparSessao();
    formLogin.reset();
    msgLogin.textContent = "";
    msgLogin.className = "msg-auth";
    mostrar("login");
  });

  // ---- Estado inicial ----
  function atualizarUI() {
    const sessao = lerSessao();
    if (sessao) {
      document.getElementById("nomeLogado").textContent = sessao.nome.split(" ")[0];
      document.getElementById("emailLogado").textContent = sessao.email;
      const inicial = sessao.nome.trim().charAt(0).toUpperCase();
      document.getElementById("avatarLogado").textContent = inicial || "🍗";
      mostrar("logado");
    } else {
      mostrar("login");
    }
  }
  atualizarUI();
});
