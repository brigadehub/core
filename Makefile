start:
	node standalone.js

start/develop:
	@echo make install
	@$(MAKE) install
	yarn run nodemon -- standalone.js

start/develop/mongo:
	@echo make install
	@$(MAKE) install
	mongod -d
	yarn run nodemon -- standalone.js

install:
	yarn install

build:
	@echo 'no build task specified.'

lint:
	yarn run standard

link:
	yarn link

upstream/set:
	git remote add upstream https://github.com/brigadehub/core.git

upstream/sync:
	git fetch upstream
	git checkout master
	git merge upstream/master

test:
	@echo make lint
	@$(MAKE) lint
	@echo make test/unit
	@$(MAKE) test/unit
	@echo make test/e2e
	@$(MAKE) test/e2e

test/unit:
	yarn run ava -- **/*.unit.js

test/e2e:
	echo 'no end-to-end tests available.'

test/e2e/selenium/install:
	yarn run selenium-standalone install

test/e2e/selenium/start:
	yarn run selenium-standalone start&

test/e2e/selenium/stop:
	pkill -f selenium-standalone

.PHONY: start lint test build link upstream install
