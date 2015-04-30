# Gitban Board [![Dependency Status](https://david-dm.org/isisbusapps/GitbanBoard.svg)](https://david-dm.org/isisbusapps/GitbanBoard)

## About
GitHub-centric Kanban board


## Installation

### Local

1. `git clone git@github.com:isisbusapps/GitbanBoard.git`
2. Copy `.env.example` to `.env` and fill in the variables
3. `npm install`
4. `node app.js`

### Heroku

Simply click: [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/isisbusapps/GitbanBoard) or follow these manual steps:

1. Install the [Heroku Toolbelt](https://toolbelt.heroku.com/)
2. `git clone git@github.com:isisbusapps/GitbanBoard.git`
3. `cd GitbanBoard`
4. `heroku create`
5. `heroku config:set KEY=VALUE` for each of the variables in `.env.example`
6. `heroku ps:scale web=1`
7. `git push heroku master`

## [Contributing](CONTRIBUTING.md)

## [License](LICENSE)
