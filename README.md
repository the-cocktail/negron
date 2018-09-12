# Negron

Negron is a simple GraphQL gateway used to aggregate another GraphQL servers in one endpoint. It provides an easy way to set up a unique service to consume several GraphQL backends with only one client.

## Get started

You can use or deploy Negron using Docker or as a Node application.
In both ways, you only need to set up the following environment variables:

- Environment variables starting by `PROVIDER_URL_`. With these, you will tell the application which services you want to proxy. For example, if you want to use the GitHub API and the Yelp API you could set the environment variables `PROVIDER_URL_GITHUB=https://api.github.com/graphql` and `PROVIDER_URL_YELP=https://api.yelp.com/v3/graphql`.
- `NEGRON_PORT`: The port where the application will run, the default is `3000`.
- `NEGRON_PATH`: The path where the GraphQL API will be available, the default is `/api`.

### Using Docker

The easiest way to run the project is by using the docker image like this (consuming, for example, the endpoints https://api.melody.sh/graphql and https://api.graphloc.com/graphql):

```console
antonio@machine$ docker run \
  -e PROVIDER_URL_MELODY=https://api.melody.sh/graphql \
  -e PROVIDER_URL_GRAPLOC=https://api.graphloc.com/graphql \
  -p 3000:3000 \
  thecocktail/negron

Aggregating the following endpoints:
 - https://api.graphloc.com/graphql
 - https://api.melody.sh/graphql
GraphQL API running at http://localhost:3000/api
```

If you want to expose the API in another port or path you could do the following:

```console
antonio@machine$ docker run \
  -e NEGRON_PATH=/ \
  -e NEGRON_PORT=4000 \
  -e PROVIDER_URL_MELODY=https://api.melody.sh/graphql \
  -e PROVIDER_URL_GRAPLOC=https://api.graphloc.com/graphql \
  -p 4000:4000 \
  thecocktail/negron

Aggregating the following endpoints:
 - https://api.graphloc.com/graphql
 - https://api.melody.sh/graphql
GraphQL API running at http://localhost:4000/
```

### As NodeJS script

You can simply run the application as with node in the following way:

```console
antonio@machine$ NEGRON_PATH=/api \
    NEGRON_PORT=3000 \
    PROVIDER_URL_MELODY_REPO=https://api.melody.sh/graphql \
    PROVIDER_URL_GRAPLOC=https://api.graphloc.com/graphql \
    npm start

Aggregating the following endpoints:
 - https://api.graphloc.com/graphql
 - https://api.melody.sh/graphql
Gateway running at http://localhost:3000/api
```

### Development environment

If you want to use this gateway against APIs with self-signed certificates (for example in local development), you must declare the environment variable `NODE_TLS_REJECT_UNAUTHORIZED="0"`. For example:

```console
antonio@machine$ NODE_TLS_REJECT_UNAUTHORIZED="0" \
    PROVIDER_URL_MELODY_REPO=https://api.melody.sh/graphql \
    PROVIDER_URL_GRAPLOC=https://api.graphloc.com/graphql \
    npm start

Aggregating the following endpoints:
 - https://api.graphloc.com/graphql
 - https://api.melody.sh/graphql
Gateway running at http://localhost:3000/api
```

## License

MIT.

See the [LICENSE](LICENSE) in this repository for more details.