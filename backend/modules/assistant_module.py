# assistant_module.py:
import os
import openai

client = openai.OpenAI(
  api_key = os.environ.get("OPENAI_API_KEY_ONEMONTH")
)

def assistant(data):
    user_message = data['message']
    chat_history = data['chat_history'] # Not currently used?
    personality = data['personality'] # Not currently used?
    context = f"""
        This is a virtual AI assistant designed to help users with educational and 
        administrative tasks related to the OneMonth app.
        
        The assistant should provide helpful, informative, and engaging responses.
        The assistant's personality is {personality}.
        The following is a conversation with a user:
        """
    #context should have a danish and english version based on language, setLanguage from App.js

    # Create a prompt for the completion request
    messages = [{"role": "system", "content": context}]
    messages.extend([{"role": "user", "content": message['content']} for message in chat_history])
    messages.append({"role": "user", "content": user_message})

    try:
        response = client.chat.completions.create(
            model="gpt-4", 
            messages=messages,
            max_tokens=150,
            temperature=0.7
        )
    except openai.BadRequestError as e:
        print("BadRequestError from OpenAI:", e)
        raise

    return response.choices[0].message.content.strip()
