#!/bin/bash
for file in *; do
  new_name="${file// /_}"
  new_name="${new_name//'?'/}"
  mv -n -- "$file" "$new_name"
done
