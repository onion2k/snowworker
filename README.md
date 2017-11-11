# Snowfall

Lovely snow for your website. See a demo at https://snowfall.ooer.com/

## Installation

Download /dist/snowfall.js and include it in your website somewhere. Then make anything that you want snow to settle on with a .rooftop class.

Alternatively clone the repo and use `npm run start` to run a webpack dev server instance on port 3000. This will watch for changes to the files in /src so you can tinker with it.

## Improvements

The snow isn't clever. It just lies on to of the element's clientRect. Ideally it should lie on the actual content, text, or whatever. 