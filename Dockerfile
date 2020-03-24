FROM node:slim
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH


# COPY ./package.json /app
# RUN npm install
#RUN npm install concurrently
#RUN npm install react-scripts


# RUN npm install -g nodemon

#CMD [ "npm", "start" ]
# CMD [ "npm", "start" ]
CMD ["tail", "-f", "/dev/null"]