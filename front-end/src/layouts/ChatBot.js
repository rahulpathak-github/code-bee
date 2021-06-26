import React from "react";
import { Widget, addResponseMessage } from "react-chat-widget";

import "react-chat-widget/lib/styles.css";
import { useEffect } from "react";

function ChatBot() {
  const user = localStorage.getItem("user");
  useEffect(() => {
    addResponseMessage("Hi! What is your name?");
  }, []);

  const handleNewUserMessage = async (newMessage) => {
    const interact = async (name, input) => {
      const response = await fetch(
        `https://general-runtime.voiceflow.com/state/60d760d507218d00077c82f6/user/${name}/interact`,
        {
          method: "POST",
          headers: {
            Authorization:
              "VF.60d740b9e97ed6001ba4f764.kRQhGFmVJp0lpLmOmSfxIyVCy6tcmcHkB0iI1yIns0"
          },
          body: JSON.stringify({
            "request": {
              "type": "text",
              "payload": input
            }
          })
        }
      );
      return response;
    };
    const response = await interact(user._id, newMessage);
    response.json().then((res) => {
      console.log(res);
      const [a, _] = res;
      console.log(a.payload.message)
      addResponseMessage(a.payload.message);
    });
  };

  return (
    <div>
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Code-Buzz Assistant"
        subtitle="Ready to guide you"
      />
    </div>
  );
}

export default ChatBot;
