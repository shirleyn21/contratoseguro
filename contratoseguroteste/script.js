// © 2026 ContratoSeguro. Todos os direitos reservados.

// ==========================================
// 1. DATA AUTOMÁTICA DE HOJE
// ==========================================
const dataAtual = new Date();
const opcoesData = { day: 'numeric', month: 'long', year: 'numeric' };
document.getElementById('data-hoje').innerText =
  dataAtual.toLocaleDateString('pt-BR', opcoesData);

// ==========================================
// 2. VARIÁVEIS GLOBAIS
// ==========================================
let cidadeForo = '';

// ==========================================
// 3. CONTROLE DE ETAPAS
// ==========================================
document.getElementById('btn-avancar-1').addEventListener('click', () => {
  validarEtapa1(); // A navegação acontece dentro da função
});

document.getElementById('btn-voltar-2').addEventListener('click', () => {
  document.getElementById('etapa-2').classList.add('escondido');
  document.getElementById('etapa-1').classList.remove('escondido');
  document.getElementById('barra-verde').style.width = '33%';
  document.getElementById('texto-etapa').innerText = 'ETAPA 1 DE 3';
});

document.getElementById('btn-avancar-2').addEventListener('click', () => {
  if (!validarEtapa2()) return;
  document.getElementById('etapa-2').classList.add('escondido');
  document.getElementById('etapa-3').classList.remove('escondido');
  document.getElementById('barra-verde').style.width = '100%';
  document.getElementById('texto-etapa').innerText = 'ETAPA 3 DE 3';
});

document.getElementById('btn-voltar-3').addEventListener('click', () => {
  document.getElementById('etapa-3').classList.add('escondido');
  document.getElementById('etapa-2').classList.remove('escondido');
  document.getElementById('barra-verde').style.width = '66%';
  document.getElementById('texto-etapa').innerText = 'ETAPA 2 DE 3';
});

// Avança para etapa 2 (chamado após validação do CEP)
function avancarParaEtapa2() {
  document.getElementById('etapa-1').classList.add('escondido');
  document.getElementById('etapa-2').classList.remove('escondido');
  document.getElementById('barra-verde').style.width = '66%';
  document.getElementById('texto-etapa').innerText = 'ETAPA 2 DE 3';
}

// ==========================================
// 4. TOGGLE CPF / CNPJ
// ==========================================
document.querySelectorAll('input[name="tipo-profissional"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (e.target.value === 'cpf') {
      document.getElementById('campos-prof-cpf').classList.remove('escondido');
      document.getElementById('campos-prof-cnpj').classList.add('escondido');
    } else {
      document.getElementById('campos-prof-cpf').classList.add('escondido');
      document.getElementById('campos-prof-cnpj').classList.remove('escondido');
    }
    atualizarPreviewProfissional();
  });
});

document.querySelectorAll('input[name="tipo-cliente"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (e.target.value === 'cpf') {
      document.getElementById('campos-cliente-cpf').classList.remove('escondido');
      document.getElementById('campos-cliente-cnpj').classList.add('escondido');
    } else {
      document.getElementById('campos-cliente-cpf').classList.add('escondido');
      document.getElementById('campos-cliente-cnpj').classList.remove('escondido');
    }
    atualizarPreviewCliente();
  });
});

// ==========================================
// 5. CEP — busca automática nos Correios
// ==========================================
function buscarCEP(cep, aoTerminar) {
  const textoStatus = document.getElementById('cidade-estado-texto');
  textoStatus.innerText = 'Buscando endereço...';
  textoStatus.style.color = '#718096';

  fetch('https://viacep.com.br/ws/' + cep + '/json/')
    .then(r => r.json())
    .then(dados => {
      if (dados.erro) {
        textoStatus.innerText = '⚠️ CEP não encontrado. Verifique e tente novamente.';
        textoStatus.style.color = 'red';
        cidadeForo = '';
        document.getElementById('input-cep').style.borderColor = '#e53e3e';
        if (aoTerminar) aoTerminar(false);
      } else {
        const local = dados.localidade + ' - ' + dados.uf;
        cidadeForo = local;
        textoStatus.innerText = '📍 ' + dados.logradouro + ', ' + dados.bairro;
        textoStatus.style.color = '#00eb8b';
        document.getElementById('input-cep').style.borderColor = '#00eb8b';

        // Preenche o preview
        document.getElementById('preview-cidade').innerText = local;
        document.getElementById('preview-foro-cidade').innerText = local;
        document.getElementById('preview-rua-prof').innerText = dados.logradouro;
        document.getElementById('preview-bairro-prof').innerText = dados.bairro;
        document.getElementById('preview-cidade-prof').innerText = local;
        document.getElementById('preview-cep-prof').innerText =
          cep.substring(0,5) + '-' + cep.substring(5);

        if (aoTerminar) aoTerminar(true);
      }
    })
    .catch(() => {
      textoStatus.innerText = '⚠️ Erro de conexão. Verifique sua internet.';
      textoStatus.style.color = 'red';
      if (aoTerminar) aoTerminar(false);
    });
}

document.getElementById('input-cep').addEventListener('input', function(e) {
  const cep = e.target.value.replace(/\D/g, '');
  if (cep.length === 8) {
    buscarCEP(cep, null);
  } else {
    document.getElementById('cidade-estado-texto').innerText = '';
    cidadeForo = '';
    document.getElementById('preview-cidade').innerText = 'Sua Cidade';
    document.getElementById('preview-foro-cidade').innerText = '_______';
    document.getElementById('preview-rua-prof').innerText = '_______';
    document.getElementById('preview-bairro-prof').innerText = '_______';
    document.getElementById('preview-cidade-prof').innerText = '_______';
    document.getElementById('preview-cep-prof').innerText = '_______';
  }
});

// ==========================================
// 6. ESPELHAMENTO EM TEMPO REAL E MÁSCARA FINANCEIRA
// ==========================================
function atualizarPreviewProfissional() {
  const tipo = document.querySelector('input[name="tipo-profissional"]:checked').value;
  if (tipo === 'cpf') {
    const nome = document.getElementById('input-nome-prof').value.toUpperCase() || '_________________';
    document.getElementById('preview-nome-prof').innerText = nome;
    document.getElementById('preview-assinatura-prof').innerText = nome;
    document.getElementById('preview-doc-prof').innerText =
      'inscrito no CPF sob o nº ' + (document.getElementById('input-cpf-prof').value || '_________________');
  } else {
    const razao = document.getElementById('input-razao-prof').value.toUpperCase() || '_________________';
    document.getElementById('preview-nome-prof').innerText = razao;
    document.getElementById('preview-assinatura-prof').innerText = razao;
    document.getElementById('preview-doc-prof').innerText =
      'inscrita no CNPJ sob o nº ' + (document.getElementById('input-cnpj-prof').value || '_________________');
  }
}

function atualizarPreviewCliente() {
  const tipo = document.querySelector('input[name="tipo-cliente"]:checked').value;
  if (tipo === 'cpf') {
    const nome = document.getElementById('input-nome-cliente').value.toUpperCase() || '_________________';
    document.getElementById('preview-nome-cliente').innerText = nome;
    document.getElementById('preview-assinatura-cliente').innerText = nome;
    document.getElementById('preview-doc-cliente').innerText =
      'inscrito no CPF sob o nº ' + (document.getElementById('input-cpf-cliente').value || '_________________');
  } else {
    const razao = document.getElementById('input-razao-cliente').value.toUpperCase() || '_________________';
    document.getElementById('preview-nome-cliente').innerText = razao;
    document.getElementById('preview-assinatura-cliente').innerText = razao;
    document.getElementById('preview-doc-cliente').innerText =
      'inscrita no CNPJ sob o nº ' + (document.getElementById('input-razao-cliente').value || '_________________');
  }
}

document.getElementById('input-nome-prof').addEventListener('input', atualizarPreviewProfissional);
document.getElementById('input-cpf-prof').addEventListener('input', atualizarPreviewProfissional);
document.getElementById('input-razao-prof').addEventListener('input', atualizarPreviewProfissional);
document.getElementById('input-cnpj-prof').addEventListener('input', atualizarPreviewProfissional);

document.getElementById('input-nome-cliente').addEventListener('input', atualizarPreviewCliente);
document.getElementById('input-cpf-cliente').addEventListener('input', atualizarPreviewCliente);
document.getElementById('input-razao-cliente').addEventListener('input', atualizarPreviewCliente);
document.getElementById('input-cnpj-cliente').addEventListener('input', atualizarPreviewCliente);

document.getElementById('input-numero').addEventListener('input', (e) => {
  document.getElementById('preview-num-prof').innerText = e.target.value || '___';
});

document.getElementById('input-complemento').addEventListener('input', (e) => {
  const val = e.target.value;
  const container = document.getElementById('preview-complemento-container');
  if (val && val.trim() !== '') {
    document.getElementById('preview-comp-prof').innerText = val;
    container.style.display = 'inline';
  } else {
    container.style.display = 'none';
  }
});

document.getElementById('input-servico').addEventListener('input', (e) => {
  document.getElementById('preview-servico').innerText =
    e.target.value.toUpperCase() || '__________________________________';
});

function atualizarPrazo() {
  let num = document.getElementById('input-prazo-numero').value;
  let tipo = document.getElementById('input-prazo-tipo').value.toLowerCase();
  if (num === '1' || num === 1) {
    if (tipo === 'dias')    tipo = 'dia';
    if (tipo === 'semanas') tipo = 'semana';
    if (tipo === 'meses')   tipo = 'mês';
    if (tipo === 'anos')    tipo = 'ano';
  }
  document.getElementById('preview-prazo-numero').innerText = num || '___';
  document.getElementById('preview-prazo-tipo').innerText = tipo;
}
document.getElementById('input-prazo-numero').addEventListener('input', atualizarPrazo);
document.getElementById('input-prazo-tipo').addEventListener('change', atualizarPrazo);

// --- ESPELHAMENTO FINANCEIRO ---
function mascaraMoeda(v) {
  v = v.replace(/\D/g, "");
  if (v === "") return "";
  v = (v / 100).toFixed(2) + "";
  v = v.replace(".", ",");
  v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  return v;
}
document.getElementById('input-valor').addEventListener('input', function(e) {
  e.target.value = mascaraMoeda(e.target.value);
  document.getElementById('preview-valor').innerText = e.target.value || "0,00";
});
document.getElementById('input-forma-pagamento').addEventListener('change', function(e) {
  document.getElementById('preview-forma-pagamento').innerText = e.target.value || "_______";
});
document.getElementById('input-metodo-pagamento').addEventListener('change', function(e) {
  document.getElementById('preview-metodo-pagamento').innerText = e.target.value || "_______";
});

// ==========================================
// 7. MÁSCARAS CPF E CNPJ
// ==========================================
function mascaraCPF(v) {
  return v.replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14);
}
function mascaraCNPJ(v) {
  return v.replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
    .substring(0, 18);
}

['input-cpf-prof', 'input-cpf-cliente'].forEach(id => {
  document.getElementById(id).addEventListener('input', function(e) {
    e.target.value = mascaraCPF(e.target.value);
  });
});
['input-cnpj-prof', 'input-cnpj-cliente'].forEach(id => {
  document.getElementById(id).addEventListener('input', function(e) {
    e.target.value = mascaraCNPJ(e.target.value);
  });
});

// ==========================================
// 8. VALIDADORES CPF E CNPJ
// ==========================================
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let s = 0, r;
  for (let i = 0; i < 9; i++) s += +cpf[i] * (10 - i);
  r = (s * 10) % 11; if (r >= 10) r = 0;
  if (r !== +cpf[9]) return false;
  s = 0;
  for (let i = 0; i < 10; i++) s += +cpf[i] * (11 - i);
  r = (s * 10) % 11; if (r >= 10) r = 0;
  return r === +cpf[10];
}

function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/\D/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  const dg = (c, p) => {
    const s = p.reduce((acc, v, i) => acc + +c[i] * v, 0);
    const r = s % 11; return r < 2 ? 0 : 11 - r;
  };
  return dg(cnpj, [5,4,3,2,9,8,7,6,5,4,3,2]) === +cnpj[12] &&
         dg(cnpj, [6,5,4,3,2,9,8,7,6,5,4,3,2]) === +cnpj[13];
}

function marcarErro(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#e53e3e';
  el.style.boxShadow = '0 0 0 3px rgba(229,62,62,0.2)';
  el.addEventListener('input', function() {
    el.style.borderColor = '';
    el.style.boxShadow = '';
  }, { once: true });
}

// ==========================================
// 9. VALIDAÇÕES POR ETAPA
// ==========================================
function validarEtapa1() {
  const cepDigitos = document.getElementById('input-cep').value.replace(/\D/g, '');
  const servico = document.getElementById('input-servico').value.trim();
  const prazo = document.getElementById('input-prazo-numero').value;
  const valor = document.getElementById('input-valor').value;
  const forma = document.getElementById('input-forma-pagamento').value;
  const metodo = document.getElementById('input-metodo-pagamento').value;

  if (!servico) { marcarErro('input-servico'); alert('Descreva o serviço que será prestado.'); return; }
  if (!prazo) { marcarErro('input-prazo-numero'); alert('Informe o prazo ou duração do serviço.'); return; }

  if (!valor || !forma || !metodo) {
    if (!valor) marcarErro('input-valor');
    if (!forma) marcarErro('input-forma-pagamento');
    if (!metodo) marcarErro('input-metodo-pagamento');
    alert('Por favor, preencha o valor e os métodos de pagamento para blindar o contrato.');
    return;
  }

  if (cepDigitos.length !== 8) { marcarErro('input-cep'); alert('Informe um CEP com 8 números.'); return; }

  if (cidadeForo) { avancarParaEtapa2(); return; }

  buscarCEP(cepDigitos, function(sucesso) {
    if (sucesso) { avancarParaEtapa2(); }
    else { alert('CEP não encontrado. Verifique o número e tente novamente.'); }
  });
}

function validarEtapa2() {
  const tipo = document.querySelector('input[name="tipo-profissional"]:checked').value;
  if (tipo === 'cpf') {
    if (!document.getElementById('input-nome-prof').value.trim()) { marcarErro('input-nome-prof'); alert('Informe seu nome completo.'); return false; }
    if (!validarCPF(document.getElementById('input-cpf-prof').value)) { marcarErro('input-cpf-prof'); alert('CPF inválido.'); return false; }
  } else {
    if (!document.getElementById('input-razao-prof').value.trim()) { marcarErro('input-razao-prof'); alert('Informe a razão social.'); return false; }
    if (!validarCNPJ(document.getElementById('input-cnpj-prof').value)) { marcarErro('input-cnpj-prof'); alert('CNPJ inválido.'); return false; }
  }
  return true;
}

function validarEtapa3() {
  const tipo = document.querySelector('input[name="tipo-cliente"]:checked').value;
  if (tipo === 'cpf') {
    if (!document.getElementById('input-nome-cliente').value.trim()) { marcarErro('input-nome-cliente'); alert('Informe o nome do cliente.'); return false; }
    if (!validarCPF(document.getElementById('input-cpf-cliente').value)) { marcarErro('input-cpf-cliente'); alert('CPF do cliente inválido.'); return false; }
  } else {
    if (!document.getElementById('input-razao-cliente').value.trim()) { marcarErro('input-razao-cliente'); alert('Informe a razão social.'); return false; }
    if (!validarCNPJ(document.getElementById('input-cnpj-cliente').value)) { marcarErro('input-cnpj-cliente'); alert('CNPJ do cliente inválido.'); return false; }
  }
  const wa = document.getElementById('input-whatsapp-cliente').value.replace(/\D/g, '');
  if (wa.length < 10) { marcarErro('input-whatsapp-cliente'); alert('Informe o WhatsApp do cliente.'); return false; }
  return true;
}

// ==========================================
// 10. LIMITE GRATUITO (localStorage)
// ==========================================
const LIMITE_GRATIS = 1;
function contratosGerados() { return parseInt(localStorage.getItem('cs_contratos') || '0'); }
function registrarContratoGerado() { localStorage.setItem('cs_contratos', contratosGerados() + 1); }
function limiteAtingido() { return contratosGerados() >= LIMITE_GRATIS; }

// ==========================================
// 11. BOTÃO GERAR DOCUMENTO
// ==========================================
document.getElementById('btn-avancar-3').addEventListener('click', () => {
  if (!validarEtapa3()) return;
  if (limiteAtingido()) { mostrarTela('tela-gate'); return; }

  const tipoProf    = document.querySelector('input[name="tipo-profissional"]:checked').value;
  const tipoCliente = document.querySelector('input[name="tipo-cliente"]:checked').value;

  window.dadosContrato = {
    cidade:       cidadeForo,
    cep:          document.getElementById('input-cep').value,
    rua:          document.getElementById('preview-rua-prof').innerText,
    numero:       document.getElementById('input-numero').value,
    complemento:  document.getElementById('input-complemento').value,
    bairro:       document.getElementById('preview-bairro-prof').innerText,
    servico:      document.getElementById('input-servico').value,
    prazoN:       document.getElementById('input-prazo-numero').value,
    prazoT:       document.getElementById('input-prazo-tipo').value,

    valor:           document.getElementById('input-valor').value,
    formaPagamento:  document.getElementById('input-forma-pagamento').value,
    metodoPagamento: document.getElementById('input-metodo-pagamento').value,

    tipoProf,
    nomeProf:     tipoProf === 'cpf' ? document.getElementById('input-nome-prof').value : document.getElementById('input-razao-prof').value,
    docProf:      tipoProf === 'cpf' ? document.getElementById('input-cpf-prof').value : document.getElementById('input-cnpj-prof').value,
    whatsappProf: document.getElementById('input-whatsapp-prof').value,

    tipoCliente,
    nomeCliente:  tipoCliente === 'cpf' ? document.getElementById('input-nome-cliente').value : document.getElementById('input-razao-cliente').value,
    docCliente:   tipoCliente === 'cpf' ? document.getElementById('input-cpf-cliente').value : document.getElementById('input-cnpj-cliente').value,
    whatsappCliente: document.getElementById('input-whatsapp-cliente').value,
    data:         dataAtual.toLocaleDateString('pt-BR', opcoesData),
    ts:           new Date().toISOString(),
  };

  mostrarTela('tela-assinar');
  iniciarCanvas('canvas-prof', 'hint-prof', 'status-sig-prof');
});

// ==========================================
// 12. CONTROLE DE TELAS
// ==========================================
function mostrarTela(id) {
  document.querySelector('.layout-principal').style.display = 'none';
  ['tela-gate', 'tela-assinar', 'tela-cliente'].forEach(t => {
    const el = document.getElementById(t);
    if (el) el.style.display = 'none';
  });
  const alvo = document.getElementById(id);
  if (alvo) alvo.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function voltarParaFormulario() {
  document.querySelector('.layout-principal').style.display = '';
  ['tela-gate', 'tela-assinar', 'tela-cliente'].forEach(t => {
    const el = document.getElementById(t);
    if (el) el.style.display = 'none';
  });
}

// ==========================================
// 13. CANVAS DE ASSINATURA
// ==========================================
function iniciarCanvas(canvasId, hintId, statusId) {
  const canvas  = document.getElementById(canvasId);
  const hint    = document.getElementById(hintId);
  const statusEl = document.getElementById(statusId);
  canvas.width = canvas.offsetWidth;
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#0b1a2a';
  ctx.lineWidth   = 2.5;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  let desenhando = false;

  function posicao(e) {
    const r   = canvas.getBoundingClientRect();
    const esc = canvas.width / r.width;
    if (e.touches) return { x: (e.touches[0].clientX - r.left) * esc, y: (e.touches[0].clientY - r.top) * esc };
    return { x: (e.clientX - r.left) * esc, y: (e.clientY - r.top) * esc };
  }

  function iniciar(e) {
    desenhando = true; ctx.beginPath();
    const p = posicao(e); ctx.moveTo(p.x, p.y);
    if (hint) hint.style.display = 'none';
  }
  function desenhar(e) {
    if (!desenhando) return;
    const p = posicao(e); ctx.lineTo(p.x, p.y); ctx.stroke();
  }
  function terminar() {
    desenhando = false;
    if (statusEl) statusEl.innerText = '✓ Assinatura registrada';
    if (canvasId === 'canvas-cli') {
      const btn = document.getElementById('btn-confirmar-cliente');
      if (btn) btn.style.display = 'block';
    }
  }

  canvas.addEventListener('mousedown',  iniciar);
  canvas.addEventListener('mousemove',  desenhar);
  canvas.addEventListener('mouseup',    terminar);
  canvas.addEventListener('touchstart', e => { e.preventDefault(); iniciar(e); },  { passive: false });
  canvas.addEventListener('touchmove',  e => { e.preventDefault(); desenhar(e); }, { passive: false });
  canvas.addEventListener('touchend',   terminar, { passive: false });
}

function limparCanvas(canvasId, hintId, statusId) {
  const canvas = document.getElementById(canvasId);
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  if (hintId) document.getElementById(hintId).style.display = 'flex';
  if (statusId) document.getElementById(statusId).innerText = '';
  if (canvasId === 'canvas-cli') {
    const btn = document.getElementById('btn-confirmar-cliente');
    if (btn) btn.style.display = 'none';
  }
}

// ==========================================
// 14. COMPRIMIR ASSINATURA
// ==========================================
function comprimirAssinatura(canvas) {
  const mini = document.createElement('canvas');
  mini.width  = 300; mini.height = 80;
  const ctx = mini.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 300, 80);
  ctx.drawImage(canvas, 0, 0, 300, 80);
  return mini.toDataURL('image/jpeg', 0.2);
}

function temAssinatura(canvas) {
  const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  return pixels.some((v, i) => i % 4 === 3 && v > 0);
}

// ==========================================
// 15. PROFISSIONAL ASSINA E GERA LINK
// ==========================================
document.getElementById('btn-profissional-assinou').addEventListener('click', () => {
  const canvas = document.getElementById('canvas-prof');
  if (!temAssinatura(canvas)) { alert('Por favor, assine o documento antes de continuar.'); return; }

  const sigProf   = comprimirAssinatura(canvas);
  const dadosLink = { ...window.dadosContrato, sigProf };
  const codificado = btoa(encodeURIComponent(JSON.stringify(dadosLink)));
  const link = window.location.href.split('#')[0] + '#cs=' + codificado;

  window.linkGerado = link;
  document.getElementById('texto-link-gerado').value = link;
  registrarContratoGerado();
  document.getElementById('secao-acoes-prof').style.display = 'block';
  document.getElementById('btn-profissional-assinou').style.display = 'none';
});

document.getElementById('btn-wa-prof').addEventListener('click', () => {
  const wa   = window.dadosContrato.whatsappCliente.replace(/\D/g, '');
  const nome = window.dadosContrato.nomeCliente;
  const msg  = encodeURIComponent(
    'Olá' + (nome ? ' ' + nome.split(' ')[0] : '') + '! Preparei o nosso contrato.\n\n' +
    'Acesse o link para ler e assinar:\n\n' + window.linkGerado + '\n\nQualquer dúvida, é só falar! 🤝'
  );
  window.open('https://wa.me/55' + wa + '?text=' + msg, '_blank');
});

document.getElementById('btn-copiar-link').addEventListener('click', () => {
  navigator.clipboard.writeText(window.linkGerado).then(() => {
    const btn = document.getElementById('btn-copiar-link');
    btn.innerText = '✓ Copiado!'; btn.style.background = '#e6fffa';
    setTimeout(() => { btn.innerText = '📋 Copiar link'; btn.style.background = ''; }, 2500);
  });
});

// ==========================================
// 16. TELA DO CLIENTE (link #cs=...)
// ==========================================
window.addEventListener('load', () => {
  const hash = window.location.hash;
  if (!hash.startsWith('#cs=')) return;
  try {
    const dados = JSON.parse(decodeURIComponent(atob(hash.slice(4))));
    carregarTelaCliente(dados);
  } catch (e) { console.warn('Link inválido:', e); }
});

function carregarTelaCliente(dados) {
  const sigProfHTML = dados.sigProf ? `<img src="${dados.sigProf}" style="height:50px;display:block;margin:4px 0">` : '';

  document.getElementById('contrato-cliente').innerHTML = `
    <h3 style="text-align:center;font-size:15px;font-weight:bold;
      text-transform:uppercase;letter-spacing:1px;color:#0b1a2a;margin-bottom:5px">
      Contrato de Prestação de Serviços
    </h3>
    <p style="text-align:right;color:#a0aec0;font-size:13px;margin-bottom:30px">
      ${dados.cidade}, ${dados.data}
    </p>
    <div style="font-family:'Times New Roman',serif;font-size:15px;line-height:1.7;color:#000">
      <strong style="font-family:Arial,sans-serif;font-size:13px">IDENTIFICAÇÃO DAS PARTES</strong><br><br>
      <strong style="font-family:Arial,sans-serif;font-size:13px">Contratado(a):</strong>
      ${dados.nomeProf.toUpperCase()}, ${dados.tipoProf === 'cpf' ? 'inscrito no CPF sob o nº' : 'inscrita no CNPJ sob o nº'}
      ${dados.docProf}, domiciliado(a) em ${dados.rua}, nº ${dados.numero}${dados.complemento ? ', ' + dados.complemento : ''},
      ${dados.bairro}, ${dados.cidade} — CEP ${dados.cep}.<br><br>
      <strong style="font-family:Arial,sans-serif;font-size:13px">Contratante:</strong>
      ${dados.nomeCliente.toUpperCase()}, ${dados.tipoCliente === 'cpf' ? 'inscrito no CPF sob o nº' : 'inscrita no CNPJ sob o nº'}
      ${dados.docCliente}.<br><br><br>

      <strong style="font-family:Arial,sans-serif;font-size:13px">1. OBJETO DO CONTRATO</strong><br>
      O presente documento tem como objeto a prestação de serviços de
      ${dados.servico.toUpperCase()} a serem executados em prol do Contratante citado acima.<br><br>

      <strong style="font-family:Arial,sans-serif;font-size:13px">2. PRAZO OU DURAÇÃO</strong><br>
      O serviço acima possui prazo ou duração estipulada de ${dados.prazoN} ${dados.prazoT},
      tendo as partes o dever de cumprir as obrigações acordadas com máxima transparência.<br><br>

      <strong style="font-family:Arial,sans-serif;font-size:13px">3. VALOR E PAGAMENTO</strong><br>
      Fica acordado o valor total de R$ ${dados.valor}, a ser pago ${dados.formaPagamento} através de ${dados.metodoPagamento}.<br><br><br>

      <strong style="font-family:Arial,sans-serif;font-size:13px">4. FORO</strong><br>
      Para dirimir quaisquer dúvidas ou litígios oriundos do presente instrumento,
      fica eleito o foro da comarca de ${dados.cidade}.<br><br><br>

      E por estarem justos e contratados, assinam o presente instrumento.
    </div>
    <div style="background:#f0fff4;border:1px solid #c6f6d5;border-radius:8px;
      padding:12px;margin:20px 0;font-size:13px">
      ✅ <strong>${dados.nomeProf.toUpperCase()}</strong> (CONTRATADO) já assinou digitalmente
      em ${new Date(dados.ts).toLocaleDateString('pt-BR')}.
      ${sigProfHTML}
    </div>
  `;

  window.dadosContrato = dados;
  document.getElementById('cli-remetente').innerText =
    dados.nomeProf + ' compartilhou este contrato para sua leitura e assinatura.';
  mostrarTela('tela-cliente');
  iniciarCanvas('canvas-cli', 'hint-cli', 'status-sig-cli');
}

function confirmarAssinaturaCliente() {
  const canvas = document.getElementById('canvas-cli');
  if (!temAssinatura(canvas)) { alert('Por favor, assine o documento antes de confirmar.'); return; }

  const sigCli    = comprimirAssinatura(canvas);
  const dadosFinal = { ...window.dadosContrato, sigCli };
  const codificado = btoa(encodeURIComponent(JSON.stringify(dadosFinal)));
  window.linkFinal = window.location.href.split('#')[0] + '#cs=' + codificado;

  const assinDiv = document.createElement('div');
  assinDiv.innerHTML = `
    <div style="background:#f0fff4;border:1px solid #c6f6d5;border-radius:8px;
      padding:12px;margin:16px 0;font-size:13px">
      ✅ <strong>${window.dadosContrato.nomeCliente.toUpperCase()}</strong> (CONTRATANTE)
      assinou digitalmente em ${new Date().toLocaleDateString('pt-BR')}.
      <img src="${sigCli}" style="height:50px;display:block;margin:4px 0">
    </div>
  `;
  document.getElementById('contrato-cliente').appendChild(assinDiv);
  document.getElementById('btn-confirmar-cliente').style.display = 'none';
  document.getElementById('secao-pos-assinatura').style.display  = 'block';
}

function avisarProfissional() {
  const dados  = window.dadosContrato;
  const waProf = dados.whatsappProf ? dados.whatsappProf.replace(/\D/g, '') : '';
  const msg    = encodeURIComponent(
    'Olá! Assinei o contrato de "' + dados.servico + '".\n\n' +
    'Acesse o link para ver o documento com as duas assinaturas e salvar sua cópia:\n\n' + window.linkFinal
  );
  if (waProf) { window.open('https://wa.me/55' + waProf + '?text=' + msg, '_blank'); }
  else { navigator.clipboard.writeText(window.linkFinal).then(() => { alert('Link copiado!'); }); }
}

// ==========================================
// 17. IMPRIMIR CONTRATO (PDF em página única)
// ==========================================
function imprimirContrato(tipo) {
  const d = window.dadosContrato;
  if (!d) { alert('Dados do contrato não encontrados. Gere o contrato novamente.'); return; }

  let sigProfImg = '';
  let sigCliImg  = '';

  if (tipo === 'prof') {
    const canvas = document.getElementById('canvas-prof');
    if (temAssinatura(canvas)) sigProfImg = canvas.toDataURL('image/png');
    sigCliImg = '';
  } else {
    sigProfImg = d.sigProf || '';
    const canvas = document.getElementById('canvas-cli');
    if (temAssinatura(canvas)) sigCliImg = canvas.toDataURL('image/png');
  }

  const endereco = `${d.rua}, nº ${d.numero}` + (d.complemento ? `, ${d.complemento}` : '') + `, ${d.bairro}, ${d.cidade} — CEP ${d.cep}`;
  const docProfTxt = d.tipoProf === 'cpf' ? 'inscrito(a) no CPF sob o nº' : 'inscrita no CNPJ sob o nº';
  const docCliTxt = d.tipoCliente === 'cpf' ? 'inscrito(a) no CPF sob o nº' : 'inscrita no CNPJ sob o nº';

  const blocoSigProf = sigProfImg ? `<img src="${sigProfImg}" style="height:44px;display:block;margin:0 auto 2px">` : `<div style="height:46px"></div>`;
  const blocoSigCli = sigCliImg ? `<img src="${sigCliImg}" style="height:44px;display:block;margin:0 auto 2px">` : `<div style="height:46px"></div>`;
  const pendenteCli = sigCliImg ? '' : ' <span style="font-size:10px;color:#b7791f">(aguardando assinatura)</span>';

  // Carimbo de data/hora REAL do sistema + código de referência do documento.
  // (Honesto: a data/hora é verdadeira; o código é apenas um identificador do documento,
  //  NÃO uma trilha de auditoria. Trilha real com IP/geolocalização exige servidor — fase futura.)
  const carimboTempo = new Date().toLocaleString('pt-BR');
  const refDocumento = btoa(d.docProf + d.docCliente + carimboTempo).substring(0, 15).toUpperCase();

  // Texto da assinatura conforme quem já assinou (honesto)
  const ambosAssinaram = sigProfImg && sigCliImg;
  const textoAssinatura = ambosAssinaram
    ? 'Documento aceito e assinado eletronicamente por ambas as partes, mediante desenho da assinatura no próprio dispositivo.'
    : 'Documento assinado eletronicamente pelo Contratado. Aguardando a assinatura do Contratante.';

  const janela = window.open('', '_blank', 'width=850,height=750');
  janela.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>ContratoSeguro - PDF</title>
      <style>
        @page { size: A4; margin: 1.3cm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; color: #000; }
        .borda-topo { border-top: 5px solid #0b1a2a; padding-top: 14px; }
        .titulo { text-align: center; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .data { text-align: right; color: #555; font-size: 12px; margin-bottom: 16px; }
        .corpo { font-family: 'Times New Roman', serif; font-size: 13.5px; line-height: 1.55; }
        .corpo strong { font-family: Arial, sans-serif; font-size: 12px; }
        .secao { margin-top: 10px; }
        .assinaturas { display: flex; justify-content: space-between; margin-top: 26px; }
        .bloco-assin { width: 45%; text-align: center; font-family: 'Times New Roman', serif; }
        .linha { border-top: 1px solid #000; padding-top: 5px; }
        .nome-assin { font-weight: bold; font-size: 12px; }
        .papel-assin { font-size: 11px; color: #333; }
        .rodape { margin-top: 34px; border-top: 1px solid #ccc; padding-top: 10px; font-size: 10px; font-family: Arial, sans-serif; line-height: 1.5; }
        .rodape .ref { color: #333; }
        .rodape .aviso { color: #666; margin-top: 8px; }
        .rodape .marca { text-align: center; margin-top: 12px; font-style: italic; color: #999; }
      </style>
    </head>
    <body>
      <div class="borda-topo">
        <div class="titulo">Contrato de Prestação de Serviços</div>
        <div class="data">${d.cidade}, ${d.data}</div>

        <div class="corpo">
          <strong>IDENTIFICAÇÃO DAS PARTES</strong><br><br>
          <strong>Contratado(a):</strong> ${d.nomeProf.toUpperCase()}, ${docProfTxt} ${d.docProf}, domiciliado(a) no endereço: ${endereco}.<br><br>
          <strong>Contratante:</strong> ${d.nomeCliente.toUpperCase()}, ${docCliTxt} ${d.docCliente}.

          <div class="secao"><strong>1. OBJETO DO CONTRATO</strong><br>
          O presente documento tem como objeto a prestação de serviços de ${d.servico.toUpperCase()} a serem executados em prol do Contratante citado acima.</div>

          <div class="secao"><strong>2. PRAZO OU DURAÇÃO</strong><br>
          O serviço acima possui prazo ou duração estipulada de ${d.prazoN} ${d.prazoT}, tendo as partes o dever de cumprir as obrigações acordadas com máxima transparência.</div>

          <div class="secao"><strong>3. VALOR E PAGAMENTO</strong><br>
          Fica acordado o valor total de R$ ${d.valor}, a ser pago ${d.formaPagamento} através de ${d.metodoPagamento}.</div>

          <div class="secao"><strong>4. FORO</strong><br>
          Para dirimir quaisquer dúvidas ou litígios oriundos do presente instrumento, fica eleito o foro da comarca de ${d.cidade}.</div>

          <div class="secao">E por estarem justos e contratados, assinam o presente instrumento.</div>
        </div>

        <div class="assinaturas">
          <div class="bloco-assin">
            ${blocoSigProf}
            <div class="linha"></div>
            <div class="nome-assin">${d.nomeProf.toUpperCase()}</div>
            <div class="papel-assin">Contratado(a)</div>
          </div>
          <div class="bloco-assin">
            ${blocoSigCli}
            <div class="linha"></div>
            <div class="nome-assin">${d.nomeCliente.toUpperCase()}</div>
            <div class="papel-assin">Contratante${pendenteCli}</div>
          </div>
        </div>

        <div class="rodape">
           <p style="font-weight:bold; color:#0b1a2a; margin-bottom:4px;">Assinatura Eletrônica</p>
           <p>${textoAssinatura}</p>
           <p class="ref"><strong>Data e hora de geração:</strong> ${carimboTempo}</p>
           <p class="ref"><strong>Código de referência do documento:</strong> CS-${refDocumento}</p>
           <p class="aviso">Este documento possui valor jurídico de prova entre as partes (Art. 219 do Código Civil e MP nº 2.200-2/2001). Não substitui assinatura com certificado digital ICP-Brasil nem orientação jurídica especializada.</p>
           <p class="marca">Criado em ContratoSeguro · ${carimboTempo}</p>
        </div>
      </div>
    </body>
    </html>
  `);
  janela.document.close();
  setTimeout(() => { janela.print(); }, 500);
}