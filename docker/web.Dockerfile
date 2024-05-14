FROM oven/bun:1

# Define build arguments for environment variables
ARG VITE_API_BASE_URL

# Set environment variables during the build process
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Set the working directory in the container
WORKDIR /app

COPY bun.lockb  /app/
COPY apps/web /app/

# Install your application's dependencies
RUN bun install

RUN bun run build

EXPOSE 8080

CMD [ "bun", "run", "preview" ]