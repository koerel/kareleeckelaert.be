const dotenv = require('dotenv');
const gulp = require('gulp');
const gulpAwsPublish = require('gulp-awspublish');
const gulpCloudFront = require('gulp-cloudfront');
const gulpUtil = require('gulp-util');

let env;

function loadEnvironment() {
  env = dotenv.config({ path: '.env' }).parsed;
}

function deployTask() {
  loadEnvironment();
  const aws = {
    region: env.AWS_REGION,
    key: env.AWS_ID,
    secret: env.AWS_SECRET,
    accessKeyId: env.AWS_ID,
    secretAccessKey: env.AWS_SECRET,
    bucket: env.AWS_BUCKET,
    distributionId: env.AWS_DISTRIBUTION_ID,
    patternIndex: /^\/index\.[a-z0-9]{40}\.html(\.gz)*$/gi,
    params: {
      Bucket: env.AWS_BUCKET,
    },
  };

  const headers = {
    'Cache-Control': 'no-transform,public,max-age=300,s-maxage=900',
  };

  const awsPublisher = gulpAwsPublish.create(aws);

  return gulp
    .src('public/**/*')
    .pipe(gulpAwsPublish.gzip())
    .pipe(awsPublisher.publish(headers))
    .pipe(awsPublisher.cache())
    .pipe(gulpAwsPublish.reporter())
    .pipe(aws.distributionId ? gulpCloudFront(aws) : gulpUtil.noop());
}

gulp.task('deploy', deployTask);
