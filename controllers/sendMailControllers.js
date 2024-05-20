const { sendEmailServices } = require("../services/emailService");

const sendMailController = {
  sendMail: async (req, res) => {
    try {
      const { email } = req.body;
      if (email) {
        const response = await sendEmailServices(email);
        return res.status(200).json(response);
      } else {
        return res.status(400).json({
          message: "email is required",
        });
      }
    } catch (e) {
      res.status(500).json({
        message: e.message,
      });
    }
  },
};
module.exports = sendMailController;
