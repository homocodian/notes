FROM oven/bun:1

# Set the working directory in the container
WORKDIR /app

COPY bun.lockb /app/
COPY apps/backend /app/

# Install your application's dependencies
RUN bun install

RUN bun run build

# Expose the port your API will listen on
EXPOSE 5500

CMD [ "bun", "run", "start" ]
