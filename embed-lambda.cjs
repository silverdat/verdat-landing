/* Amplify Params - DO NOT EDIT
    ENV
    REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log('Event', JSON.stringify(event))
    const { QuickSightClient, GenerateEmbedUrlForAnonymousUserCommand } = require("@aws-sdk/client-quicksight");

    const awsAccountId = "445005418869"
    const region = "us-east-1"
    const dashboardId = "02bed7ba-c018-4284-a77e-bbd5a910b7b9" // verdat dashboard id

    const quickSight = new QuickSightClient({ region: region });

    const params = {
        AwsAccountId: awsAccountId,
        Namespace: "default",
        ExperienceConfiguration: {
            Dashboard: {
                InitialDashboardId: dashboardId,
            },
        },
        AuthorizedResourceArns: [`arn:aws:quicksight:${region}:${awsAccountId}:dashboard/${dashboardId}`],
        SessionLifetimeInMinutes: 60,
    };

    const command = new GenerateEmbedUrlForAnonymousUserCommand(params);

    async function generateEmbedUrl() {
        try {
            console.log('Requesting Embed URL')
            const data = await quickSight.send(command);

            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
                },
                body: JSON.stringify({
                    embedURL: data.EmbedUrl
                }),
            };

            return response;
        } catch (error) {
            console.error('Error al obtener el tablero', error)
        }
    }

    return await generateEmbedUrl();
};
