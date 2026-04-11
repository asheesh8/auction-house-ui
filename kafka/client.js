// Docs: https://kafka.js.org/docs/getting-started

import { Kafka } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'auction-house',
  brokers: ['localhost:9092']
})

export default kafka