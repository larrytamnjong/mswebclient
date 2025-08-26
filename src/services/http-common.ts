import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-type": "application/json",
    "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU2MjAwNTg0LCJpYXQiOjE3NTYxOTY5ODQsImp0aSI6ImY3NTg5OTY2MzFiYzQ0ZGZhZTgwZTU0OWZmNTJlMWYxIiwidXNlcl9pZCI6IjEifQ.q7mHfJYYtb4ZLlY86cqCSGtoMURCB4lrFoobyTgC5po`
  }
});