/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/personalitys              ->  index
 * POST    /api/personalitys              ->  create
 * GET     /api/personalitys/:id          ->  show
 * PUT     /api/personalitys/:id          ->  upsert
 * PATCH   /api/personalitys/:id          ->  patch
 * DELETE  /api/personalitys/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Personality from './personality.model';
import Twitter from 'twitter';
import watson from 'watson-developer-cloud';


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Personalitys
export function index(req, res) {

  var client = new Twitter({
    consumer_key: 'wsbX0BHQIaZCGnQz0pSZhH96N',
    consumer_secret: '3KvpRZdahzMfzpWNomQD68IvAmNo0TXoi3H564Y29A31cWm2N7',
    access_token_key: '4516027973-sKFd1gaEzLlFBkvQ1FODTq9H7KGhD6XxqTlKg3K',
    access_token_secret: 'YVtey4iZnopk4wDvzvjE3yEQheP9NpMYlrPCwh0f6Z2IO'
  });

  var params = {screen_name: 'soempty__', count:1000};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {


      // =======================


      var personality_insights = watson.personality_insights({
        username: 'a510e3ef-496f-40ae-b544-d7badbf8989e',
        password: 'PpYiFPXJhYkw',
        version: 'v2'
      });

      var parameters = {contentItems:[]};
        tweets.forEach((tweet)=>{

          let data = {
            content: tweet.text,
            contenttype: "text/plain",
            created: new Date(tweet.created_at).getTime(),
            id: ''+tweet.id,
            language: tweet.lang,
            sourceid: "Twitter API",
            userid: '@'+tweet.user.screen_name
          }
          parameters.contentItems.push(data);
        });



      // parameters = require('./profile2.json');
      // parameters = JSON.stringify(parameters);
      // res.json(parameters);
      personality_insights.profile(parameters, function(error, response) {
        if (error){
          console.log('error:', error);
          res.send('error:',error)

        }else{
          // console.log(JSON.stringify(response, null, 2));
          // res.send(JSON.stringify(response, null, 2));
          res.send(response);

        }
        });

// =======================

      // console.log(tweets);
    }else {
      res.json(error)
    }
  });


  // var twitter = new Twit({
  //   consumer_key:         'wsbX0BHQIaZCGnQz0pSZhH96N',
  //   consumer_secret:      '3KvpRZdahzMfzpWNomQD68IvAmNo0TXoi3H564Y29A31cWm2N7',
  //   access_token:         '4516027973-sKFd1gaEzLlFBkvQ1FODTq9H7KGhD6XxqTlKg3K',
  //   access_token_secret:  'YVtey4iZnopk4wDvzvjE3yEQheP9NpMYlrPCwh0f6Z2IO',
  //   timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  // })
  // twitter.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
  //   // console.log(data)
  //   res.json(data);
  // })

  // twitter.get('search/tweets', { q: 'banana since:2011-07-11', count: 100 }, function(err, data, response) {
  //   res.json(data);
  // })

//   twitter.get('users/suggestions/:slug', { slug: '@LARK969' }, function (err, data, response) {
//   res.json(data)
// })


}

// // Gets a list of Personalitys
// export function index(req, res) {
//   return Personality.find().exec()
//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }

// Gets a single Personality from the DB
export function show(req, res) {
  return Personality.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Personality in the DB
export function create(req, res) {
  return Personality.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Personality in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Personality.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Personality in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Personality.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Personality from the DB
export function destroy(req, res) {
  return Personality.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
