var env = process.env;
var url = 'http://localhost:4000';

if (env.BROWSER_TEST_URL) {

  url = env.BROWSER_TEST_URL;

} else if (env.CIRCLE_BRANCH) {

  var repo = env.CIRCLE_PROJECT_USERNAME + '/' + env.CIRCLE_PROJECT_REPONAME;
  var branch = env.CIRCLE_BRANCH;
  if (branch === 'master') {
    url = 'http://federalist.18f.gov.s3-website-us-east-1.amazonaws.com/site/' + repo;
  } else {
    url = 'https://federalist.18f.gov/preview/' + repo + '/' + branch;
  }

}

module.exports = url;
