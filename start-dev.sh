#!/bin/bash

nvm use lts/gallium && docker compose up -d && npm run serve ; docker-compose down
