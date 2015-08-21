# Project Inform College Choice
We should say something about this project here.

## Installation
This site is made with [Jekyll]. Once you've got [Ruby] on your computer, you
can run:

```sh
gem install github-pages
```

(Note: depending on how Ruby was installed, you may need to prefix the above
command with `sudo`.)

This Jekyll site features dynamic Javascript that queries [api.data.gov](https://api.data.gov/). For the Javascript to work, it needs an
API key and a base URL. Jekyll will pull them from the local machine's
environment variables at build time, so ensure that both the `API_KEY` and
`API_BASE_URL` variables are set before running build scripts.

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
