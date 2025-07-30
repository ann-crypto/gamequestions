# Como Rodar o Jogo Perguntados

Para rodar a aplicação Perguntados, você precisará iniciar dois componentes principais: o **Backend (Flask)** e o **Frontend (React)**. Eles rodam em processos separados e se comunicam.

## Opção 1: Execução Separada (Recomendado para Desenvolvimento)

Esta é a forma mais comum e flexível de rodar a aplicação durante o desenvolvimento.

### 1. Iniciar o Backend (Servidor Flask)

O backend é responsável pela lógica do jogo, perguntas e respostas. Você precisará do Python instalado.

1.  Abra um terminal ou prompt de comando.
2.  Navegue até o diretório do backend:
    ```bash
    cd perguntados_game/backend
    ```
3.  Ative o ambiente virtual (se você o criou):
    -   No Linux/macOS:
        ```bash
        source venv/bin/activate
        ```
    -   No Windows (PowerShell):
        ```bash
        .\venv\Scripts\activate
        ```
4.  Execute o servidor Flask:
    ```bash
    python src/main.py
    ```
    Você verá mensagens indicando que o servidor Flask está rodando, provavelmente em `http://127.0.0.1:5001` ou `http://localhost:5001`.

### 2. Iniciar o Frontend (Servidor React)

O frontend é a interface gráfica do jogo que você interage no navegador. Você precisará do Node.js e pnpm (ou npm/yarn) instalados.

1.  Abra **outro** terminal ou prompt de comando (mantenha o terminal do backend aberto).
2.  Navegue até o diretório do frontend:
    ```bash
    cd perguntados_game/frontend
    ```
3.  Execute o servidor de desenvolvimento React:
    ```bash
    pnpm run dev --host
    ```
    Você verá mensagens indicando que o servidor React está rodando, provavelmente em `http://localhost:5173`.

### 3. Acessar o Jogo

Com ambos os servidores rodando, abra seu navegador e acesse:

`http://localhost:5173`

## Opção 2: Versão Integrada (Frontend Servido pelo Backend)

Nesta opção, o backend Flask também serve os arquivos do frontend, então você só precisa iniciar o servidor Flask. Esta é a configuração que seria mais próxima de um ambiente de produção simples.

### Pré-requisitos:
-   Você precisa ter feito o build do frontend e copiado os arquivos para o diretório `static` do backend. Se você seguiu as instruções anteriores, isso já foi feito.
    -   Para garantir, navegue até `perguntados_game/frontend` e execute `pnpm run build`.
    -   Em seguida, copie os arquivos: `cp -r dist/* ../backend/static/` (se estiver no diretório `frontend`).

### Como Iniciar:

1.  Abra um terminal ou prompt de comando.
2.  Navegue até o diretório do backend:
    ```bash
    cd perguntados_game/backend
    ```
3.  Ative o ambiente virtual:
    -   No Linux/macOS:
        ```bash
        source venv/bin/activate
        ```
    -   No Windows (PowerShell):
        ```bash
        .\venv\Scripts\activate
        ```
4.  Execute o servidor Flask:
    ```bash
    python src/main.py
    ```

### Acessar o Jogo

Com o servidor Flask rodando, abra seu navegador e acesse:

`http://localhost:5001`

--- 

**Observação:** O arquivo `README.md` na pasta principal do projeto (`perguntados_game/`) contém essas e outras instruções detalhadas sobre a estrutura do projeto e tecnologias utilizadas. Recomendo consultá-lo para mais informações.

