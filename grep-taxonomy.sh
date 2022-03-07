#!/bin/bash

curl https://raw.githubusercontent.com/BeethovensWerkstatt/data/main/data/module3/Op.73/Op.73_editionCorpus.xml | sed -n -e 's/^\s*<category xml:id="\([^"]\+\)" .*label="\([^"]\+\)".*$/"\1": "\2",/gp'

