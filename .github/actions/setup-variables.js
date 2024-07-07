const $ = require('@actions/core');

(async () => {
  const variables = (() => {
    switch (process.env.GITHUB_REF_NAME) {
      case 'master':
        return {
          AWS_S3_BUCKET: 'absolute2flex',
          AWS_CF_DISTRIBUTION_ID: 'E3MBVJK8GBJGDD',
        };
     }
  })();
  if (!variables) throw new Error(`Invalid git ref name`);

  for (const [key, value] of Object.entries({ ...variables, AWS_REGION: 'us-east-1' })) $.setOutput(key, value);
})().catch(e => {
  $.setFailed(e.message);
  if (process.env.SHOW_STACK_TRACE === 'true') throw e;
});
