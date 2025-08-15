/* ===========================
   Tema (light/dark) com cookie
   =========================== */
(function () {
  const COOKIE   = 'theme';
  const ONE_YEAR = 60 * 60 * 24 * 365;

  function getCookie(name) {
    return document.cookie
      .split('; ')
      .find(r => r.startsWith(name + '='))
      ?.split('=')[1];
  }

  function setCookie(name, val, maxAge) {
    document.cookie = `${name}=${val}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }

  function applyTheme(t) {
    const isDark = (t === 'dark');
    // suporta CSS baseado em atributo OU classe
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.classList.toggle('theme-dark', isDark);
    document.body.classList.toggle('theme-dark', isDark);
    // rótulo do botão
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) btn.textContent = isDark ? '☀️ Claro' : '🌙 Escuro';
  }

  function current() {
    // prioriza atributo se existir
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr) return attr;
    return document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light';
  }

  function initThemeToggle() {
    let t = getCookie(COOKIE);
    if (!t) {
      t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'dark' : 'light';
    }
    applyTheme(t);
    setCookie(COOKIE, t, ONE_YEAR);

    const btn = document.getElementById('btn-theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        const next = (current() === 'dark') ? 'light' : 'dark';
        setCookie(COOKIE, next, ONE_YEAR);
        applyTheme(next);
      });
    }
  }

 if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
})();

/* ==========================================
   Cenaflix — integração com API (jQuery)
   ========================================== */
if (window.jQuery) {
  (function ($) {

    function showAjaxError(prefix, xhr) {
      try {
        const ct = xhr.getResponseHeader && xhr.getResponseHeader('Content-Type');
        if (ct && ct.indexOf('application/json') !== -1 && xhr.responseText) {
          const body = JSON.parse(xhr.responseText);
          if (body && (body.error || body.message)) {
            alert(prefix + ': ' + (body.error || body.message));
            return;
          }
        }
        if (xhr.responseText) {
          alert(prefix + ': ' + (xhr.status || '') + ' - ' + xhr.responseText);
        } else {
          alert(prefix + (xhr.status ? ': ' + xhr.status : ''));
        }
      } catch (err) {
        console.error(err);
        alert(prefix);
      }
    }

    function escapeHtml(str) {
      if (str == null) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    /* ---------- FILMES ---------- */
    async function carregarFilmesTabela() {
      const $tb = $("#tbl-filmes tbody");
      if (!$tb.length) return; // não está na página de filmes
      try {
        const filmes = await $.getJSON('filmes');
        $tb.empty();
        filmes.forEach(function (f) {
          const $tr = $("<tr/>");
          $tr.append('<td>' + f.id + '</td>');
          $tr.append('<td>' + escapeHtml(f.titulo) + '</td>');
          $tr.append('<td>' + escapeHtml(f.genero) + '</td>');
          $tr.append('<td>' + (f.ano != null ? f.ano : '') + '</td>');
          $tr.append(
            '<td>' +
              '<button class="small" data-edit-filme="' + f.id + '">Editar</button> ' +
              '<button class="small danger" data-del-filme="' + f.id + '">Excluir</button>' +
            '</td>'
          );
          $tb.append($tr);
        });
      } catch (e) {
        console.error(e);
        alert("Erro ao listar filmes.");
      }
    }

    async function carregarFilmesSelects() {
      try {
        const filmes = await $.getJSON('filmes');
        const $analiseSel = $("#analise-filme");
        const $filtroSel  = $("#filtro-filme");
        if ($analiseSel.length) $analiseSel.empty();
        if ($filtroSel.length)  $filtroSel.empty().append('<option value="">-- todos --</option>');
        filmes.forEach(function (f) {
          const opt = '<option value="' + f.id + '">' + f.id + ' — ' + escapeHtml(f.titulo) + '</option>';
          if ($analiseSel.length) $analiseSel.append(opt);
          if ($filtroSel.length)  $filtroSel.append(opt);
        });
      } catch (e) {
        console.error(e);
      }
    }

    function limparFormFilme() {
      $("#filme-id, #filme-titulo, #filme-genero, #filme-ano, #filme-sinopse").val("");
    }

    async function salvarFilme(e) {
      e.preventDefault();
      const id = $("#filme-id").val();
      const anoVal = $("#filme-ano").val().trim();
      const anoNum = anoVal === "" ? NaN : parseInt(anoVal, 10);
      const payload = {
        titulo:  $("#filme-titulo").val().trim(),
        genero:  $("#filme-genero").val().trim(),
        ano:     anoNum,
        sinopse: $("#filme-sinopse").val().trim()
      };
      if (!payload.titulo || !payload.genero || Number.isNaN(payload.ano) || !payload.sinopse) {
        return alert("Preencha todos os campos do filme (ano numérico).");
      }
      try {
        if (id) {
          await $.ajax({ url: 'filmes/' + id, method: 'PUT', data: JSON.stringify(payload), contentType: 'application/json; charset=utf-8' });
        } else {
          await $.ajax({ url: 'filmes',     method: 'POST', data: JSON.stringify(payload), contentType: 'application/json; charset=utf-8' });
        }
        await carregarFilmesTabela();
        await carregarFilmesSelects();
        limparFormFilme();
      } catch (e) {
        console.error(e);
        showAjaxError('Erro ao salvar filme', e);
      }
    }

    async function editarFilme(id) {
      try {
        const f = await $.getJSON('filmes/' + id);
        $("#filme-id").val(f.id);
        $("#filme-titulo").val(f.titulo);
        $("#filme-genero").val(f.genero);
        $("#filme-ano").val(f.ano);
        $("#filme-sinopse").val(f.sinopse);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        console.error(e);
        alert("Não foi possível carregar o filme.");
      }
    }

    async function excluirFilme(id) {
      if (!confirm('Excluir filme ' + id + '?')) return;
      try {
        await $.ajax({ url: 'filmes/' + id, method: 'DELETE' });
        await carregarFilmesTabela();
        await carregarFilmesSelects();
      } catch (e) {
        console.error(e);
        showAjaxError('Erro ao excluir filme', e);
      }
    }

    /* ---------- ANÁLISES ---------- */
    function limparFormAnalise() {
      $("#analise-id").val("");
      $("#analise-filme").val("");
      $("#analise-nota").val("");
      $("#analise-texto").val("");
    }

    async function listarAnalises(all) {
      const $tb = $("#tbl-analises tbody");
      if (!$tb.length) return; // não está na página de análises
      try {
        let url = 'analises';
        const filmeId = $("#filtro-filme").val();
        if (all === false && filmeId) url = 'filmes/' + filmeId + '/analises';
        const lista = await $.getJSON(url);
        $tb.empty();
        lista.forEach(function (a) {
          const $tr = $("<tr/>");
          $tr.append('<td>' + a.id + '</td>');
          $tr.append('<td>' + (a.filme ? a.filme.id : '') + '</td>');
          $tr.append('<td>' + (a.nota != null ? a.nota : '') + '</td>');
          $tr.append('<td>' + escapeHtml(a.texto || '') + '</td>');
          $tr.append(
            '<td>' +
              '<button class="small" data-edit-analise="' + a.id + '">Editar</button> ' +
              '<button class="small danger" data-del-analise="' + a.id + '">Excluir</button>' +
            '</td>'
          );
          $tb.append($tr);
        });
      } catch (e) {
        console.error(e);
        alert("Erro ao listar análises.");
      }
    }

    async function salvarAnalise(e) {
      e.preventDefault();
      const id       = $("#analise-id").val();
      const filmeId  = parseInt($("#analise-filme").val() || "", 10);
      const nota     = parseInt(($("#analise-nota").val() || "").trim(), 10);
      const payload  = { filme: { id: filmeId }, texto: $("#analise-texto").val().trim(), nota: nota };

      if (Number.isNaN(payload.filme.id)) return alert("Selecione o filme.");
      if (!payload.texto)                  return alert("Preencha o texto da análise.");
      if (Number.isNaN(payload.nota))      return alert("Informe a nota (0 a 10).");
      if (payload.nota < 0 || payload.nota > 10) return alert("A nota deve estar entre 0 e 10.");

      try {
        if (id) {
          await $.ajax({ url: 'analises/' + id, method: 'PUT',  data: JSON.stringify(payload), contentType: 'application/json; charset=utf-8', dataType: 'json' });
        } else {
          await $.ajax({ url: 'analises',     method: 'POST', data: JSON.stringify(payload), contentType: 'application/json; charset=utf-8', dataType: 'json' });
        }
        await listarAnalises(true);
        limparFormAnalise();
      } catch (e) {
        console.error(e);
        showAjaxError('Erro ao salvar análise', e);
      }
    }

    async function editarAnalise(id) {
      try {
        const a = await $.getJSON('analises/' + id);
        $("#analise-id").val(a.id);
        $("#analise-filme").val(a.filme ? a.filme.id : "");
        $("#analise-nota").val(a.nota);
        $("#analise-texto").val(a.texto);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        console.error(e);
        alert("Não foi possível carregar a análise.");
      }
    }

    async function excluirAnalise(id) {
      if (!confirm('Excluir análise ' + id + '?')) return;
      try {
        await $.ajax({ url: 'analises/' + id, method: 'DELETE' });
        await listarAnalises(true);
      } catch (e) {
        console.error(e);
        showAjaxError('Erro ao excluir análise', e);
      }
    }

    /* ---------- Bind automático por página ---------- */
    $(function () {
      if (document.getElementById('tbl-filmes')) {
        carregarFilmesTabela();
        $("#form-filme").on("submit", salvarFilme);
        $("#btn-limpar-filme").on("click", limparFormFilme);
        $("#btn-recarregar-filmes").on("click", carregarFilmesTabela);
        $(document).on("click", "[data-edit-filme]", function(){ editarFilme($(this).data("edit-filme")); });
        $(document).on("click", "[data-del-filme]",  function(){ excluirFilme($(this).data("del-filme"));  });
      }

      if (document.getElementById('tbl-analises')) {
        carregarFilmesSelects().then(function(){ return listarAnalises(true); });
        $("#form-analise").on("submit", salvarAnalise);
        $("#btn-limpar-analise").on("click", limparFormAnalise);
        $("#btn-listar-por-filme").on("click", function(){ listarAnalises(false); });
        $("#btn-listar-todas").on("click",     function(){ listarAnalises(true);  });
        $(document).on("click", "[data-edit-analise]", function(){ editarAnalise($(this).data("edit-analise")); });
        $(document).on("click", "[data-del-analise]",  function(){ excluirAnalise($(this).data("del-analise"));  });
      }
    });

  })(jQuery);
}
