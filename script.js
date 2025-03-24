document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.querySelector('.sidebar');
    const closeBtn = document.getElementById('close-menu');
    const overlay = document.getElementById('overlay');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    loadBoosters();
});

function loadBoosters() {
    const boostersContainer = document.getElementById('boosters-container');
    if (!boostersContainer) {
        console.error('Container de boosters não encontrado!');
        return;
    }
    
    boostersContainer.innerHTML = '<div class="loader">Carregando boosters...</div>';
    
    // URL do arquivo de boosters no GitHub
    const jsonUrl = 'https://raw.githubusercontent.com/wuwabr/wutheringwavesbrasil/main/data/boosters.json';
    
    // Adiciona um parâmetro para evitar cache
    const urlWithNoCache = `${jsonUrl}?_=${Date.now()}`;
    
    console.log('Tentando carregar dados de:', urlWithNoCache);
    
    fetch(urlWithNoCache)
        .then(response => {
            console.log('Resposta recebida:', response.status);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos:', data);
            
            if (data && data.length > 0) {
                boostersContainer.innerHTML = '';
                
                data.forEach(booster => {
                    const boosterCard = createBoosterCard(booster);
                    boostersContainer.appendChild(boosterCard);
                });
            } else {
                boostersContainer.innerHTML = '<p class="no-boosters">Nenhum booster encontrado no momento.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao carregar boosters:', error);
            boostersContainer.innerHTML = `
                <div class="error">
                    <p>Não foi possível carregar os boosters: ${error.message}</p>
                    <p>Verifique se o arquivo de boosters existe no GitHub.</p>
                    <p><button onclick="forceCreateBoostersFile()" class="retry-btn">Tentar criar arquivo</button></p>
                </div>
            `;
        });
    
    // Recarregar a cada 5 minutos
    setTimeout(loadBoosters, 5 * 60 * 1000);
}

function createBoosterCard(booster) {
    const card = document.createElement('div');
    card.className = 'booster-card';
    
    const avatarUrl = booster.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png';
    
    card.innerHTML = `
        <img src="${avatarUrl}" alt="Avatar de ${booster.name}" class="booster-avatar">
        <div class="booster-name">${booster.name}</div>
        <div class="booster-since">Boosting desde: ${booster.boost_since}</div>
    `;
    
    return card;
}

// Função para debugging - tente acessar a URL diretamente
function forceCreateBoostersFile() {
    // Esta função não cria realmente o arquivo, apenas abre a URL
    // para verificar se está acessível
    window.open('https://raw.githubusercontent.com/wuwabr/wutheringwavesbrasil/main/data/boosters.json', '_blank');
}