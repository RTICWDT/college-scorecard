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

    gem install github-pages

(Note: depending on how Ruby was installed, you may need to prefix the above
command with `sudo`.)

Then install all the ruby gems you need:

    bundle

This Jekyll site features dynamic Javascript that queries [api.data.gov](https://api.data.gov/). 
For the Javascript to work, it needs an API key (register for one at 
[api.data.gov/signup/](https://api.data.gov/signup/)) and a base URL. Jekyll will pull them from the local machine's
environment variables at build time, so ensure that both the `API_KEY` and `API_BASE_URL` variables are set before running build scripts.

Install [`autoenv`](https://github.com/kennethreitz/autoenv). Create a `.env` file in this directory, where you can place your `API_KEY` that you've received in the email. Below is a sample `.env` file:

    export API_KEY=<yourkeyhere>
    export API_BASE_URL=https://api.data.gov/ed/collegescorecard/v1/

Every time you `cd college-choice`, the envronmental variables specified in `.env` will be sourced.

To start up the local server, run:

    jekyll serve --baseurl='' -w

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

To set up the API (as a developer), follow the [Open Data Maker installation instructions](https://github.com/18F/open-data-maker/blob/dev/INSTALL.md) until you reach the point
in which Elastic Search is successfully [installed](https://github.com/18F/open-data-maker/blob/dev/INSTALL.md#make-sure-elasticsearch-is-up-and-running) on your computer.

Then make a new folder called `real-data`. This is the folder where you'll place new custom college-specific data.

1. Download the [full data set](https://s3.amazonaws.com/ed-college-choice-public/CollegeScorecard_Raw_Data.zip) into the `open-data-maker` directory and rename that folder to `real-data`. Remove any pdf files in the `real-data` directory; only `*.csv` and `.yaml` files should exist there. You should see the expected contents:


        /open-data-maker/real-data$ ls
        CollegeScorecardDataDictionary-09-12-2015.csv   MERGED2002_PP.csv                               MERGED2009_PP.csv
        MERGED1996_PP.csv                               MERGED2003_PP.csv                               MERGED2010_PP.csv
        MERGED1997_PP.csv                               MERGED2004_PP.csv                               MERGED2011_PP.csv
        MERGED1998_PP.csv                               MERGED2005_PP.csv                               MERGED2012_PP.csv
        MERGED1999_PP.csv                               MERGED2006_PP.csv                               MERGED2013_PP.csv
        MERGED2000_PP.csv                               MERGED2007_PP.csv                               data_dictionary.yaml
        MERGED2001_PP.csv                               MERGED2008_PP.csv


2. Set the `DATA_PATH` environment variable and import the data.

        export DATA_PATH=./real-data
        rake import

3. *OPTIONAL*: To speed up start up time, edit `data_dictionary.yaml` file inside the `real-data` directory to limit the number of files indexed and the number of rows.  These limits reduce the set of colleges in the data set and is helpful for testing since it speeds startup time significantly:

        options:
          limit_files: 4
          limit_rows: 100

4. Start Open Data Maker.  On the command line, from the open-data-maker directory:

        padrino start

## Content

For the content on the College Scorecard, we are following the [18F Content Guide](https://pages.18f.gov/content-guide/).
