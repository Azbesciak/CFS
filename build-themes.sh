#!/bin/bash

DEST_PATH=src/assets
INPUT_PATH=src/custom-themes/


echo Building custom theme scss files.

# Get the files
FILES=$(find src/custom-themes -name "*.scss")

for FILE in $FILES
do
  FILENAME=${FILE#$INPUT_PATH}
  BASENAME=${FILENAME%.scss}
  node-sass $FILE > $DEST_PATH/$BASENAME.css
done

echo Finished building CSS.
