const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');


const manipulateString = async function(number, message) {
    let firstCharLetterCode = 97;
    let lastCharLetterCode = 122;
    let decrypt = '';
    message = message.toLowerCase();
    for( i = 0 ; i < message.length; i++ ) {
        const charCode = message.charCodeAt(i);
        if( charCode < firstCharLetterCode || charCode > lastCharLetterCode) {
            const codeToChar = String.fromCharCode(charCode);
            decrypt = decrypt.concat(codeToChar);
        } else {
            let newChar = charCode - number;
            if(newChar < firstCharLetterCode) {
                newChar = lastCharLetterCode - (firstCharLetterCode - newChar) +1;
            }
            const codeToChar = String.fromCharCode(newChar);
            decrypt = decrypt.concat(codeToChar);
        } 
    }
    return decrypt;
}

const sendDecypt = async function(token) {
    const url = `https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=${token}`;
    console.log(url);

    const form = new FormData();
    form.append('answer', fs.createReadStream('./answer.json'));

    try {
        const { data } = await axios.post(
            url, 
            form, 
            { headers: form.getHeaders() }
        );
        console.log('data', data);
        return data;
    } catch(err) {
        console.log('error');
        return response.status(400).json({ error: 'Error when send anwser.json file' });
    }
  
};

module.exports = {

    async index(request, response) {
        const { token_id } = request.body;
        const url = `https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=${token_id}`;
        
        try{
            const { data }  = await axios.get(url);
            const payload = JSON.stringify(data);
            const filepath = 'answer.json';
            try {
                fs.writeFileSync(filepath, payload, (err) => {
                    if (err) throw err;
                    console.log("The file was succesfully saved!");
                });
            } catch(err) {
                console.log("Cannot write file", err);
            }
            
            return response.json(data);

        } catch(err) {
            return response.status(400).json({ error: 'No user found with this token' });
        }
    },

    async decrypt(request, response) {
        
        try{
            let data = fs.readFileSync('answer.json');
            data = JSON.parse(data);
            const decifrado = await manipulateString(data.numero_casas, data.cifrado);
            data.decifrado = decifrado;
            data.resumo_criptografico = "6fa8f018cf1ad550715378cc33a67c23edcb88e5";
            const payload = JSON.stringify(data);
            const filepath = 'answer.json';
            try {
                fs.writeFileSync(filepath, payload, (err) => {
                    if (err) throw err;
                    console.log("The file was succesfully saved!");
                });
            } catch(err) {
                console.log("Cannot write file", err);
            }
            // await sendDecypt(data.token);
            const url = `https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=${data.token}`;
            console.log(url);
            
            const form = new FormData();
            form.append('answer', fs.createReadStream('answer.json'));

            try {
                const { data } = await axios.post(
                    url, 
                    form, 
                    { headers: form.getHeaders() }
                );
                console.log('data', data);
            } catch(err) {
                console.log('error');
            }

        } catch(err) {
            console.log("Cannot read file", err);
        }

        return response.send('all ok');

    },
};