/* jshint node: true */
var url = 'http://localhost:4000';
var env = process.env;

var branch = env.CIRCLE_BRANCH;
var user = env.CIRCLE_PROJECT_USERNAME;
var repo = env.CIRCLE_PROJECT_REPONAME;

if (branch === 'master') {
  url = 'https://collegescorecard.ed.gov';
} else if (branch && user && repo) {
  var path = [user, repo, branch].join('/');
  // url = 'https://federalist-proxy.app.cloud.gov/preview/' + path.toLowerCase();
  url = 'https://federalist-c15eda78-ad4f-46bc-ac6b-eb043d9f3780.app.cloud.gov/preview/' + path.toLowerCase();
}

if (module.parent) {
  if (env.CIRCLE_PR_USERNAME && env.CIRCLE_PR_USERNAME != user) {
    console.warn('exiting from forked branch');
    process.exit(0);
    module.exports = '';
  } else {
    module.exports = url;
  }
} else {
  console.log(url);
}
