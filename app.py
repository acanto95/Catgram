from flask import Flask, render_template, jsonify
import pymysql
import json
from flask_cors import CORS, cross_origin
from flask import request

app = Flask(__name__)
CORS(app, support_credentials=True)

class Database:
    def __init__(self):
        host = "host"
        user = "user"
        password = "pass"
        db = "cats"
        self.con = pymysql.connect(host=host, user=user, password=password, db=db, cursorclass=pymysql.cursors.
                                   DictCursor)
        self.cur = self.con.cursor()
    def list_cats(self):
        self.cur.execute("SELECT * FROM cats ORDER BY RAND() LIMIT 99")
        result = self.cur.fetchall()
        return result

    def list_favs(self):
        self.cur.execute("SELECT * FROM cats WHERE fav=true")
        result = self.cur.fetchall()
        return result

    def updateCats(self,catId, fav, fav_id):
        sql = "UPDATE cats SET fav=%s, fav_id=%s WHERE id=%s"
        self.cur.execute(sql, (fav, fav_id, catId))
        self.con.commit()
        self.cur.close()
        self.con.close()

        print('Query Successful')

    def doSearch(self,term):
        formatTerm = "%{0}%".format(term)
        sqlstring = "SELECT DISTINCT * FROM breeds WHERE name LIKE %s OR origin LIKE %s OR description LIKE %s"
        self.cur.execute(sqlstring, (formatTerm, formatTerm, formatTerm))
        result = self.cur.fetchall()
        return result

    def doInsert(self, catId, fav_id):
        sql= "INSERT INTO cats( id, fav_id) VALUES (%s,%s)"
        self.cur.execute(sql, (catId, fav_id))
        self.con.commit()
        self.cur.close()
        self.con.close()

    def doDelete(self, catId):
        sql= "DELETE FROM cats WHERE id=%s"
        self.cur.execute(sql, (catId))
        self.con.commit()
        self.cur.close()
        self.con.close()




@app.route('/cats', methods=['GET'])
@cross_origin(supports_credentials=True)
def cats():
    def db_query():
        db = Database()
        cats = db.list_cats()
        return cats
    res = db_query()
    return jsonify(res)

@app.route('/cats/myfavs', methods=['GET'])
@cross_origin(supports_credentials=True)
def favcats():
    def db_query():
        db = Database()
        cats = db.list_favs()
        return cats
    res = db_query()
    return jsonify(res)

@app.route('/cats/update', methods=['POST'])
@cross_origin(supports_credentials=True)
def update():

    rq = request.get_json()
    catId = rq["id"]
    catFav = rq["fav"]
    fav_id = rq["fav_id"]
    db = Database()
    db.updateCats(catId, catFav, fav_id)
    resp = jsonify(success=True)
    return resp

@app.route('/cats/search', methods=['GET'])
@cross_origin(supports_credentials=True)
def searchCats():
    term = request.args.get('term')
    def db_query():
        db = Database()
        cats = db.doSearch(term)
        return cats
    res = db_query()
    return jsonify(res)

@app.route('/cats/insert', methods=['POST'])
@cross_origin(supports_credentials=True)
def insertCat():
    rq = request.get_json()
    catId = rq["id"]
    fav_id = rq["fav_id"]
    db = Database()
    db.doInsert(catId, fav_id)
    resp = jsonify(success=True)
    return resp

@app.route('/cats/delete', methods=['POST'])
@cross_origin(supports_credentials=True)
def deleteCat():
    rq = request.get_json()
    catId = rq["id"]
    db = Database()
    db.doDelete(catId)
    resp = jsonify(success=True)
    return resp


if __name__ == "__main__":
    app.run()



