/**
 * Arquivo responsável pela integração com a API do GitHub
 * e exibição de projetos e estatísticas
 */

// Configurações
const username = 'juanmmendes'; // Seu nome de usuário do GitHub
const maxProjects = 15; // Número máximo de projetos para exibir

// Elementos DOM
const projectsGrid = document.getElementById('projects-grid');
const repoLanguages = document.getElementById('repo-languages');

// Função para buscar repositórios do GitHub
async function fetchRepositories() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error('Falha ao buscar repositórios');
        }
        
        const repos = await response.json();
        
        // Filtrar repositórios que não são forks e selecionar os mais recentes
        const filteredRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, maxProjects);
        
        return filteredRepos;
    } catch (error) {
        console.error('Erro ao buscar repositórios:', error);
        return [];
    }
}

// Função para buscar as linguagens de um repositório
async function fetchRepoLanguages(repoName) {
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/languages`);
        
        if (!response.ok) {
            throw new Error('Falha ao buscar linguagens');
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Erro ao buscar linguagens para ${repoName}:`, error);
        return {};
    }
}

// Função para criar um cartão de projeto
function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Determinar a imagem com base no nome ou descrição do repositório
    const imageUrl = getRepoImage(repo);
    
    // Limitar a descrição a um número máximo de caracteres
    const description = repo.description 
        ? (repo.description.length > 100 ? repo.description.substring(0, 97) + '...' : repo.description)
        : 'Sem descrição disponível';
    
    card.innerHTML = `
        
        <div class="project-info">
            <h3>${repo.name}</h3>
            <p>${description}</p>
            <div class="project-tech" id="tech-${repo.id}">
                <!-- Tecnologias serão adicionadas dinamicamente -->
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" class="code-link">
                    <i class="fab fa-github"></i> Código
                </a>
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="demo-link">
                    <i class="fas fa-external-link-alt"></i> Demo
                </a>` : ''}
            </div>
        </div>
    `;
    
    return { card, techContainer: `tech-${repo.id}` };
}

// Função para determinar a imagem com base no nome ou descrição do repositório
function getRepoImage(repo) {
  const name = repo.name.toLowerCase();
  const description = repo.description?.toLowerCase() || "";

  const keywords = [
    "portfolio",
    "blog",
    "ecommerce",
    "api",
    "dashboard",
    "chat",
    "game",
    "landing",
    "bot",
    "finance",
    "weather",
    "todo"
  ];

  // Procura pela primeira palavra-chave que aparecer no nome ou descrição
  for (const keyword of keywords) {
    if (name.includes(keyword) || description.includes(keyword)) {
      // Usa imagem temática do Unsplash
      return `https://source.unsplash.com/600x400/?${keyword}`;
    }
  }

  // Se não encontrar nenhuma palavra-chave, usa uma imagem genérica
  return "https://source.unsplash.com/600x400/?technology,code";
}

// Função para coletar todas as linguagens de todos os repositórios
async function aggregateLanguages(repos) {
    const allLanguages = {};
    
    for (const repo of repos) {
        const languages = await fetchRepoLanguages(repo.name);
        
        for (const [lang, bytes] of Object.entries(languages)) {
            if (allLanguages[lang]) {
                allLanguages[lang] += bytes;
            } else {
                allLanguages[lang] = bytes;
            }
        }
    }
    
    return allLanguages;
}

// Função para gerar cores para cada linguagem
function getLanguageColor(language) {
    // Cores para linguagens comuns
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Python': '#3572A5',
        'Java': '#b07219',
        'PHP': '#4F5D95',
        'C#': '#178600',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33',
        'Rust': '#dea584',
        'Vue': '#41b883',
        'React': '#61dafb',
        'Angular': '#dd1b16'
    };
    
    return colors[language] || `hsl(${Math.random() * 360}, 70%, 50%)`;
}

// Função para criar o gráfico de distribuição de linguagens
function createLanguageChart(languages) {
    if (!repoLanguages) return;
    
    // Calcular o total de bytes para todas as linguagens
    const totalBytes = Object.values(languages).reduce((acc, bytes) => acc + bytes, 0);
    
    // Ordenar linguagens por quantidade de bytes (decrescente)
    const sortedLanguages = Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Mostrar apenas as 10 principais linguagens
    
    // Limpar conteúdo anterior
    repoLanguages.innerHTML = '<h4>Distribuição de Linguagens</h4>';
    
    // Criar a barra de distribuição
    const distributionBar = document.createElement('div');
    distributionBar.className = 'language-bar';
    distributionBar.style.display = 'flex';
    distributionBar.style.height = '30px';
    distributionBar.style.width = '100%';
    distributionBar.style.borderRadius = '15px';
    distributionBar.style.overflow = 'hidden';
    
    // Criar legenda
    const legend = document.createElement('div');
    legend.className = 'language-legend';
    legend.style.display = 'flex';
    legend.style.flexWrap = 'wrap';
    legend.style.gap = '10px';
    legend.style.marginTop = '15px';
    
    // Adicionar cada linguagem à barra e à legenda
    sortedLanguages.forEach(([language, bytes]) => {
        const percentage = (bytes / totalBytes * 100).toFixed(1);
        const color = getLanguageColor(language);
        
        // Segmento da barra
        const segment = document.createElement('div');
        segment.style.backgroundColor = color;
        segment.style.width = `${percentage}%`;
        segment.title = `${language}: ${percentage}%`;
        distributionBar.appendChild(segment);
        
        // Item da legenda
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.style.display = 'flex';
        legendItem.style.alignItems = 'center';
        legendItem.style.gap = '5px';
        
        const colorBox = document.createElement('div');
        colorBox.style.width = '15px';
        colorBox.style.height = '15px';
        colorBox.style.backgroundColor = color;
        colorBox.style.borderRadius = '3px';
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(document.createTextNode(`${language} (${percentage}%)`));
        legend.appendChild(legendItem);
    });
    
    repoLanguages.appendChild(distributionBar);
    repoLanguages.appendChild(legend);
}

// Função para adicionar as tecnologias ao cartão do projeto
async function addTechnologiesToCard(repoName, container) {
    try {
        const languages = await fetchRepoLanguages(repoName);
        const techContainer = document.getElementById(container);
        
        if (!techContainer) return;
        
        // Limitar a 5 tecnologias por projeto
        const topLanguages = Object.keys(languages).slice(0, 5);
        
        topLanguages.forEach(language => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.textContent = language;
            tag.style.backgroundColor = getLanguageColor(language);
            tag.style.color = isLightColor(getLanguageColor(language)) ? '#000' : '#fff';
            techContainer.appendChild(tag);
        });
    } catch (error) {
        console.error(`Erro ao adicionar tecnologias para ${repoName}:`, error);
    }
}

// Função para verificar se uma cor é clara
function isLightColor(hexColor) {
    // Verificar se é uma cor HEX válida
    if (!hexColor || !hexColor.startsWith('#')) {
        return false;
    }
    
    // Converter hex para RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calcular luminância
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5;
}

// Função principal para inicializar a exibição de projetos e estatísticas
async function initGitHubData() {
    try {
        // Buscar repositórios
        const repos = await fetchRepositories();
        
        if (repos.length === 0) {
            if (projectsGrid) {
                projectsGrid.innerHTML = '<p class="no-projects">Nenhum projeto encontrado.</p>';
            }
            return;
        }
        
        // Limpar o grid de projetos
        if (projectsGrid) {
            projectsGrid.innerHTML = '';
            
            // Adicionar projetos ao grid
            for (const repo of repos) {
                const { card, techContainer } = createProjectCard(repo);
                projectsGrid.appendChild(card);
                await addTechnologiesToCard(repo.name, techContainer);
            }
        }
        
        // Coletar todas as linguagens e criar o gráfico
        const allLanguages = await aggregateLanguages(repos);
        createLanguageChart(allLanguages);
        
    } catch (error) {
        console.error('Erro ao inicializar dados do GitHub:', error);
        
        if (projectsGrid) {
            projectsGrid.innerHTML = '<p class="error-message">Ocorreu um erro ao carregar os projetos. Por favor, tente novamente mais tarde.</p>';
        }
    }
}

// Iniciar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initGitHubData);
