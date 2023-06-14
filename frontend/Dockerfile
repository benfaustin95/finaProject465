# Step 1 - Build frontend source code
# Stage 0, "build stage" based on Node.js -- used to build and compile frontend React
# Stage 0 - Does ALL the building

FROM node:18 as build-stage

RUN apt-get update && apt-get upgrade -y && apt-get autoclean -y && apt-get autoremove -y
RUN npm install -g pnpm

WORKDIR /app
COPY ./nginx.conf /nginx.conf
COPY package*.json /app/

RUN pnpm install

COPY ./ /app/
ENV API_HOST=localhost PORT=8080 AUTH_DOMAIN=dev-2dtmb35dmkdjhb8l.us.auth0.com AUTH_CLIENT=WTp4p0IS7rLzxWnDrIE9HJVEpsXwU3Uh AUTH_AUD=https://dev-2dtmb35dmkdjhb8l.us.auth0.com/api/v2/ AUTH_SCOPE='openid profile email' AUTH_REDIRECT=http://localhost:5173/ AUTH_EMAIL_KEY=http://localhost:5173/email
RUN pnpm build


# Step 2 - Give ONLY built files to Nginx server
# Stage 2 - Take ONLY the built files

# Step 3 - Have Nginx serve the built files


FROM nginx:alpine
EXPOSE 80
# This copies all of our files froim the above BUILD STAGE container rather than localhost
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf
