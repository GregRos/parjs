#!/usr/bin/env bash
rm -rf .tmp/publish
yarn run tsc -p tsconfig.publish.json
cp -r LICENSE.md README.md package.json .tmp/publish
cp -r src/lib .tmp/publish/src
cp tsconfig.json .tmp/publish
