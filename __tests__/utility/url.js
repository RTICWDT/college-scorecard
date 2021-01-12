/* jshint node: true */
var url = 'http://localhost:4000';
var env = process.env;

var branch = env.CI_ACTION_REF_NAME;
var user = env.CI_REPOSITORY_OWNER;
var repo = env.CI_REPOSITORY_NAME;

if (branch === 'master') {
  url = 'https://collegescorecard.ed.gov';
} else if (branch && user && repo) {
  var path = [user, repo, branch].join('/');
  url = env.FEDERALIST_URL+ "/preview/" + path.toLowerCase();
  {
    url = 'https://federalist-a267b602-ea49-4771-8115-ea94f984a5ca.app.cloud.gov/preview/' + path.toLowerCase();
  }
  else
  {
  }
}

if (module.parent) {
  module.exports = url;
} else {
  console.log(url);
}
