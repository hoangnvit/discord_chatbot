

const { Client, Intents } = require('discord.js')
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});



// the 'ready' event will occur when the bot has loggged in
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

let yelpAPI = require('yelp-api');
const axios = require('axios');

// Create a new yelpAPI object with *your* API key
let apiKey = 'JZribe-BK6cdIfBstkHfqVAjLviLY8aX0PqmD3X5kAFE2kWwwjOVyVLSUjWDzqve5SEfK3cY3YAa6ZpCdVkqIMOn1gZy6ZqNyQASXoe2dCXqyBEH90h5oLMWJcdbYXYx';

let yelp = new yelpAPI(apiKey);

// the 'messageCreate' event will occur when a message is entered into a channel
client.on('messageCreate', async message => {


  if (!message.author.bot) {

    command = message.content.toUpperCase().split(" ");

    switch (command[0]) {
      // command to check business by phone number
      case 'BUSINESS_BY_PHONE':
        let params = [{ phone: command[1] }];

        await yelp.query('businesses/search/phone', params).then(data => {
          var data = JSON.parse(data);
          let str='';
          message.reply(data.total +" businesses founded");
          data.businesses.forEach(element => {
            str += '\t\t';
            str += element.name;
            str += "\n";
            str += "\t\t\t" + element.location.address1 + " city: " + element.location.city + " country: " + element.location.country + " Postal code: " + element.location.zip_code
            str += '\n';


          });
          message.reply(str);
        })
          .catch(err => {
            // Failure
           
            message.reply('No business is founded');
          });
        break;

      case 'BUSINESS_BY_GEO':
        // Command to get list of businesses by latitude, longtitude and the number of businesses in list
        let params2 = [{ latitude: command[1] }, { longitude: command[2] }, { limit: command[3] }];

        await yelp.query('businesses/search', params2).then(data => {
          var data = JSON.parse(data);
          message.reply(command[3] + " businesses founded!");
          let str = '';
          data.businesses.forEach(element => {
            str += '\t\t';
            str += element.name;
            str += "\n";
            str += "\t\t\t" + element.location.address1 + " city: " + element.location.city + " country: " + element.location.country + " Postal code: " + element.location.zip_code
            str += '\n\n';


          });

          message.reply(str);
        })
          .catch(err => {
            // Failure
            message.reply('No business is founded');
          });
        break;

      case 'EVENT_FEATURED':
        // Command get event featureed by latitude and longtitude
        let params3 = [{ latitude: command[1] }, { longitude: command[2] }];
        // console.log(params3);

        await yelp.query('events/featured', params3).then(data => {
          var data = JSON.parse(data);
          // console.log(data);
          str = '\n';

          str += "Event founded: " + data.name + " \n\n \t  will be hold  in: " + data.time_start + "at " + data.location.address1 + " " + data.location.city + " " + data.location.country;


          message.reply(str);
        })
          .catch(err => {
            // Failure
            message.reply(' No event featured is founded');
          });
        break;
      case 'TRANSACTION':
        // Command get transactions  with type of transaction, latitude and longtitude inputted
        let params4 = [{ latitude: command[2] }, { longitude: command[3] }];
        // console.log(params4);
        // console.log('transactions/' + command[1].toLowerCase() + '/search');
        await yelp.query('transactions/' + command[1].toLowerCase() + '/search', params4).then(data => {
          var data = JSON.parse(data);
          message.reply(data.total.toString() + " businesses founded!");
          let str = '';
          data.businesses.forEach(element => {
            str += '\t';
            str += element.name;
            str += "\n";
            str += "\t\t" + element.location.address1 + " city: " + element.location.city + " country: " + element.location.country + " Postal code: " + element.location.zip_code
            str += '\n\n';


          });



          message.reply(str);
        })
          .catch(err => {
            // Failure
            message.reply('No business is founded');
          });
        break;

      case 'AGE':
        // Command to guesst the age fromn name and country
        try {

          let params = [{ 'name': command[1], 'country_id': command[2] }];
          const response1 = await axios.get('https://api.agify.io',
            {
              params: {
                'name': command[1],
                'country_id': command[2]

              }
            });


          message.reply(response1.data.name + " From " + response1.data.country_id + " " + response1.data.age + " years old!");


        } catch (error) {
          message.reply('No Age is founded');
        }
        break;

     
      case 'ACTIVITY':
        // Command to suggest activity for people
        try {


          const response3 = await axios.get('https://www.boredapi.com/api/activity',
            {
              params: {
                'type': command[1].toLowerCase(),
                'participants': command[2]

              }
            });


          message.reply("You should take part in ' " + response3.data.activity + " '. There are  " + response3.data.participants + " for total. The price:  " + response3.data.price + "$");


        } catch (error) {
          message.reply('No Activity is founded');
        }
        break;
     
    }



  }


})

// logs in the bot to the channel
client.login("ODk0NDg5ODIxOTk1NzUzNTAy.YVqwkA.e8XAIfjWlsoD-xDqc_BriwSMCP4");
