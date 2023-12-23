# LoteriaAPI
API com os resultados dos concursos dos jogos da loteria federal

Este projeto consiste em uma API simples para obter resultados da Loteria Federal, incluindo jogos como Mega-Sena, Quina, Lotomania e Lotofácil.

## Funcionalidades

- Obtenha os resultados mais recentes dos jogos.
- Todos os resultados já efetivados
- Consulte os números sorteados de um concurso específico.

## Jogos disponíveis

- **Mega-Sena**
- **Quina**
- **Lotomania**
- **Lotofácil**

## Como instalar na máquina o projeto

**# Instalar o PostgreSQL:**

1 -  Instale o PostgreSQL em sua máquina e salve a senha utilizada para o banco de dados.

**# Clonar o Repositório:**

1 - Clone o repositório do projeto para o seu ambiente local

**# Instalar Dependências:**

1 - Abra um terminal na pasta do projeto e execute o comando **npm install**
<br>
2 - Configurar as Variáveis de Ambientes:
<br>
2.1 - Na pasta “backend”, crie um arquivo chamado ‘.env’ e adicione as seguintes informações:

DATABASE_URL="postgresql://postgres:senhaDoPostgres@localhost:5432/mega?schema=public"
<br>
REDIS_AUTH="senhaDoRedis"
<br>
API_RESULTS='https://servicebus2.caixa.gov.br/portaldeloterias/api/'

**# Verificar a versão do Node:**

1 - Certifique-se de ter o Node.js instalado e atualizado para a versão 16 ou superior, pois o prisma requer essa versão
<br>
2 - Migrar o Banco de dados:
<br>
2.1 - Execute o comando para migrar os modelos do esquema para o banco de dados:
- npx prisma migrate dev

**# Instalar o Redis:**
<br>
Para instalar o Redis no windows , siga as etapas abaixo: 

1 - Primeiro, instale o WSL2 no Windows para executar binários Linux nativamente no Windows.
<br>
2 - Habilite o Hiper-V em “Ativar ou Desativar Recursos do Windows”
<br>
3 - Abra o CMD e execute os Seguintes comandos:
- wsl –install
- wsl -l -v
- wsl –install -d Ubuntu

- No arquivo redis.conf na linha onde está escrito requirepass alterar a senha para a senha do .env REDIS_AUTH

4 - Digite Ubuntu no terminal para configurar um usuário e senha. Para instruções detalhadas, consulte : https://learn.microsoft.com/en-us/windows/wsl/install
Dentro do Terminal do Ubuntu, execute os seguintes comando:

- curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
- echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

- sudo apt-get update
- sudo apt-get install redis
- sudo service redis-server start

5 - Após, ir até a pasta /etc/redis e editar o arquivo redis.conf digitando REQUIREPASS senha_aqui e alterar o .env REDIS_AUTH com a senha desejada.

# iniciar o Servidor Redis:
<br>
Para iniciar o redis, execute o comando dentro do wsl:
- sudo service redis-server start

Para iniciar o servidor, execute o seguinte comando na pasta do projeto:
- npm run dev

# Iniciando com o docker

Há algumas pequenas alterações para executar com o docker

- Ao montar com o DOCKER, no .env em DATABASE_URL haverá uma pequena alteração no host:
DATABASE_URL="postgresql://postgres:'senhaDoSeuPostgreSQL'@host.docker.internal:5432/mega?schema=public"

- Executar na porta 3000, pois o código está direcionando para esta porta.

- Há a necessidade de instalar o banco de dados separadamente do docker devido a boas práticas.

## Exemplo de Uso

O projeto está hospedado para visualização.
Para obter os resultados dos jogos, faça uma solicitação HTTP GET para:

http//:..../megasena/all - **Obtém todos os resultados já sorteados da Megasena**
<br>
http//:..../megasena?conc=2500 - **Obtém o resultado do concurso 2500 da Megasena**
<br>
http//:..../quina/all - **Obtém todos os resultados já sorteados da Quina**
<br>
http//:..../quina?conc=2500 - **Obtém o resultado do concurso 2500 da Quina**

**E assim por diante em todos os outros jogos.**
