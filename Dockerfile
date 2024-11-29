#Se define una imagen base
FROM node
#Copia todo el codigo de la aplicacion
COPY . .
#Instlar dependencias en la nueva carpeta
RUN npm install
#Define un port
EXPOSE 8080
#Ejecuta en cmd para que funcione:
CMD [ "npm", "start" ]
