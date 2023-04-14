#!/bin/bash
npx eslint -f json -o eslint-report.json ./src
echo "sonar.login=$SONAR_LOGIN" >> sonar-project.properties
sonar-scanner