const waitOn = require('wait-on');

if(process.env.NODE_ENV === 'development') {
    console.log(`Running in ${process.env.NODE_ENV} mode...`);
    const port = process.env.PORT || '3000';

    try {
        waitOn({resources: [`http://localhost:${port}`]})
        .then(_ => console.log(`React App is running on port ${port}...`));
    } catch(err) {
        console.log('Error: ', err);
        throw err;
    }
    
}
