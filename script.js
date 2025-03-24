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
    
    const apiUrl = 'http://localhost:5000/boosters';
    
    const urlWithNoCache = `${apiUrl}?_=${Date.now()}`;
    
    console.log('Tentando conectar à API em:', urlWithNoCache);
    
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
            
            // ta bugando, ver dps. resolvido
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
                    <p>Verifique se o bot está online e se a URL da API está correta.</p>
                </div>
            `;
        });
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