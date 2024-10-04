# Etapa 1: Usar uma imagem base do Bun
FROM oven/bun:latest

# Criar um diretório de trabalho
WORKDIR /src

# Copiar os arquivos do projeto
COPY . .

# Instalar as dependências
RUN bun install

# Aplicar as migrações do Prisma
RUN bun prisma migrate deploy

# Gerar o Prisma Client
RUN bun prisma generate

# Expor a porta que o Fastify vai usar
EXPOSE 3333

# Rodar a aplicação
CMD ["bun", "start"]
