# Build assets for all branches

if ENV['BASEURL'] != 'http://localhost:4000'
    puts '[build.rb] Webpack is processing assets'
    `(npm install; npm rebuild; npm run build) &> build.log`
end
