import mysql.connector
import requests
import json

breedValues = []

rq = requests.get('https://api.thecatapi.com/v1/breeds', headers={"x-api-key": "d4092dd6-9e37-4eb6-bbcd-0a159a003835"});


jsonbreeds = json.loads(rq.content)
	


for dataBreeds in jsonbreeds:
	breedValues.append((dataBreeds["id"], dataBreeds["name"], dataBreeds["origin"], dataBreeds["description"]))

mydb = mysql.connector.connect (

host = "host",
user = "user",
passwd = "pass",
database = "cats"
)



mycursor = mydb.cursor ( )



breedsql = "INSERT INTO breeds(breed_id, name, origin, description) VALUES (%s, %s, %s, %s)"

 

mycursor.executemany( breedsql, breedValues)
 
mydb.commit ( )
 
print ( mycursor.rowcount, "was inserted.")





