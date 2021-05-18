import { Client, ClientInterface } from '../../database/models/clientModel'

const clientQueryResolvers = {
    client: async (_, { _id }, { authenticateUser }): Promise<ClientInterface> => {
        return authenticateUser().then(() => {
            return Client.findById(_id).exec()
        }) 

    },
    clients: async (_, __, { authenticateUser }): Promise<Array<ClientInterface>> => {
        return authenticateUser().then(() => {
            return Client.find().exec()
        })
    },
    /* Left as a proof of concept:
    clientsFilter: async (_, { filter, options }, { authenticateUser }): Promise<Array<ClientInterface>> => {
        return authenticateUser().then(() => {
            return Client.find({ fullName: filter.fullName }).exec()
        })
    },*/
}

const clientMutationResolvers = {
    createClient: async (_, { client }, { authenticateUser }): Promise<ClientInterface> => {
        return authenticateUser().then(async () => {
            const newClient = new Client({...client})
            return newClient.save()
        })
    },
    updateClient: async (_, { client }, { authenticateUser }): Promise<ClientInterface> => {
        return authenticateUser().then(async () => {
            const currentClient = await Client.findById(client._id)
            const modifiedClient = {...currentClient, ...client}
            return modifiedClient.save()
        })
    },
    deleteClient: async (_, { _id }, { authenticateUser }): Promise<ClientInterface> => {
        return authenticateUser().then(async () => {
            const client = await Client.findById(_id)
            client.deletedAt = new Date()
            return client.save()
        })
    },
}

export { clientQueryResolvers, clientMutationResolvers }
