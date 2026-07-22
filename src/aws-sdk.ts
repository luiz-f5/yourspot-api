import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
  region: "sa-east-1",
   credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

export default async function getPass() {
  const secretId = process.env.AWS_SECRET_ID as string;

  const command = new GetSecretValueCommand({
    SecretId: secretId,
  });

  const response = await client.send(command);

  const secretString = response.SecretString as string;
  const password = JSON.parse(secretString).password;

  return password;
}