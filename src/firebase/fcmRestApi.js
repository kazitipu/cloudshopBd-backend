import axios from "axios";

export const sendNotifications = async (token, message) => {
  console.log("send notification is called!");
  var data = JSON.stringify({
    data: {},
    notification: {
      title: message.title,
      body: message.body,
    },
    // token
    to: `${token}`,
  });

  var config = {
    method: "post",
    url: "https://fcm.googleapis.com/fcm/send",
    headers: {
      Authorization:
        "key=AAAADyvD9Bk:APA91bFluV_opdzlYNCYRxmSLuD6WYsmDEj5aIJs2TqpGhwRlu4jzb_0HvH1l_HO-3tfZ8I-IS_yupTVA3XEdVLwlEOAfIdDCE3jeI2LXoNg9GXTPODbmpXlFNm1Q6zk6_YxFZTxzwCl",
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
};
