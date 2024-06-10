const jwt = require("jsonwebtoken");
const config = require("../env-local");


module.exports = () => {
  return (req, res, next) => {

    console.log("Authorization middleware");

    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).send("User not signed in");
      
    } else {

      const tokenBody = token.slice(7);

      jwt.verify(tokenBody, config.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log(`JWT Error: ${err}`);
          return res.status(401).send("User not signed in");
        }

        const userId = decoded.user.id; 
        req.userId = userId;

        const userRole = decoded.user.role; 


        if (userRole === "user" ) {
          next();
        }  else {
          return res.status(401).send("No access");
        }
      });
    }
  };
};

