// ===== produtos.js =====
// Funcionalidades: Filtro de produtos, Favoritar, Simulação de pedido, Animação ao scroll

document.addEventListener("DOMContentLoaded", () => {

  /* ============ FILTRO DE PRODUTOS ============ */
  const inputFiltro = document.getElementById("filtroProduto");
  const produtos = document.querySelectorAll(".produto-item");
  const semResultados = document.getElementById("semResultados");
  const btnsCategoria = document.querySelectorAll(".btn-categoria");
  let categoriaAtiva = "todos";

  function filtrarProdutos() {
    const termo = (inputFiltro.value || "").toLowerCase().trim();
    let visiveis = 0;

    produtos.forEach((prod) => {
      const nome = prod.dataset.nome.toLowerCase();
      const cat = prod.dataset.categoria;
      const combinaTexto = nome.includes(termo);
      const combinaCat = categoriaAtiva === "todos" || cat === categoriaAtiva;

      if (combinaTexto && combinaCat) {
        prod.style.display = "";
        visiveis++;
      } else {
        prod.style.display = "none";
      }
    });

    semResultados.style.display = visiveis === 0 ? "block" : "none";
  }

  inputFiltro.addEventListener("input", filtrarProdutos);

  btnsCategoria.forEach((btn) => {
    btn.addEventListener("click", () => {
      btnsCategoria.forEach((b) => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      categoriaAtiva = btn.dataset.categoria;
      filtrarProdutos();
    });
  });

  /* ============ FAVORITAR ============ */
  const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

  document.querySelectorAll(".btn-fav").forEach((btn) => {
    const id = btn.dataset.id;
    if (favoritos.includes(id)) {
      btn.classList.add("ativo");
      btn.textContent = "❤️";
    }
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = favoritos.indexOf(id);
      if (idx >= 0) {
        favoritos.splice(idx, 1);
        btn.classList.remove("ativo");
        btn.textContent = "🤍";
      } else {
        favoritos.push(id);
        btn.classList.add("ativo");
        btn.textContent = "❤️";
      }
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    });
  });

  /* ============ SIMULAÇÃO DE PEDIDO ============ */
  const pedido = [];
  const listaPedido = document.getElementById("listaPedido");
  const totalEl = document.getElementById("totalPedido");
  const contadorCarrinho = document.getElementById("contadorCarrinho");
  const msgPedido = document.getElementById("msgPedido");

  function atualizarPedido() {
    listaPedido.innerHTML = "";
    let total = 0;
    pedido.forEach((item, i) => {
      total += item.preco;
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.nome}</span>
        <span>R$ ${item.preco.toFixed(2).replace(".", ",")}
          <button data-i="${i}" title="Remover">✕</button>
        </span>`;
      listaPedido.appendChild(li);
    });
    totalEl.textContent = total.toFixed(2).replace(".", ",");
    contadorCarrinho.textContent = pedido.length;

    listaPedido.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        pedido.splice(parseInt(b.dataset.i), 1);
        atualizarPedido();
      });
    });
  }

  document.querySelectorAll(".btn-pedir").forEach((btn) => {
    btn.addEventListener("click", () => {
      pedido.push({
        nome: btn.dataset.nome,
        preco: parseFloat(btn.dataset.preco),
      });
      atualizarPedido();
      msgPedido.textContent = `✅ ${btn.dataset.nome} adicionado!`;
      setTimeout(() => (msgPedido.textContent = ""), 2000);
    });
  });

  document.getElementById("limparPedido").addEventListener("click", () => {
    pedido.length = 0;
    atualizarPedido();
    msgPedido.textContent = "Pedido limpo.";
    setTimeout(() => (msgPedido.textContent = ""), 2000);
  });

  document.getElementById("finalizarPedido").addEventListener("click", () => {
    if (pedido.length === 0) {
      msgPedido.textContent = "⚠️ Adicione algo ao pedido antes!";
      return;
    }
    const total = pedido.reduce((s, i) => s + i.preco, 0);
    msgPedido.textContent = `🎉 Pedido finalizado! ${pedido.length} item(ns) — R$ ${total
      .toFixed(2)
      .replace(".", ",")}`;
    pedido.length = 0;
    atualizarPedido();
  });

  /* ============ ANIMAÇÃO AO SCROLL ============ */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visivel");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
});
