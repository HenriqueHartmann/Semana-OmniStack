const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

// Um controller tem no máximo 5 funções: index, show, store, update, destroy
// Um controller não deve repetir inúmeras vezes funções parecidas

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });
        
        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const { name = login, avatar_url, bio} = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
            
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });
        }
    
        return response.json(dev);
    },
    
    async update(request, response) {
        const { github_username, name, avatar_url, bio, techs, longitude, latitude } = request.body;

        const techsArray = parseStringAsArray(techs);

        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        }

        const vals = {
            name,
            avatar_url,
            bio,
            techs: techsArray, 
            location
        }

        dev = await Dev.updateOne({ github_username }, vals, (err) => {
            if(err) throw err;
        });

        return response.json(dev);
    },

    async destroy(request, response) {
        const { github_username } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            dev = 'Does not exist';
        } else {
            dev = await Dev.deleteOne({github_username});
        }

        return response.json(dev);
    },
};
