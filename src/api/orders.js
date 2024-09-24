import { Amplify } from 'aws-amplify';
//import amplifyconfig from './src/amplifyconfiguration.json';
import { get } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';

const awsconfig = {
  aws_project_region: 'us-east-1'
};

Amplify.configure(awsconfig);

const existingConfig = Amplify.getConfig();

// Add existing resource to the existing configuration.
Amplify.configure({
  ...existingConfig,
  API: {
    ...existingConfig.API,
    REST: {
      ...existingConfig.API?.REST,
      'test-api': {
        endpoint: 'https://gti9yxq8lh.execute-api.us-east-1.amazonaws.com/test',
        region: 'us-east-1'
      }
    }
  }
});

export async function getOrders() {
  const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
  try {
    const restOperation = get({
      apiName: 'test-api',
      path: `/orders`,
      options: {
        headers: {
          Authorization: authToken
        }
      }
    });

    const response = await restOperation.response;
    const json = await response.body.json();
    return json;
  } catch (e) {
    console.log(e);
  }
}
