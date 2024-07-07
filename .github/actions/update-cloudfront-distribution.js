const $ = require('@actions/core');
const { CloudFrontClient, GetDistributionCommand, UpdateDistributionCommand } = require('@aws-sdk/client-cloudfront');

(async () => {
  const client = new CloudFrontClient({});
  const distributionId = process.env.AWS_CF_DISTRIBUTION_ID;

  const fetched = await client.send(new GetDistributionCommand({ Id: distributionId }));
  const data = fetched.Distribution?.DistributionConfig;

  if (!data) throw new Error(`Invalid distribution id`);
  $.info(`Fetched Config: ${JSON.stringify(data)}`);

  data.CustomErrorResponses = {
    ...(items => ({
      Quantity: items.length,
      Items: items,
    }))([
      /**
       * SPA 的 html5 模式路由依赖
       */
      {
        ErrorCode: 404,
        ResponsePagePath: '/index.html',
        ResponseCode: '200',
        ErrorCachingMinTTL: 10,
      },
    ]),
  };

  $.info(`Updated Config: ${JSON.stringify(data)}`);

  await client.send(
    new UpdateDistributionCommand({
      IfMatch: fetched.ETag,
      DistributionConfig: data,
      Id: distributionId,
    }),
  );
})().catch(e => {
  $.setFailed(e.message);
  if (process.env.SHOW_STACK_TRACE === 'true') throw e;
});
