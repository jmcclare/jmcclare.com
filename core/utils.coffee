# 'production' mode is the default. That’s what we do if `NODE_ENV` is
# undefined.
#
# This is a simple boolean to tell most things if they should operate in
# production mode or not. Some things may have to check for specific values of
# NODE_ENV to decide which database to use, etc.
inProd = process.env.NODE_ENV == undefined || process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'production-test'


export { inProd }
