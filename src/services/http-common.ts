import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-type": "application/json",
    "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU2MTkxMjQ0LCJpYXQiOjE3NTYxODc2NDQsImp0aSI6IjNjMDdiODg2NTcyZTQyNmNhOTE1ZWNmNWU3ODRlZWU3IiwidXNlcl9pZCI6IjEifQ.fqSXXcDLhw5kkZvaari7PL5j4zsonu_qulKW1Gg03wk`
  }
});