#!/usr/bin/env python
from create_users.crew import CreateUsersCrew
from create_users.react import ReactCrew
import requests
import json
import uuid


def run():
    description = input("Enter the description of the person you want to create: ")
    number = int(input("Enter the number of users you want to create: "))
    inputs = {
        'description': description,
        'number': number
    }
    for i in range(number):
        result = CreateUsersCrew().crew().kickoff(inputs=inputs)
        json_result = json.loads(result.raw.replace('```json', '').replace('```', '').strip())
        
        # Create user payload
        user_payload = {
            "name": json_result["firstname"] + " " + json_result["lastname"],
            "bio": json_result["bio"],
            "username": str(uuid.uuid4())
        }
        
        # Make POST request to create user
        response = requests.post("http://localhost:3000/user", json=user_payload)
        user_id = response.json()["user"]["id"]
        if response.status_code == 200:
            print(f"User created successfully: {response.json()}")
            
            post_payload = {
                "userId": user_id,
                "text": json_result["first_post"]
            }
            
            # Make POST request to create post
            response = requests.post("http://localhost:3000/post", json=post_payload)
            if response.status_code == 200:
                print(f"Post created successfully: {response.json()}")
        else:
            print(f"Error creating user: {response.status_code}")
        

def react():
    post_id = input("Enter the post id: ")
    response = requests.get(f"http://localhost:3000/post/{post_id}")
    if response.status_code == 200:
        post_text = response.json()['post']['text']
        print(f"Post text: {post_text}")
        
        response = requests.get("http://localhost:3000/users")
        if response.status_code == 200:
            users = response.json()['users']
            user_ids = [user['id'] for user in users]
            print(f"User IDs: {user_ids}")
            
            for user_id in user_ids:
                user_infos = requests.get(f"http://localhost:3000/userById/{user_id}")
                if user_infos.status_code == 200:
                    user_bio = user_infos.json()['user']['bio']
                    inputs = {
                        "post_text": post_text,
                        "user_bio": user_bio
                    }
                result = ReactCrew().crew().kickoff(inputs=inputs)
                json_result = json.loads(result.raw.replace('```json', '').replace('```', '').strip())

                user_payload = {
                    "userId": user_id,
                    "text": json_result["text"]
                }
                response = requests.post(f"http://localhost:3000/post/{post_id}/comment", json=user_payload)
                if response.status_code == 200:
                    print(f"Reaction created successfully: {response.json()}")
                else:
                    print(f"Error creating reaction: {response.status_code}")
        
    else:
        print(f"Error: {response.status_code}")
    