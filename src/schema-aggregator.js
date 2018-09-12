import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'
import {
  introspectSchema,
  makeRemoteExecutableSchema,
  mergeSchemas
} from 'graphql-tools'

const buildRemoteSchema = async (uri) => {
  const link = createLink(uri)
  try {
    const schema = await introspectSchema(link)

    return makeRemoteExecutableSchema({
      schema: schema,
      link: link
    })
  } catch (e) {
    console.error(`The endpoint ${uri} is unreachable. Reason:
      ${e.message}
    `)
    process.exit(1)
  }
}

const createLink = (uri) => {
  return setContext((request, previousContext) => {
    if (!previousContext.graphqlContext) {
      return {}
    }

    const headers = previousContext.graphqlContext.headers
    return {
      headers: {
        'Authorization': headers['authorization']
      }
    }
  }).concat(
    new HttpLink({ uri: uri, fetch })
  )
}

export default async (endpoints) => {
  return mergeSchemas({
    schemas: await Promise.all(endpoints.map(async (uri) => {
      const schema = await buildRemoteSchema(uri)
      return schema
    }))
  })
}
