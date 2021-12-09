const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(port, () => {
    console.log(`Translator app listening at port ${port}`)

});

app.post('/translate', (request, response) => {

    let userInput = request.body.Body;
    
    console.log();
    let req;

    if (isUserInputEnglish(userInput)) {
        console.log(`Text in English - ${userInput}`);
        req = createTranslationApiRequest('en', 'es', userInput);
    } else {
        userInput = userInput.substring(1);
        console.log(`Text in Spanish - ${userInput}`);
        req = createTranslationApiRequest('es', 'en', userInput);
    }
    
    axios.request(req).then(function (res) {
        let translatedText = res.data["data"]["translations"]["translatedText"];
        console.log(`Translated text - ${translatedText}`);

        const twiml = new MessagingResponse();
        twiml.message(translatedText);
        response.writeHead(200, {'Content-Type': 'text/xml'});
        response.end(twiml.toString());

    }).catch (function (error) {
        console.log(`Couldn't translate this text -  ${userInput}`);
        response.send( "<Response><Message>Sorry, I can't translate that :(</Message></Response>");
    });

});

function isUserInputEnglish(input) {
    if (input != null && input.length > 0) {
        if (input.charAt(0) === '=') {
            return false;
        }
    }
    return true;
}

function createTranslationApiRequest(source, target, data) {
    return {
        method: 'POST',
        url: 'https://deep-translate1.p.rapidapi.com/language/translate/v2',
        headers: {
            'content-type': 'application/json',
            'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
            'x-rapidapi-key': 'bab91067a3msh256a6b93f8c15efp1c3007jsnc124db7a8c56'
        },
        data: {q: data, source: source, target: target}
    };
}
