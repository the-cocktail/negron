const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { graphqlExpress } = require('apollo-server-express')
const aggregateSchemas = require('./schema-aggregator')

const app = express()
const PORT = process.env.NEGRON_PORT || 3000
const PATH = process.env.NEGRON_PATH || '/api'

const endpoints = []
for (const key of Object.keys(process.env)) {
  if (key.startsWith('PROVIDER_URL')) {
    endpoints.push(process.env[key])
  }
}

if (!endpoints.length) {
  console.log(`
    You must provide one endpoint to be aggregated. For example:
      PROVIDER_URL_MY_API=http://localhost:4000/api
  `)
  process.exit(1)
}

console.log('Aggregating the following endpoints:')
for (const endpoint of endpoints) {
  console.log(` - ${endpoint}`)
}

if (process.env.NO_CORS === 'true') {
  app.use(cors())
}
aggregateSchemas(endpoints).then(schema => {
  app.use(
    PATH,
    bodyParser.json(),
    graphqlExpress(request => ({
      schema,
      context: { headers: request.headers }
    }))
  )

  // Start the server
  app.listen(PORT, () => {
    console.log(`GraphQL API running at http://localhost:${PORT}${PATH}`)
  })
})
