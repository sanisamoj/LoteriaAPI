FROM node:18.17
WORKDIR /app
COPY . .
COPY .env /app/.env
#Instalará o Redis
RUN apt-get update && apt-get install -y redis-server
#Irá copiar as configurações estabelecidas para o redis
COPY redis.conf /etc/redis/redis.conf
#Irá instalar as dependências do projeto
RUN npm install
#Irá migrar o banco de dados
RUN npx prisma migrate deploy
#Irá instalar as dependências para o bot do whatsapp funcionar
RUN apt-get update --fix-missing
#Irá transpilar todo o código .ts para .js
RUN npm run build
#Vai expôr o sistema na porta 3000
EXPOSE 3000
# Configuração para iniciar o Redis com autenticação e iniciar o sistema
CMD redis-server /etc/redis/redis.conf --daemonize yes && npm run start