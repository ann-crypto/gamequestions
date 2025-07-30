# Perguntados - Jogo para Dois Jogadores

Uma aplicação web interativa baseada no famoso jogo Perguntados, desenvolvida com React (frontend) e Flask (backend).

## Características

- **Interface moderna e responsiva** com design atrativo usando Tailwind CSS
- **Sistema de perguntas e respostas** com 15 perguntas variadas
- **Pontuação em tempo real** para dois jogadores
- **Alternância automática de turnos** entre os jogadores
- **Feedback visual** para respostas corretas e incorretas
- **Limite de 10 perguntas por partida** para jogos dinâmicos
- **Tela de resultados** com declaração do vencedor

## Estrutura do Projeto

```
perguntados_game/
├── backend/
│   ├── src/
│   │   ├── main.py          # Servidor Flask principal
│   │   └── questions.json   # Base de dados das perguntas
│   ├── static/              # Arquivos do frontend buildado
│   ├── requirements.txt     # Dependências Python
│   └── venv/               # Ambiente virtual Python
└── frontend/
    ├── src/
    │   ├── App.jsx         # Componente principal React
    │   ├── App.css         # Estilos da aplicação
    │   └── components/     # Componentes UI
    ├── dist/               # Build de produção
    └── package.json        # Dependências Node.js
```

## Como Executar Localmente

### Pré-requisitos
- Python 3.11+
- Node.js 20+
- pnpm

### Backend (Flask)

1. Navegue até o diretório do backend:
```bash
cd perguntados_game/backend
```

2. Ative o ambiente virtual:
```bash
source venv/bin/activate
```

3. Execute o servidor:
```bash
cd src && python main.py
```

O backend estará disponível em `http://localhost:5001`

### Frontend (React)

1. Navegue até o diretório do frontend:
```bash
cd perguntados_game/frontend
```

2. Instale as dependências (se necessário):
```bash
pnpm install
```

3. Execute o servidor de desenvolvimento:
```bash
pnpm run dev --host
```

O frontend estará disponível em `http://localhost:5173`

### Versão Integrada

Para executar a versão integrada (frontend servido pelo backend):

1. Certifique-se de que o build do frontend foi feito:
```bash
cd perguntados_game/frontend
pnpm run build
```

2. Copie os arquivos para o backend:
```bash
cp -r dist/* ../backend/static/
```

3. Execute apenas o backend:
```bash
cd ../backend/src
python main.py
```

A aplicação completa estará disponível em `http://localhost:5001`

## Como Jogar

1. **Configuração**: Digite os nomes dos dois jogadores na tela inicial
2. **Início**: Clique em "Iniciar Jogo" para começar
3. **Gameplay**: 
   - Cada jogador responde uma pergunta por vez
   - Selecione uma das 4 opções disponíveis
   - Clique em "Confirmar Resposta"
   - Veja o feedback (correto/incorreto) e a resposta certa
4. **Pontuação**: Ganhe 1 ponto para cada resposta correta
5. **Final**: Após 10 perguntas, veja o resultado final e o vencedor

## Tecnologias Utilizadas

### Frontend
- **React 18** - Framework JavaScript
- **Tailwind CSS** - Framework de estilos
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones
- **Vite** - Build tool

### Backend
- **Flask** - Framework web Python
- **Flask-CORS** - Suporte a CORS
- **JSON** - Armazenamento de perguntas

## API Endpoints

- `POST /api/start-game` - Inicia um novo jogo
- `GET /api/get-question` - Obtém a próxima pergunta
- `POST /api/submit-answer` - Envia resposta do jogador
- `GET /api/game-state` - Obtém estado atual do jogo

## Funcionalidades Implementadas

✅ Sistema de perguntas e respostas  
✅ Alternância de jogadores  
✅ Pontuação em tempo real  
✅ Interface responsiva  
✅ Feedback visual  
✅ Limite de perguntas por jogo  
✅ Tela de resultados  
✅ Base de dados expandida (15 perguntas)  
✅ Contador de progresso  

## Possíveis Melhorias Futuras

- Adicionar mais categorias de perguntas
- Implementar sistema de dificuldade
- Adicionar efeitos sonoros
- Criar sistema de ranking
- Implementar modo online multiplayer
- Adicionar timer para respostas
- Criar banco de dados persistente

---

Desenvolvido como uma aplicação web completa para demonstrar integração entre React e Flask.

