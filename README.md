# College Scorecard

A website that allows students (high school and adult) and those who support them (parents, guidance counselors)
to not only search among colleges to find schools that would meet their desires, but also encourage them to consider
"value" factors, be exposed to schools with better outcomes, and allow users to compare and contrast schools across
different dimensions of "fit," highlighting "value" factors. The goal is to enable people to find schools that are 
best suited to them, and ensure a broad and flexible definition of elements that contribute to "fit."

This repo contains the front end of a web app with its API created by an instance of [Open Data Maker](https://github.com/18F/open-data-maker) which is configured with a specific data set. For more details on setting up the back end of the web app, see below: [Running the API Locally](#running-the-api-locally).  However, you can run the web app with the hosted API following the installation instructions in the next section.

## Installation
This site is made with [Jekyll]. Once you've got [Ruby] on your computer, you
can run:

```sh
gem install github-pages
```

(Note: depending on how Ruby was installed, you may need to prefix the above
command with `sudo`.)

Then install all the ruby gems you need:

```
bundle
```

This Jekyll site features dynamic Javascript that queries [api.data.gov](https://api.data.gov/). 
For the Javascript to work, it needs an API key (register for one at 
[api.data.gov/signup/](https://api.data.gov/signup/))
and a base URL. Jekyll will pull them from the local machine's
environment variables at build time, so ensure that both the `API_KEY` and
`API_BASE_URL` variables are set before running build scripts. On a Mac using the production api 
endpoint this is how to set those variables:

```
export API_KEY=yourkeyhere; export API_BASE_URL=https://api.data.gov/ed/collegescorecard/v1/
```

To start up the local server, run:

```sh
jekyll serve --baseurl='' -w
```

Then visit [http://localhost:4000](http://localhost:4000) to view it. The `-w`
(or `--watch`) flag tells Jekyll to rebuild the relevant pages when you edit
the source files.

## Frontend Tools
- Styles: we're using [Sass], which is bundled with [Jekyll].
- Font: [Montserrat] hosted on [Google Fonts](https://www.google.com/fonts/).
- Charts will be rendered with [D3].

[Montserrat]: https://www.google.com/fonts/specimen/Montserrat
[Jekyll]: http://jekyllrb.com/
[Sass]: http://sass-lang.com/
[D3]: http://d3js.org/
[Ruby]: https://www.ruby-lang.org/

## Running the API Locally

To set up the API (as a developer), follow the [Open Data Maker installation instructions](https://github.com/18F/open-data-maker/blob/dev/INSTALL.md) then:

1. download the [full data set](https://s3.amazonaws.com/ed-college-choice-public/CollegeScorecard_Raw_Data.zip) into open-data-maker directory and rename the folder as "real-data"
2. set DATA_PATH environment variable.  On the command line:
```
export DATA_PATH=./real-data
```

3. This application uses only most recent data.  To speed up start up time, edit `data.yaml` file inside the `real-data` directory to limit the number of files indexed to 4 (year 2013 is included twice, once for the columns that are not specific to any year, and once for the 2013 data, then 2012 and 2011).  Optionally, limiting the number of rows will reduce the set of colleges in the data set and is helpful for testing since it speeds startup time significantly:
```
options:
  limit_files: 4
  limit_rows: 100
```

To create the API for the complete set of schools, comment out the `limit_rows` option by adding a `#` to the start of the line:

```
options:
  limit_files: 4
#  limit_rows: 100
```

3. Start Open Data Maker.  On the command line, from the open-data-maker directory:
```
padrino start
```

4. To view progress of indexing, it is helpful to look at the development log in another terminal window:
```
tail -f log/development.log
```
## Content

For the content on the College Scorecard, we are following the [18F Content Guide](https://pages.18f.gov/content-guide/).
