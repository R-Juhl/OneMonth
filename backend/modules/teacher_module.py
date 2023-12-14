# teacher_module.py:
import os
import openai
from flask import jsonify
import time
from .models import db, UserCourseSession

client = openai.OpenAI(
  api_key = os.environ.get("OPENAI_API_KEY_ONEMONTH")
)

Afsaetning_teacher_assistantid = 'asst_nEqHa4No0Yslxcf8Uw7pUCFm'
ASSISTANT_ID = Afsaetning_teacher_assistantid

def get_course_thread(user_id, course_name):
    session = UserCourseSession.query.filter_by(user_id=user_id, course_name=course_name).first()
    if not session:
        # Create new session and thread
        new_thread = client.beta.threads.create()
        new_session = UserCourseSession(user_id=user_id, course_name=course_name, thread_id=new_thread.id)
        db.session.add(new_session)
        db.session.commit()
        return new_thread.id, True
    else:
        return session.thread_id, False
    
def get_thread_messages(thread_id):
    messages = client.beta.threads.messages.list(thread_id=thread_id)
    messages_list = []
    is_assistant = True  # Assuming the first message is always from the assistant
    for msg in messages.data:
        if msg.content:
            role = "assistant" if is_assistant else "user"
            messages_list.append({
                "text": msg.content[0].text.value,
                "role": role
            })
            is_assistant = not is_assistant
    
    return messages_list

def get_initial_message(thread_id):
    if not thread_id:
        raise ValueError("No thread ID provided for initial message")

    message_response = client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content="Hi, I am your AI teacher in Afsætning. Let me know when you are ready for your class"
    )
    print(f"Initial message sent to thread: {thread_id}")
    initial_message = message_response.content[0].text.value if message_response.content else ""
    return jsonify({"message": initial_message, "thread_id": thread_id})

def continue_course(thread_id, user_input):

    print(f"Received the following user_input to add to thread: {user_input}")

    cancel_active_runs(thread_id)

    # Send user input to the thread
    client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=user_input
    )
    print("User input sent to thread")

    # Create and wait for the run to complete
    run = client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=ASSISTANT_ID,
    )
    print(f"Run created: {run.id}")

    if not wait_for_run_completion(thread_id, run.id):
        print("Run did not complete.")
        return jsonify({"error": "Run did not complete. Please try again later.", "thread_id": thread_id})

    # Fetch the latest assistant's message after the run
    messages = client.beta.threads.messages.list(
        thread_id=thread_id
    )
    assistant_message = find_assistant_message(messages.data)
    print(f"Assistant message: {assistant_message}")
    
    return jsonify({"message": assistant_message, "thread_id": thread_id})

def cancel_active_runs(thread_id):
    active_runs = client.beta.threads.runs.list(thread_id=thread_id)
    for run in active_runs.data:
        print(run.status)
        if run.status not in ["completed", "failed"]:
            client.beta.threads.runs.cancel(thread_id=thread_id, run_id=run.id)

def wait_for_run_completion(thread_id, run_id):
    max_retries = 100
    retries = 0
    while retries < max_retries:
        run_status = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run_id)
        print(run_status.status)
        if run_status.status == "completed":
            return True
        time.sleep(2)
        retries += 1
    return False

def find_assistant_message(messages):
    # Looking for the latest assistant message
    for message in messages:
        if message.role == "assistant" and message.content:
            return message.content[0].text.value
    return "No response from assistant"
