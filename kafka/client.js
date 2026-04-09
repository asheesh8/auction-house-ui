// Docs: https://kafka.js.org/docs/getting-started

//import 'dotenv/config'
//import kafka from 'kafkajs'


//require import from kafka docs. not used.
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { Kafka } = require('kafkajs')

//const { Kafka } = kafka

const kafka = new Kafka({
  clientId: 'auction-house',
  brokers: ['localhost:9092']
})

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
  // Producing
  await producer.connect()
  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'Hello KafkaJS user!' },
    ],
  })

  // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
  })
}

run().catch(console.error)