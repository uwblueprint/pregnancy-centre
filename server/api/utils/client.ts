import { ClientDocument } from '../../database/models/clientModel'

const getClientsByFullName = (fullName: string, dataSources): Array<ClientDocument> => {
  return dataSources.clients.getAll().filter((client: ClientDocument) => client.fullName === fullName)
}

// Get existing client with fullName or create if there is no such client
const getClientByFullNameOrCreate = async (fullName: string, dataSources, session): Promise<ClientDocument> => {
  const clients = getClientsByFullName(fullName, dataSources)
  if (clients.length > 0) {
    return clients[0]
  }
  return await createClientHelper({ fullName }, dataSources, session)
}

const createClientHelper = async (client, dataSources, session): Promise<ClientDocument> => {
  return dataSources.clients.create(client, session)
}

const filterClients = (filter, dataSources) => {
  let filteredClients = dataSources.clients.getAll()

  for (let property in filter) {
    filteredClients = filteredClients.filter((client) => (client[property] ? client[property] === filter[property] : true))
  }

  return filteredClients
}

export { createClientHelper, getClientsByFullName, getClientByFullNameOrCreate, filterClients }
