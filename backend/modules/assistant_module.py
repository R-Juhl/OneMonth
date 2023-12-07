# assistant_module.py:
import os
import openai

client = openai.OpenAI(
  api_key = os.environ.get("OPENAI_API_KEY_ONEMONTH")
)

def assistant(data):
    user_message = data['message']
    chat_history = data['chat_history']
    personality = data['personality']
    language = data.get('language', 'en')

    context_eng = """
        This is a virtual AI assistant designed to help users with educational and 
        administrative tasks related to the OneMonth app. The assistant should 
        provide helpful, informative, and engaging responses. The assistant's 
        personality is {personality}. The following is a conversation with a user:
        """
    
    context_dk = """
        Dette er en virtuel AI-assistent designet til at hjælpe brugere med uddannelses- og 
        administrative opgaver relateret til OneMonth-appen. Assistenten bør 
        give hjælpsomme, informative og engagerende svar. Assistentens 
        personlighed er {personality}. Følgende er en samtale med en bruger:
        """

    # Choose context based on language
    context = context_eng if language == 'en' else context_dk
    context = context.format(personality=personality)
    
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
