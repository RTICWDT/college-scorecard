# Build assets for all branches
puts '[build.rb] Webpack is processing assets'
`(npm install; npm rebuild; npm run build) &> build.log`