const surveyService = require("../services/surveyService");
const userService = require("../services/userService");
const attacksService = require("../services/cyberattackService");
const authorService = require("../services/authorService");

exports.refactoreMe1 = async  (req, res) => {
  // function ini sebenarnya adalah hasil survey dri beberapa pertnayaan, yang mana nilai dri jawaban tsb akan di store pada array seperti yang ada di dataset
    try{
      const results = await surveyService.getAllTotalSurvey();
        res.status(200).send({ 
                 statusCode: 200,
                 success: true,
                 data: results,
        });
    }catch(err){
       res.status(500).send({ 
            statusCode: 500, 
            message: "faild get total Survey", 
            success: false,
       });
    };
};


exports.refactoreMe2 = async  (req, res) => {
  // function ini untuk menjalakan query sql insert dan mengupdate field "dosurvey" yang ada di table user menjadi true, jika melihat data yang di berikan, salah satu usernnya memiliki dosurvey dengan data false
  try {
    const reqSurvey = ({ userId: req.body.userId,
                         values: req.body.values, 
                      });
    const reqUserUpdate = ({ doSurvey: true, 
                             userId: req.body.userId,
                          });

    await surveyService.createSurvey(reqSurvey);
    console.log("Survey successfully created");

    await userService.updateUserStatus(reqUserUpdate);
    console.log("User status successfully updated");

    res.status(201).send({
      statusCode: 201,
      message: "Survey sent successfully!",
      success: true,
    });
    
  }catch (error) {
    console.error(error);
    res.status(500).send({
      statusCode: 500,
      message: "Cannot post survey.",
      success: false,
    });
  }
 
};

const fetchDataAndSaveToDatabase = async () => {
  try {
    const data = await attacksService.fetchDataFromAPI();
    await attacksService.saveToDatabase(data);
    return "Success fetching data from API and saving to the database";
  } catch (error) {
    console.error(error);
    return "Error fetching data from API or saving to the database";
  }
};

exports.callmeWebSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('WebSocket connected', socket.id);

    const fetchDataInterval = setInterval(async () => {
      const message = await fetchDataAndSaveToDatabase(io);
      io.emit('message', message);
    }, 180000);

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      clearInterval(fetchDataInterval);
    });
  });
};


exports.getData = async (req, res) => {
  try{
    const results = await attacksService.getTotalAttack();
      res.status(200).send({ 
               statusCode: 200,
               success: true,
               data: results,
      });
  }catch(err){
     res.status(500).send({ 
          statusCode: 500, 
          message: "faild get total cyberattack", 
          success: false,
     });
  };
};


exports.login = async (req, res) => {
  console.log(req.body);
  try{
    const token = await authorService.authenticateUser(req);
    res.json({ token  })
  }catch(err){
    console.log(err);
     res.status(500).send({ 
          statusCode: 500, 
          message: "Login failed, invalid username or password ", 
          success: false,
     });
  };
};


