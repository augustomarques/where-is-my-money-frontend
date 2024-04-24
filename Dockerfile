# Etapa de Build
FROM node:18.20.2-alpine as build

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm install

# Copiar os arquivos do projeto
COPY . .

# Compilar a aplicação Angular para produção
RUN npm run build -- --output-path=./dist/out --configuration production

# Etapa de Execução
FROM nginx:alpine

# Copiar os arquivos estáticos para o diretório do nginx
COPY --from=build /app/dist/out /usr/share/nginx/html

# Expor a porta 80 para o servidor HTTP
EXPOSE 80

# Iniciar o nginx e manter o container rodando
CMD ["nginx", "-g", "daemon off;"]