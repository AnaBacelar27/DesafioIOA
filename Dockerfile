# Protótipo IOA | ITC São Luís — site estático servido pelo Nginx
FROM nginx:1.27-alpine

# Configuração do servidor (cache, gzip, cabeçalhos)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Arquivos do site
COPY index.html /usr/share/nginx/html/
COPY pages/ /usr/share/nginx/html/pages/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
