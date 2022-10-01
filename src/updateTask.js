const AWS = require('aws-sdk');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');

const updateTask = async (event) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const { id } = event.pathParameters;
    const { description, done, title } = event.body;

    await dynamodb.update({
        TableName: 'TaskTable',
        Key: { id },
        UpdateExpression: 'set done = :done, title = :title, description = :description',
        ExpressionAttributeValues: {
            ':title': title,
            ':description': description,
            ':done': done
        },
        ReturnValues: 'ALL_NEW'
    }).promise();

    return {
        status: 200,
        body: {
            message: 'Task updated successfully',
        },
    };
};

module.exports = {
    updateTask: middy(updateTask).use(jsonBodyParser()),
};