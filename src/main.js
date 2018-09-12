import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress } from 'apollo-server-express'
import aggregateSchemas from './schema-aggregator'

const app = express()
const PORT = process.env.NEGRON_PORT || 3000
const PATH = process.env.NEGRON_PATH || '/api'

let endpoints = []
for (let key of Object.keys(process.env)) {
  if (key.startsWith('PROVIDER_URLS')) {
    endpoints.push(process.env[key])
  }
}

if (!endpoints.length) {
  console.log(`
    You must provide one endpoint to be aggregated. For example:
      PROVIDER_URLS_MY_API=http://localhost:4000/api
  `)
  process.exit(1)
}

console.log('Aggregating the following endpoints:')
for (let endpoint of endpoints) {
  console.log(` - ${endpoint}`)
}

aggregateSchemas(endpoints).then(schema => {
  app.use(PATH, bodyParser.json(), graphqlExpress(request => ({ schema, context: { headers: request.headers } })))

  // Start the server
  app.listen(PORT, () => {
    console.log(`GraphQL API running at http://localhost:${PORT}${PATH}`)
  })
})
