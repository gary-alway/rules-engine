import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { SNS, SQS } from 'aws-sdk'
import { IS_OFFLINE, LOCAL_AWS_CONFIG } from '../constants'
import { createDynamoClient, DynamoClient } from './dynamoClient'
import { createSNSClient, SNSClient } from './snsClient'
import { createSQSClient, SQSClient } from './sqsClient'

const dynamoInstance = Object.freeze(
  createDynamoClient(
    new DocumentClient(IS_OFFLINE ? LOCAL_AWS_CONFIG : undefined)
  )
)

const snsInstance = Object.freeze(
  createSNSClient(new SNS(IS_OFFLINE ? LOCAL_AWS_CONFIG : undefined))
)

const sqsInstance = Object.freeze(
  createSQSClient(new SQS(IS_OFFLINE ? LOCAL_AWS_CONFIG : undefined))
)

export const getDynamoClient = (): DynamoClient => dynamoInstance
export const getSnsClient = (): SNSClient => snsInstance
export const getSqsClient = (): SQSClient => sqsInstance
